const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GENERATE_PROMPT } = require('../utils/promptTemplate');

// ── Fallback mock contract — fires if API fails ─────────────
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

        // ── Env check ─────────────────────────────────────────────────────
        const apiKey = process.env.GEMINI_API_KEY;

        console.log('\n🔧  Config:');
        console.log('   GEMINI_API_KEY     :', apiKey ? '✅ SET' : '⚠️  NOT SET');

        if (!apiKey) {
            console.warn('\n⚠️  GEMINI_API_KEY not set — using mock fallback');
            return res.json({
                contract: buildMockContract(contractType, party1, party2, details),
                _demo_mode: true,
            });
        }

        // ── Call Gemini API ───────────────────────────────────────────────
        console.log('\n🚀  Calling Gemini API...');
        try {
            const genAI = new GoogleGenerativeAI(apiKey);

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = GENERATE_PROMPT
                .replace('{contractType}', contractType)
                .replace('{party1}', party1)
                .replace('{party2}', party2)
                .replace('{details}', details || "None provided.");

            console.log('\n📤  Prompt sent to Gemini:\n', prompt);

            const result = await model.generateContent(prompt);
            const response = result.response;
            const contractText = response.text();

            console.log('\n📨  Gemini Response Received.');
            console.log('✅  Contract extracted, length:', contractText.length, 'chars');

            return res.json({ contract: contractText.trim(), _demo_mode: false });

        } catch (apiError) {
            console.error('\n❌  Gemini API call failed:');
            console.error('   Message:', apiError.message);
            if (apiError.stack) {
                console.error('   Stack  :', apiError.stack.split('\n').slice(0, 4).join('\n   '));
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


