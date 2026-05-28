const { ApiError } = require('../lib/api-error');

function errorHandler(err, req, res, next) {
    const status = err instanceof ApiError ? err.status : 500;
    const message = err instanceof ApiError ? err.message : (err.message || 'Internal Server Error');

    console.error('[Error Handler]', err);

    const payload = {
        error: message,
        ...(err instanceof ApiError && err.details ? { details: err.details } : {})
    };

    if (res.headersSent) return next(err);
    res.status(status).json(payload);
}

module.exports = { errorHandler };
