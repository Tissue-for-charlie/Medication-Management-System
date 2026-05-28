const { pool } = require('../db/pool');

async function recordAudit({ userId, username, action, resource, resourceId, detail, ip }) {
  try {
    await pool.execute(
      'INSERT INTO audit_log (user_id, username, action, resource, resource_id, detail, ip) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId || null, username || 'system', action, resource, resourceId || null, detail || '', ip || '']
    );
  } catch {
    // 审计日志记录失败不应影响业务操作
  }
}

module.exports = { recordAudit };
