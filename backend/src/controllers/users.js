const { pool } = require('../db/pool');
const { ApiError } = require('../lib/api-error');
const { toPaging } = require('../lib/pagination');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

async function listUsers(req, res) {
    const { page, pageSize, search, role, status } = req.query;
    const where = [];
    const args = [];
    if (search) {
        where.push('(username LIKE ? OR name LIKE ? OR phone LIKE ?)');
        args.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (role) {
        where.push('role = ?');
        args.push(role);
    }
    if (status) {
        where.push('status = ?');
        args.push(status);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [[c]] = await pool.execute(`SELECT COUNT(*) AS c FROM users ${whereSql}`, args);
    const limit = Math.max(1, Math.min(1000, Number(pageSize)));
    const offset = Math.max(0, Number((page - 1) * pageSize));
    const [rows] = await pool.execute(
        `SELECT id, username, name, phone, role, status, DATE_FORMAT(created_at, "%Y-%m-%d") AS created FROM users ${whereSql} ORDER BY id ASC LIMIT ? OFFSET ?`,
        [...args, limit, offset]
    );
    res.json({ data: rows, pagination: toPaging(req.query, c.c) });
}

async function getUser(req, res) {
    const [rows] = await pool.execute(
        'SELECT id, username, name, phone, role, status, DATE_FORMAT(created_at, "%Y-%m-%d") AS created FROM users WHERE id = ?',
        [req.params.id]
    );
    if (!rows[0]) throw new ApiError(404, '用户不存在');
    res.json({ data: rows[0] });
}

async function createUser(req, res) {
    const { username, name, phone, role, status, password, created } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const createdAt = created || new Date().toISOString().slice(0, 10);
    try {
        const [r] = await pool.execute(
            'INSERT INTO users (username, name, phone, role, status, password, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, name, phone, role, status, hashedPassword, createdAt]
        );
        const id = r.insertId;
        const [rows] = await pool.execute(
            'SELECT id, username, name, phone, role, status, DATE_FORMAT(created_at, "%Y-%m-%d") AS created FROM users WHERE id = ?',
            [id]
        );
        res.status(201).json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '用户名已存在');
        throw e;
    }
}

async function updateUser(req, res) {
    const id = req.params.id;
    const fields = [];
    const args = [];
    for (const [k, v] of Object.entries(req.body)) {
        if (k === 'created') continue;
        if (k === 'password') {
            const hashedPassword = await bcrypt.hash(v, SALT_ROUNDS);
            fields.push('password = ?');
            args.push(hashedPassword);
            continue;
        }
        if (['username', 'name', 'phone', 'role', 'status'].includes(k)) {
            fields.push(`${k} = ?`);
            args.push(v);
        }
    }
    if (!fields.length) throw new ApiError(400, '无可更新字段');
    try {
        const [r] = await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, [...args, id]);
        if (r.affectedRows === 0) throw new ApiError(404, '用户不存在');
        const [rows] = await pool.execute(
            'SELECT id, username, name, phone, role, status, DATE_FORMAT(created_at, "%Y-%m-%d") AS created FROM users WHERE id = ?',
            [id]
        );
        res.json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '用户名已存在');
        throw e;
    }
}

async function deleteUser(req, res) {
    const [r] = await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) throw new ApiError(404, '用户不存在');
    res.json({ data: true });
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
