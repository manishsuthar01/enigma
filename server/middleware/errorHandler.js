// ── Central Error Handler Middleware ─────────────────────────────────────────
// Catches all errors thrown in routes/controllers or passed via next(err).
// Must be registered AFTER all routes in server.js.

const errorHandler = (err, req, res, _next) => {
    // ── Determine status code ───────────────────────────────────────────────
    let statusCode = err.statusCode || err.status || 500;

    // Malformed JSON body → 400
    if (err.type === 'entity.parse.failed') {
        statusCode = 400;
        err.message = 'Malformed JSON in request body.';
    }

    // ── Log ─────────────────────────────────────────────────────────────────
    const timestamp = new Date().toISOString();
    console.error(`\n❌  [${timestamp}] ${req.method} ${req.originalUrl}`);
    console.error(`   Status : ${statusCode}`);
    console.error(`   Message: ${err.message}`);
    if (process.env.NODE_ENV !== 'production' && err.stack) {
        console.error(`   Stack  : ${err.stack.split('\n').slice(0, 5).join('\n   ')}`);
    }

    // ── Respond ─────────────────────────────────────────────────────────────
    const response = {
        error: err.message || 'Internal Server Error',
        status: statusCode,
        timestamp,
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
