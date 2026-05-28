const { pool } = require('../db/pool');
const { ApiError } = require('../lib/api-error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');

async function login(req, res) {
    const { username, password } = req.body;
    const [rows] = await pool.execute(
        'SELECT id, username, name, phone, role, status, password, DATE_FORMAT(created_at, "%Y-%m-%d") AS created FROM users WHERE username = ? LIMIT 1',
        [username]
    );
    const u = rows[0];
    if (!u || !(await bcrypt.compare(password, u.password)) || u.status !== '启用') {
        throw new ApiError(401, '账号或密码错误');
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
        { id: u.id, username: u.username, role: u.role },
        config.jwtSecret,
        { expiresIn: '2h' }
    );
    
    delete u.password;
    res.json({ 
        data: { 
            user: u, 
            token: token,
            tokenType: 'Bearer'
        } 
    });
}

module.exports = { login };
