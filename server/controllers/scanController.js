const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ANALYSIS_PROMPT } = require('../utils/promptTemplate');

// ── Mock fallback — used when the API is unreachable ───────────────
const MOCK_RESPONSE = {
    clauses: {},
    risk: {
        overallRisk: "Red",
        summary: "Demo mode — API unavailable. This is a placeholder response.",
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

// ── Text Extraction Helper ────────────────────────────────────────────────
const extractTextFromBuffer = async (buffer, mimetype) => {
    try {
        if (mimetype === 'text/plain') {
            return buffer.toString('utf-8');
        }

        if (mimetype === 'application/pdf') {
            const data = new Uint8Array(buffer);
            const loadingTask = pdfjs.getDocument({ data });
            const pdfDocument = await loadingTask.promise;

            let fullText = '';
            for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
            return fullText;
        }

        throw new Error(`Unsupported file type: ${mimetype}. Only TXT and PDF are supported.`);
    } catch (err) {
        console.error('❌  Text extraction failed:', err.message);
        throw err;
    }
};

// ── Controller ────────────────────────────────────────────────────────────
const scanContract = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded. Please upload a PDF or TXT file.' });
        }

        console.log('\n──────────────────────────────────────────────────');
        console.log('📥  SCAN REQUEST');
        console.log('──────────────────────────────────────────────────');
        console.log(`   File: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB) | Mime: ${req.file.mimetype}`);

        // ── Extract Text ──────────────────────────────────────────────────
        console.log('⏳  Extracting text from file...');
        const documentText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);
        console.log(`✅  Text extracted, length: ${documentText.length} chars`);

        if (!documentText.trim()) {
            return res.status(400).json({ error: 'Could not extract any text from the uploaded document.' });
        }

        // ── Call Gemini API ───────────────────────────────────────────────
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️  GEMINI_API_KEY not set — returning mock response');
            return res.json(MOCK_RESPONSE);
        }

        console.log(`🚀  Calling Gemini API for analysis...`);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = ANALYSIS_PROMPT.replace('{contractText}', documentText);

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const responseText = result.response.text();
        console.log(`📨  Gemini Response Received.`);

        let riskData;
        try {
            riskData = JSON.parse(responseText);
            console.log('✅  JSON response parsed successfully');
        } catch (parseError) {
            console.error('❌  Failed to parse Gemini JSON output:', responseText);
            throw new Error('Invalid JSON from Gemini');
        }

        // Wrap riskData in the expected frontend format
        const finalResponse = {
            risk: riskData,
            _demo_mode: false
        };

        res.json(finalResponse);

    } catch (error) {
        console.error('❌  Scan Controller Error:', error.message);
        console.error(error); // Detailed error dump
        if (error.stack) console.error('   Stack:', error.stack.split('\n')[1]);
        res.json(MOCK_RESPONSE);
    }
};

module.exports = { scanContract };
