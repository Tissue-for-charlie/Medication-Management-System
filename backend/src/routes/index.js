const express = require('express');
const { router: authRouter } = require('./auth');
const { router: usersRouter } = require('./users');
const { router: medicinesRouter } = require('./medicines');
const { router: categoriesRouter } = require('./categories');
const { router: suppliersRouter } = require('./suppliers');
const { router: procurementRouter } = require('./procurement');
const { router: salesRouter } = require('./sales');
const { router: statsRouter } = require('./stats');
const { pool } = require('../db/pool');

// 引入JWT认证中间件
const authenticate = require('../middleware/auth');

const router = express.Router();

// 健康检查端点（公开）
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/db/ping', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (e) {
    next(e);
  }
});

// 公开的API（不需要认证）
router.use('/auth', authRouter);

// 受保护的API（需要JWT认证）
router.use('/users', authenticate('超级管理员'), usersRouter);
router.use('/medicines', authenticate(), medicinesRouter);
router.use('/categories', authenticate('超级管理员'), categoriesRouter);
router.use('/suppliers', authenticate('超级管理员'), suppliersRouter);
router.use('/procurement', authenticate('超级管理员'), procurementRouter);
router.use('/sales', authenticate(), salesRouter);
router.use('/stats', authenticate('超级管理员'), statsRouter);

module.exports = { router };