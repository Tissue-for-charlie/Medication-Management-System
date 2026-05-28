const { pool } = require('../db/pool');
const { ApiError } = require('../lib/api-error');

function toPaging(query, total) {
    const page = query.page;
    const pageSize = query.pageSize;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return { page, pageSize, total, totalPages };
}

function statusFromStock(stock) {
    if (stock < 20) return '预警';
    if (stock < 50) return '不足';
    return '充足';
}

async function getCategoryIdByName(name) {
    const [rows] = await pool.execute('SELECT id FROM categories WHERE name = ? LIMIT 1', [name]);
    if (!rows[0]) throw new ApiError(400, '分类不存在');
    return rows[0].id;
}

async function listMedicines(req, res) {
    const { page, pageSize, search, category, status } = req.query;
    const where = [];
    const args = [];

    if (search) {
        where.push('(m.name LIKE ? OR m.code LIKE ? OR m.maker LIKE ?)');
        args.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
        where.push('c.name = ?');
        args.push(category);
    }
    if (status) {
        where.push('m.status = ?');
        args.push(status);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [[c]] = await pool.execute(
        `SELECT COUNT(*) AS c
       FROM medicines m
       JOIN categories c ON c.id = m.category_id
       ${whereSql}`,
        args
    );

    const limit = Math.max(1, Math.min(1000, Number(pageSize)));
    const offset = Math.max(0, Number((page - 1) * pageSize));
    const [rows] = await pool.execute(
        `SELECT m.id, m.code, m.name, c.name AS category, m.spec, m.price, m.stock,
            DATE_FORMAT(m.expire_date, "%Y-%m-%d") AS expire,
            m.maker, m.status
       FROM medicines m
       JOIN categories c ON c.id = m.category_id
       ${whereSql}
       ORDER BY m.id ASC
       LIMIT ${limit} OFFSET ${offset}`,
        args
    );
    res.json({ data: rows, pagination: toPaging(req.query, c.c) });
}

async function getMedicine(req, res) {
    const [rows] = await pool.execute(
        `SELECT m.id, m.code, m.name, c.name AS category, m.spec, m.price, m.stock,
            DATE_FORMAT(m.expire_date, "%Y-%m-%d") AS expire,
            m.maker, m.status
       FROM medicines m
       JOIN categories c ON c.id = m.category_id
       WHERE m.id = ?`,
        [req.params.id]
    );
    if (!rows[0]) throw new ApiError(404, '药品不存在');
    res.json({ data: rows[0] });
}

async function createMedicine(req, res) {
    const { code, name, category, spec, price, stock, expire, maker } = req.body;
    const categoryId = await getCategoryIdByName(category);
    const status = statusFromStock(stock);
    try {
        const [r] = await pool.execute(
            'INSERT INTO medicines (code, name, category_id, spec, price, stock, expire_date, maker, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [code, name, categoryId, spec, price, stock, expire, maker, status]
        );
        const [rows] = await pool.execute(
            `SELECT m.id, m.code, m.name, c.name AS category, m.spec, m.price, m.stock,
              DATE_FORMAT(m.expire_date, "%Y-%m-%d") AS expire,
              m.maker, m.status
         FROM medicines m
         JOIN categories c ON c.id = m.category_id
         WHERE m.id = ?`,
            [r.insertId]
        );
        res.status(201).json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '药品编码已存在');
        throw e;
    }
}

async function updateMedicine(req, res) {
    const id = req.params.id;
    const fields = [];
    const args = [];

    const body = req.body;
    if (body.category !== undefined) {
        const categoryId = await getCategoryIdByName(body.category);
        fields.push('category_id = ?');
        args.push(categoryId);
    }
    for (const [k, v] of Object.entries(body)) {
        if (k === 'category') continue;
        if (k === 'expire') {
            fields.push('expire_date = ?');
            args.push(v);
            continue;
        }
        if (['code', 'name', 'spec', 'price', 'stock', 'maker'].includes(k)) {
            fields.push(`${k} = ?`);
            args.push(v);
        }
    }

    if (!fields.length) throw new ApiError(400, '无可更新字段');
    if (body.stock !== undefined) {
        fields.push('status = ?');
        args.push(statusFromStock(body.stock));
    }

    try {
        const [r] = await pool.execute(`UPDATE medicines SET ${fields.join(', ')} WHERE id = ?`, [...args, id]);
        if (r.affectedRows === 0) throw new ApiError(404, '药品不存在');
        const [rows] = await pool.execute(
            `SELECT m.id, m.code, m.name, c.name AS category, m.spec, m.price, m.stock,
              DATE_FORMAT(m.expire_date, "%Y-%m-%d") AS expire,
              m.maker, m.status
         FROM medicines m
         JOIN categories c ON c.id = m.category_id
         WHERE m.id = ?`,
            [id]
        );
        res.json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '药品编码已存在');
        throw e;
    }
}

async function deleteMedicine(req, res) {
    const [[pc]] = await pool.execute('SELECT COUNT(*) AS c FROM procurement_orders WHERE medicine_id = ?', [req.params.id]);
    const [[sc]] = await pool.execute('SELECT COUNT(*) AS c FROM sales_orders WHERE medicine_id = ?', [req.params.id]);
    if (pc.c > 0 || sc.c > 0) throw new ApiError(409, '该药品已产生订单记录，无法删除');
    const [r] = await pool.execute('DELETE FROM medicines WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) throw new ApiError(404, '药品不存在');
    res.json({ data: true });
}

module.exports = { listMedicines, getMedicine, createMedicine, updateMedicine, deleteMedicine };
