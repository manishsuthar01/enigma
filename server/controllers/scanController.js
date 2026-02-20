const http = require('http');
const https = require('https');

// ── Mock fallback — used when the RAG server is unreachable ───────────────
const MOCK_RESPONSE = {
    clauses: {},
    risk: {
        overallRisk: "Red",
        summary: "Demo mode — RAG server unavailable. This is a placeholder response.",
        risks: [
            {
                severity: "High",
                title: "Uncapped Indemnification",
                issue: "The indemnification clause has no monetary cap.",
                suggestion: "Add a liability cap tied to fees paid."
            },
            {
                severity: "Medium",
                title: "Broad Non-Compete",
                issue: "Non-compete scope is geographically excessive.",
                suggestion: "Limit to direct competitors and 6-month period."
            }
        ]
    },
    _demo_mode: true
};

// ── Forward file to RAG server as multipart upload ────────────────────────
const forwardFileToRAG = (url, file) =>
    new Promise((resolve, reject) => {
        const boundary = `----FormBoundary${Date.now()}`;
        const parsed = new URL(url);
        const lib = parsed.protocol === 'https:' ? https : http;

        // Build multipart body
        const header = Buffer.from(
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="file"; filename="${file.originalname}"\r\n` +
            `Content-Type: ${file.mimetype}\r\n\r\n`
        );
        const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
        const body = Buffer.concat([header, file.buffer, footer]);

        const options = {
            hostname: parsed.hostname,
            port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
            path: parsed.pathname + parsed.search,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': body.length,
            },
        };

        const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, data }); }
            });
        });

        req.on('error', reject);
        req.setTimeout(120000, () => { req.destroy(); reject(new Error('RAG server timed out')); });
        req.write(body);
        req.end();
    });

// ── Controller ────────────────────────────────────────────────────────────
const scanContract = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded. Please upload a PDF or TXT file.' });
        }

        console.log('\n──────────────────────────────────────────────────');
        console.log('📥  SCAN REQUEST');
        console.log('──────────────────────────────────────────────────');
        console.log(`   File: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

        // ── Forward raw file to RAG server ──────────────────────────────
        const ragBase = process.env.RAG_SERVER_URL;
        if (!ragBase) {
            console.warn('⚠️  RAG_SERVER_URL not set — returning mock response');
            return res.json(MOCK_RESPONSE);
        }

        const scanUrl = `${ragBase}/scan`;
        console.log(`🚀  Forwarding file to RAG: ${scanUrl}`);

        const ragResponse = await forwardFileToRAG(scanUrl, req.file);
        console.log(`📨  RAG Response — Status: ${ragResponse.status}`);

        if (ragResponse.status !== 200) {
            console.error('❌  RAG server error:', ragResponse.data);
            return res.json(MOCK_RESPONSE);
        }

        res.json(ragResponse.data);

    } catch (error) {
        console.error('❌  Scan Controller Error:', error.message);
        res.json(MOCK_RESPONSE);
    }
};

module.exports = { scanContract };
