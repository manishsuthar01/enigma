const http = require('http');
const https = require('https');

// ── Fallback mock contract — fires if RAG server is unreachable ─────────────
const buildMockContract = (type, party1, party2, details) => `${type.toUpperCase()}

This ${type} ("Agreement") is entered into as of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}, by and between:

Party A: ${party1 || 'Party A'}
Party B: ${party2 || 'Party B'}

1. SCOPE OF AGREEMENT
The parties agree to the following terms and conditions as outlined in this ${type}. This agreement is legally binding upon execution by both parties.

2. KEY TERMS & CONDITIONS
${details || 'To be agreed upon by both parties.'}

3. DURATION
This Agreement shall commence on the date of signing and shall remain in effect until terminated by either party with thirty (30) days written notice, unless otherwise specified herein.

4. CONFIDENTIALITY
Both parties agree to maintain strict confidentiality of all proprietary information, trade secrets, and business data shared under this Agreement.

5. INTELLECTUAL PROPERTY
All intellectual property created specifically for this Agreement shall be governed by the terms negotiated between the parties and documented in an exhibit to this Agreement.

6. LIMITATION OF LIABILITY
Neither party shall be liable for indirect, incidental, or consequential damages. Total liability shall not exceed the total fees paid under this Agreement in the preceding three (3) months.

7. DISPUTE RESOLUTION
Any disputes arising out of or relating to this Agreement shall first be subject to good-faith negotiation, then mediation, and finally binding arbitration under applicable law.

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction agreed upon by both parties.

9. ENTIRE AGREEMENT
This document constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior negotiations, representations, or agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

${party1 || 'Party A'}                    ${party2 || 'Party B'}
_______________________                    _______________________
Signature                                  Signature
Date: _______________                      Date: _______________`;

// ── Minimal HTTP/HTTPS fetch helper (no axios dependency) ──────────────────
const makeRequest = (url, payload) =>
    new Promise((resolve, reject) => {
        const body = JSON.stringify(payload);
        const parsed = new URL(url);
        const lib = parsed.protocol === 'https:' ? https : http;

        const options = {
            hostname: parsed.hostname,
            port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
            path: parsed.pathname + parsed.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        };

        const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, data: { contract_text: data } }); }
            });
        });

        req.on('error', reject);
        req.setTimeout(120000, () => { req.destroy(); reject(new Error('RAG server timed out')); });
        req.write(body);
        req.end();
    });

// ── Controller ─────────────────────────────────────────────────────────────
const generateContract = async (req, res) => {
    const SEP = '─'.repeat(50);

    try {
        console.log('\n' + SEP);
        console.log('📥  GENERATE REQUEST');
        console.log(SEP);
        console.log('Body:', JSON.stringify(req.body, null, 2));

        const { contractType, party1, party2, details } = req.body;

        // ── Validate ──────────────────────────────────────────────────────
        if (!contractType || !party1 || !party2) {
            console.warn('❌  Validation failed — missing required fields');
            console.warn('   contractType:', contractType, '| party1:', party1, '| party2:', party2);
            return res.status(400).json({
                error: 'Contract type and both party names are required.',
            });
        }
        console.log('✅  Validation passed');

        // ── Build description ─────────────────────────────────────────────
        const description = [
            `I want to generate a ${contractType}`,
            `between ${party1.trim()} (Party A) and ${party2.trim()} (Party B)`,
            details?.trim() ? `with the following terms: ${details.trim()}` : '',
        ].filter(Boolean).join(', ');

        const ragPayload = { description };
        console.log('\n📤  RAG Payload:');
        console.log(JSON.stringify(ragPayload, null, 2));

        // ── Env check ─────────────────────────────────────────────────────
        const ragUrl = process.env.RAG_SERVER_URL;
        const ragPath = process.env.RAG_SERVER_ENDPOINT;
        const endpoint = ragUrl ? ragUrl.replace(/\/$/, '') + ragPath : null;

        console.log('\n🔧  Config:');
        console.log('   RAG_SERVER_URL     :', ragUrl || '⚠️  NOT SET');
        console.log('   RAG_SERVER_ENDPOINT:', ragPath);
        console.log('   Full endpoint      :', endpoint || '⚠️  SKIPPED (no URL)');

        if (!ragUrl) {
            console.warn('\n⚠️  RAG_SERVER_URL not set — using mock fallback');
            return res.json({
                contract: buildMockContract(contractType, party1, party2, details),
                _demo_mode: true,
            });
        }

        // ── Call RAG server ───────────────────────────────────────────────
        console.log('\n🚀  Calling RAG server...');
        try {
            const ragRes = await makeRequest(endpoint, ragPayload);

            console.log('\n📨  RAG Response:');
            console.log('   Status :', ragRes.status);
            // console.log('   Body   :', JSON.stringify(ragRes.data, null, 2));

            if (ragRes.status >= 200 && ragRes.status < 300) {
                // Validate the expected 'contract' field exists
                const contractText = ragRes.data?.contract
                    || ragRes.data?.contract_text
                    || ragRes.data?.text
                    || ragRes.data?.content
                    || ragRes.data?.result;

                if (!contractText) {
                    console.warn('⚠️  No usable text field in RAG response');
                    console.warn('   Keys received:', Object.keys(ragRes.data || {}));
                    throw new Error('"contract" field absent in RAG response');
                }

                if (!ragRes.data?.contract) {
                    console.warn('⚠️  "contract" key missing — used fallback key from RAG response');
                }

                console.log('✅  Contract extracted, length:', contractText.length, 'chars');
                return res.json({ contract: contractText, _demo_mode: false });

            } else {
                console.error('\n❌  RAG server returned error:');
                console.error('   Status:', ragRes.status);
                console.error('   Body  :', JSON.stringify(ragRes.data, null, 2));
                throw new Error(`RAG server returned status ${ragRes.status}: ${JSON.stringify(ragRes.data)}`);
            }

        } catch (ragError) {
            console.error('\n❌  RAG call failed:');
            console.error('   Message:', ragError.message);
            if (ragError.stack) {
                console.error('   Stack  :', ragError.stack.split('\n').slice(0, 4).join('\n   '));
            }
            console.warn('   → Falling back to mock contract\n');
            return res.json({
                contract: buildMockContract(contractType, party1, party2, details),
                _demo_mode: true,
            });
        }

    } catch (error) {
        console.error('\n💥  Unhandled controller error:');
        console.error('   Message:', error.message);
        console.error('   Stack  :', error.stack);
        res.status(500).json({ error: error.message || 'Contract generation failed.' });
    }
};

module.exports = { generateContract };

