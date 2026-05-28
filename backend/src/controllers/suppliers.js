const { pool } = require('../db/pool');
const { ApiError } = require('../lib/api-error');

function toPaging(query, total) {
    const page = query.page;
    const pageSize = query.pageSize;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return { page, pageSize, total, totalPages };
}

async function listSuppliers(req, res) {
    const { page, pageSize, search } = req.query;
    const where = [];
    const args = [];
    if (search) {
        where.push('(name LIKE ? OR contact LIKE ? OR phone LIKE ?)');
        args.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [[c]] = await pool.execute(`SELECT COUNT(*) AS c FROM suppliers ${whereSql}`, args);
    const limit = Math.max(1, Math.min(1000, Number(pageSize)));
    const offset = Math.max(0, Number((page - 1) * pageSize));
    const [rows] = await pool.execute(
        `SELECT id, name, contact, phone, address, rating, status
       FROM suppliers
       ${whereSql}
       ORDER BY id ASC
       LIMIT ${limit} OFFSET ${offset}`,
        args
    );
    res.json({ data: rows, pagination: toPaging(req.query, c.c) });
}

async function getSupplier(req, res) {
    const [rows] = await pool.execute(
        'SELECT id, name, contact, phone, address, rating, status FROM suppliers WHERE id = ?',
        [req.params.id]
    );
    if (!rows[0]) throw new ApiError(404, '供应商不存在');
    res.json({ data: rows[0] });
}

async function createSupplier(req, res) {
    const { name, contact, phone, address, rating, status } = req.body;
    try {
        const [r] = await pool.execute(
            'INSERT INTO suppliers (name, contact, phone, address, rating, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, contact, phone, address, rating, status]
        );
        const [rows] = await pool.execute(
            'SELECT id, name, contact, phone, address, rating, status FROM suppliers WHERE id = ?',
            [r.insertId]
        );
        res.status(201).json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '供应商名称已存在');
        throw e;
    }
}

async function updateSupplier(req, res) {
    const id = req.params.id;
    const fields = [];
    const args = [];
    for (const [k, v] of Object.entries(req.body)) {
        if (['name', 'contact', 'phone', 'address', 'rating', 'status'].includes(k)) {
            fields.push(`${k} = ?`);
            args.push(v);
        }
    }
    if (!fields.length) throw new ApiError(400, '无可更新字段');
    try {
        const [r] = await pool.execute(`UPDATE suppliers SET ${fields.join(', ')} WHERE id = ?`, [...args, id]);
        if (r.affectedRows === 0) throw new ApiError(404, '供应商不存在');
        const [rows] = await pool.execute(
            'SELECT id, name, contact, phone, address, rating, status FROM suppliers WHERE id = ?',
            [id]
        );
        res.json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '供应商名称已存在');
        throw e;
    }
}

async function deleteSupplier(req, res) {
    const [[pc]] = await pool.execute('SELECT COUNT(*) AS c FROM procurement_orders WHERE supplier_id = ?', [req.params.id]);
    if (pc.c > 0) throw new ApiError(409, '该供应商已产生采购单记录，无法删除');
    const [r] = await pool.execute('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) throw new ApiError(404, '供应商不存在');
    res.json({ data: true });
}

module.exports = { listSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };
