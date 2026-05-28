const mysql = require('mysql2/promise');
const { config } = require('../config');

const pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: config.db.connectionLimit,
    queueLimit: 0,
    dateStrings: true
});

async function ping() {
    const c = await pool.getConnection();
    try {
        await c.ping();
    } finally {
        c.release();
    }
}

module.exports = { pool, ping };
