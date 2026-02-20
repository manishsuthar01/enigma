const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Default
        const genAI_v1 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, "v1");
        // There isn't a direct listModels on the genAI object in the client SDK usually, 
        // it's often used for generation. However, we can try to find the right one or just guess common ones.
        // Actually, let's try gemini-1.5-flash (with no beta in model name) or gemini-pro.

        console.log("Trying common model names on default (v1beta) and v1 endpoints...");
        console.log("Trying common model names...");

        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];

        for (const modelName of modelsToTry) {
            for (const sdk of [{ name: 'v1beta', instance: genAI }, { name: 'v1', instance: genAI_v1 }]) {
                try {
                    process.stdout.write(`Testing ${modelName} on ${sdk.name}... `);
                    const model = sdk.instance.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent("test");
                    console.log(`✅ Success!`);
                } catch (e) {
                    console.log(`❌ Failed: ${e.message.split('\n')[0]}`);
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
