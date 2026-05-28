const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { config } = require('../src/config');

function splitSql(sql) {
    return sql
        .split(/;\s*\n/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => s + ';');
}

async function run() {
    const initPath = path.resolve(__dirname, '..', '..', 'db', 'init.sql');
    const seedPath = path.resolve(__dirname, '..', '..', 'db', 'seed.sql');

    const initSql = fs.readFileSync(initPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    const conn = await mysql.createConnection({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        charset: 'utf8mb4',
        multipleStatements: true
    });

    try {
        for (const stmt of splitSql(initSql)) {
            await conn.query(stmt);
        }
        for (const stmt of splitSql(seedSql)) {
            await conn.query(stmt);
        }
    } finally {
        await conn.end();
    }

    process.stdout.write('Database initialized and seeded.\n');
}

run().catch(e => {
    process.stderr.write(String(e && e.stack ? e.stack : e) + '\n');
    process.exit(1);
});
