const express = require('express');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/async-handler');
const { loginBody } = require('../schemas/auth');
const { login } = require('../controllers/auth');

const router = express.Router();

router.post('/login', validate({ body: loginBody }), asyncHandler(login));

module.exports = { router };
