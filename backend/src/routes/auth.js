const express = require('express');
const rateLimit = require('express-rate-limit');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/async-handler');
const { loginBody } = require('../schemas/auth');
const { login } = require('../controllers/auth');

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: { message: '登录请求过于频繁，请稍后再试' } },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login', loginLimiter, validate({ body: loginBody }), asyncHandler(login));

module.exports = { router };
