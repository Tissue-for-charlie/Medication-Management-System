const path = require('path');
const express = require('express');
const cors = require('cors');
const { config } = require('./config');
const { router: apiRouter } = require('./routes');
const { errorHandler } = require('./middleware/error-handler');
const { ApiError } = require('./lib/api-error');

function createCors() {
    if (!config.corsOrigin || config.corsOrigin === '*') {
        return cors({ origin: true });
    }
    const allowed = config.corsOrigin.split(',').map(s => s.trim()).filter(Boolean);
    return cors({
        origin: (origin, cb) => {
            if (!origin) return cb(null, true);
            if (allowed.includes(origin)) return cb(null, true);
            cb(new ApiError(403, 'CORS blocked'));
        }
    });
}

function createApp() {
    const app = express();

    app.use(createCors());
    app.use(express.json({ limit: '1mb' }));

    app.use('/api/v1', apiRouter);

    const publicDir = path.resolve(__dirname, '..', '..');
    app.use(express.static(publicDir));

    app.get('/', (req, res) => {
        res.redirect('/pharmacy-management.html');
    });

    app.use((req, res, next) => {
        next(new ApiError(404, 'Not Found'));
    });

    app.use(errorHandler);

    return app;
}

module.exports = { createApp };
