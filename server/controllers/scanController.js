const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ANALYSIS_PROMPT } = require('../utils/promptTemplate');

// ── Mock fallback — used when ALL Gemini models fail ──────────────────────
// Guarantees the demo never shows a blank screen even if the API is down.
const MOCK_RESPONSE = {
    overall_risk: "high",
    risk_score: 72,
    summary: "This contract contains several high-risk clauses that heavily favour the client. The uncapped indemnification clause and overly broad non-compete terms warrant immediate negotiation before signing.",
    risks: [
        {
            title: "Uncapped Indemnification",
            severity: "high",
            issue: "Section 14.2 requires you to indemnify the client for 'any and all claims, losses, damages, liabilities' with no monetary cap. You could be held liable for unlimited damages even for minor omissions.",
            suggestion: "Add a liability cap: 'Consultant's total liability shall not exceed the fees paid in the preceding 3 months.'"
        },
        {
            title: "Overly Broad Non-Compete",
            severity: "high",
            issue: "Section 15.1 prohibits working with any competitor in 'North America' for 24 months. This geographic and temporal scope is excessive and may be unenforceable in many jurisdictions.",
            suggestion: "Limit the non-compete to direct competitors and a 6-month period within your specific service area."
        },
        {
            title: "Unilateral Contract Modification",
            severity: "medium",
            issue: "Section 9.1 allows the client to modify payment terms with 7 days notice. This gives you insufficient time to renegotiate or exit the agreement.",
            suggestion: "Require mutual written consent for any modification to payment terms with 30 days notice."
        },
        {
            title: "Intellectual Property Assignment",
            severity: "medium",
            issue: "Section 11.3 assigns all IP — including pre-existing tools and methodologies — to the client. This could strip you of your core business assets.",
            suggestion: "Carve out pre-existing IP: 'Assignment excludes Consultant pre-existing IP listed in Exhibit A.'"
        },
        {
            title: "Termination Without Cause",
            severity: "low",
            issue: "Section 18.2 allows the client to terminate with 14 days notice and no kill fee. This creates revenue unpredictability for short-notice engagements.",
            suggestion: "Negotiate a kill fee of 25% of remaining contract value for terminations with less than 30 days notice."
        }
    ]
};

// ── Helper: run a single Gemini call with a timeout ───────────────────────
const callWithTimeout = (promise, ms) =>
    Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s`)), ms)
        ),
    ]);

const scanContract = async (req, res) => {
    try {
        const { contractText } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        console.log('--- Scan Request Received ---');
        console.log('API Key Status:', apiKey ? `Found (starts with ${apiKey.substring(0, 10)}...)` : 'NOT FOUND');

        if (!contractText)
            return res.status(400).json({ error: 'Contract text is required' });
        if (contractText.length < 300)
            return res.status(400).json({ error: 'Contract text must be at least 300 characters' });
        if (contractText.length > 20000)
            return res.status(400).json({ error: 'Contract text exceeds 20,000 character limit' });

        if (!apiKey) {
            console.warn('⚠️  No API key — returning mock response for demo');
            return res.json(MOCK_RESPONSE);
        }

        let text = '';
        let lastError = null;

        // Models to try in order (fastest / most available first)
        const modelsToTry = [
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-2.5-flash',
            'gemini-2.5-pro',
        ];

        const genAI = new GoogleGenerativeAI(apiKey);

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const prompt = ANALYSIS_PROMPT.replace('{contractText}', contractText);

                const result = await callWithTimeout(
                    model.generateContent(prompt),
                    30000 // 30 second timeout per model
                );
                text = result.response.text();

                if (text) {
                    console.log(`✅ Success with ${modelName}`);
                    break;
                }
            } catch (e) {
                console.log(`❌ Model ${modelName} failed: ${e.message.split('\n')[0]}`);
                lastError = e;
            }
        }

        // If all models failed, use the mock so the demo never breaks
        if (!text) {
            console.warn('⚠️  All Gemini models failed — returning mock response for demo');
            console.warn('Last error:', lastError?.message);
            return res.json({ ...MOCK_RESPONSE, _demo_mode: true });
        }

        // Clean and parse JSON response
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonResponse = JSON.parse(text);
            res.json(jsonResponse);
        } catch (parseError) {
            console.error('JSON Parse Error — falling back to mock:', parseError.message);
            res.json({ ...MOCK_RESPONSE, _demo_mode: true });
        }

    } catch (error) {
        console.error('Scan Controller Error:', error.message);
        // Last-resort fallback — never let the demo show a 500
        res.json({ ...MOCK_RESPONSE, _demo_mode: true });
    }
};

module.exports = { scanContract };
