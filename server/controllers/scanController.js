const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ANALYSIS_PROMPT } = require('../utils/promptTemplate');

const scanContract = async (req, res) => {
    try {
        const { contractText } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        console.log('--- Scan Request Received ---');
        console.log('API Key Status:', apiKey ? `Found (starts with ${apiKey.substring(0, 10)}...)` : 'NOT FOUND');

        if (!contractText) {
            return res.status(400).json({ error: 'Contract text is required' });
        }
        if (contractText.length < 300) {
            return res.status(400).json({ error: 'Contract text must be at least 300 characters' });
        }
        if (contractText.length > 20000) {
            return res.status(400).json({ error: 'Contract text exceeds 20,000 character limit' });
        }

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined in environment');
        }

        let text = '';

        // Try different API versions and models as configured by user
        const apiConfigs = [
            { version: 'v1', models: ["gemini-2.5-flash", "gemini-2.5-flash-preview", "gemini-2.5-pro"] },
            { version: 'v1beta', models: ["gemini-2.5-flash", "gemini-2.5-flash-preview", "gemini-2.5-pro"] }
        ];

        let lastError = null;

        for (const config of apiConfigs) {
            console.log(`Trying API version: ${config.version}`);
            const genAI = new GoogleGenerativeAI(apiKey, config.version);

            for (const modelName of config.models) {
                try {
                    console.log(`Attempting model: ${modelName} (${config.version})`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const prompt = ANALYSIS_PROMPT.replace('{contractText}', contractText);
                    const result = await model.generateContent(prompt);
                    text = result.response.text();
                    if (text) {
                        console.log(`✅ Success with ${modelName} on ${config.version}`);
                        break;
                    }
                } catch (e) {
                    console.log(`❌ Model ${modelName} (${config.version}) failed: ${e.message.split('\n')[0]}`);
                    lastError = e;
                }
            }
            if (text) break;
        }

        if (!text && lastError) throw lastError;

        // Clean text and parse JSON
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonResponse = JSON.parse(text);
            res.json(jsonResponse);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError, 'Raw Text:', text);
            res.status(500).json({ error: 'Failed to parse AI response' });
        }
    } catch (error) {
        console.error('Scan Error:', error.message);
        res.status(500).json({
            error: error.message || 'An error occurred during scanning'
        });
    }
};

module.exports = { scanContract };
