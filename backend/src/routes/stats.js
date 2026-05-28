const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { getStats } = require('../controllers/stats');

const router = express.Router();

router.get('/', asyncHandler(getStats));

module.exports = { router };
