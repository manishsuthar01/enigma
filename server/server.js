const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ── Security Headers ────────────────────────────────────────────────────────
// Helmet sets ~15 HTTP headers that protect against well-known web vulnerabilities
// (XSS, clickjacking, MIME-sniffing, etc.)
app.disable('x-powered-by');
app.use(helmet());

// ── Body Parser with size limit ─────────────────────────────────────────────
// Contracts max 20k chars ≈ ~20kb, so 50kb is generous but prevents abuse
app.use(express.json({ limit: '50kb' }));

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(cors());

// ── Rate Limiting — Global ──────────────────────────────────────────────────
// 100 requests per minute per IP across all endpoints
const globalLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 minute
    max: 100,
    standardHeaders: true,     // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,      // Disable `X-RateLimit-*` headers
    message: {
        error: 'Too many requests — please slow down.',
        status: 429,
        retryAfterMs: 60000,
    },
});
app.use(globalLimiter);

// ── Rate Limiting — API endpoints ───────────────────────────────────────────
// 20 requests per minute per IP on /api/* (each call costs Gemini tokens)
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'API rate limit exceeded — max 20 requests per minute.',
        status: 429,
        retryAfterMs: 60000,
    },
});
app.use('/api', apiLimiter);

// ── Minimal Request Logger ──────────────────────────────────────────────────
app.use((req, _res, next) => {
    const ts = new Date().toISOString().slice(11, 19);
    console.log(`[${ts}] ${req.method} ${req.originalUrl} — ${req.ip}`);
    next();
});

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/scan', require('./routes/scan'));
app.use('/api/generate', require('./routes/generate'));

// ── Health check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send('Legal-GPT API is running ✅');
});

// ── 404 Handler — unknown routes ────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        error: `Route not found: ${req.method} ${req.originalUrl}`,
        status: 404,
    });
});

// ── Central Error Handler ───────────────────────────────────────────────────
// MUST be registered last — catches all errors from routes/controllers
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
    console.log(`\n✅  Server running on http://localhost:${PORT}`);
    console.log(`   RAG URL      : ${process.env.RAG_SERVER_URL || '⚠️  not set (mock mode)'}`);
    console.log(`   RAG Endpoint : ${process.env.RAG_SERVER_ENDPOINT || '/generate-contract'}`);
    console.log(`   Gemini Key   : ${process.env.GEMINI_API_KEY ? 'found ✅' : '⚠️  missing'}`);
    console.log(`   Security     : helmet ✅ | rate-limit ✅ | error-handler ✅\n`);
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
