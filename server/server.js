const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/scan', require('./routes/scan'));
app.use('/api/generate', require('./routes/generate'));

// Health check
app.get('/', (req, res) => {
    res.send('Legal-GPT API is running ✅');
});

// Start Server
const server = app.listen(PORT, () => {
    console.log(`\n✅  Server running on http://localhost:${PORT}`);
    console.log(`   RAG URL      : ${process.env.RAG_SERVER_URL || '⚠️  not set (mock mode)'}`);
    console.log(`   RAG Endpoint : ${process.env.RAG_SERVER_ENDPOINT || '/generate-contract'}`);
    console.log(`   Gemini Key   : ${process.env.GEMINI_API_KEY ? 'found ✅' : '⚠️  missing'}\n`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌  Port ${PORT} is already in use.`);
        console.error(`   Another server is running on this port.`);
        console.error(`   Either kill it first, or change PORT in .env\n`);
    } else {
        console.error('\n❌  Server startup error:', err.message);
    }
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('\n💥  Uncaught exception:', err.message);
    console.error(err.stack);
    process.exit(1);
});
