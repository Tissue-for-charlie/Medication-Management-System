const { pool } = require('../db/pool');
const { ApiError } = require('../lib/api-error');

function toPaging(query, total) {
    const page = query.page;
    const pageSize = query.pageSize;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return { page, pageSize, total, totalPages };
}

async function getMedicineIdByName(name) {
    const [rows] = await pool.execute('SELECT id FROM medicines WHERE name = ? LIMIT 1', [name]);
    if (!rows[0]) throw new ApiError(400, '药品不存在');
    return rows[0].id;
}

function makeCode(prefix) {
    return `${prefix}${Date.now()}`;
}

async function listSales(req, res) {
    const { page, pageSize, search, status } = req.query;
    const where = [];
    const args = [];
    if (search) {
        where.push('(o.code LIKE ? OR m.name LIKE ? OR o.customer LIKE ? OR o.seller LIKE ?)');
        args.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
        where.push('o.status = ?');
        args.push(status);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [[c]] = await pool.execute(
        `SELECT COUNT(*) AS c
       FROM sales_orders o
       JOIN medicines m ON m.id = o.medicine_id
       ${whereSql}`,
        args
    );

    const limit = Math.max(1, Math.min(1000, Number(pageSize)));
    const offset = Math.max(0, Number((page - 1) * pageSize));
    const [rows] = await pool.execute(
        `SELECT o.id, o.code, m.name AS medicine, o.qty, o.price, o.total,
            o.customer, DATE_FORMAT(o.sale_date, "%Y-%m-%d") AS date,
            o.seller, o.status
       FROM sales_orders o
       JOIN medicines m ON m.id = o.medicine_id
       ${whereSql}
       ORDER BY o.id DESC
       LIMIT ${limit} OFFSET ${offset}`,
        args
    );
    res.json({ data: rows, pagination: toPaging(req.query, c.c) });
}

async function getSale(req, res) {
    const [rows] = await pool.execute(
        `SELECT o.id, o.code, m.name AS medicine, o.qty, o.price, o.total,
            o.customer, DATE_FORMAT(o.sale_date, "%Y-%m-%d") AS date,
            o.seller, o.status
       FROM sales_orders o
       JOIN medicines m ON m.id = o.medicine_id
       WHERE o.id = ?`,
        [req.params.id]
    );
    if (!rows[0]) throw new ApiError(404, '销售单不存在');
    res.json({ data: rows[0] });
}

async function createSale(req, res) {
    const { code, medicine, qty, price, customer, date, seller, status } = req.body;
    const medicineId = await getMedicineIdByName(medicine);
    const finalCode = code || makeCode('SO');
    const total = Number((qty * price).toFixed(2));
    try {
        const [r] = await pool.execute(
            'INSERT INTO sales_orders (code, medicine_id, qty, price, total, customer, sale_date, seller, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [finalCode, medicineId, qty, price, total, customer, date, seller, status]
        );
        const [rows] = await pool.execute(
            `SELECT o.id, o.code, m.name AS medicine, o.qty, o.price, o.total,
              o.customer, DATE_FORMAT(o.sale_date, "%Y-%m-%d") AS date,
              o.seller, o.status
         FROM sales_orders o
         JOIN medicines m ON m.id = o.medicine_id
         WHERE o.id = ?`,
            [r.insertId]
        );
        res.status(201).json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '销售单号已存在');
        throw e;
    }
}

async function updateSale(req, res) {
    const id = req.params.id;
    const body = req.body;
    const fields = [];
    const args = [];

    if (body.medicine !== undefined) {
        const medicineId = await getMedicineIdByName(body.medicine);
        fields.push('medicine_id = ?');
        args.push(medicineId);
    }
    for (const [k, v] of Object.entries(body)) {
        if (k === 'medicine') continue;
        if (k === 'date') {
            fields.push('sale_date = ?');
            args.push(v);
            continue;
        }
        if (['code', 'qty', 'price', 'customer', 'seller', 'status'].includes(k)) {
            fields.push(`${k} = ?`);
            args.push(v);
        }
    }
    if (body.qty !== undefined || body.price !== undefined) {
        const [rows] = await pool.execute('SELECT qty, price FROM sales_orders WHERE id = ?', [id]);
        if (!rows[0]) throw new ApiError(404, '销售单不存在');
        const qty = body.qty !== undefined ? body.qty : rows[0].qty;
        const price = body.price !== undefined ? body.price : rows[0].price;
        fields.push('total = ?');
        args.push(Number((qty * price).toFixed(2)));
    }
    if (!fields.length) throw new ApiError(400, '无可更新字段');

    try {
        const [r] = await pool.execute(`UPDATE sales_orders SET ${fields.join(', ')} WHERE id = ?`, [...args, id]);
        if (r.affectedRows === 0) throw new ApiError(404, '销售单不存在');
        const [rows] = await pool.execute(
            `SELECT o.id, o.code, m.name AS medicine, o.qty, o.price, o.total,
              o.customer, DATE_FORMAT(o.sale_date, "%Y-%m-%d") AS date,
              o.seller, o.status
         FROM sales_orders o
         JOIN medicines m ON m.id = o.medicine_id
         WHERE o.id = ?`,
            [id]
        );
        res.json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '销售单号已存在');
        throw e;
    }
}

async function approveSale(req, res) {
    const id = req.params.id;
    const [[order]] = await pool.execute('SELECT medicine_id, qty, status FROM sales_orders WHERE id = ?', [id]);
    if (!order) throw new ApiError(404, '销售单不存在');
    if (order.status !== '待确认') throw new ApiError(400, '只有待确认状态的销售单可以审核');

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [[med]] = await conn.execute('SELECT stock FROM medicines WHERE id = ? FOR UPDATE', [order.medicine_id]);
        const newStock = med.stock - order.qty;
        if (newStock < 0) throw new ApiError(400, '库存不足，无法完成销售');

        await conn.execute('UPDATE sales_orders SET status = ? WHERE id = ?', ['已完成', id]);

        let newStatus = '充足';
        if (newStock < 20) newStatus = '预警';
        else if (newStock < 50) newStatus = '不足';
        await conn.execute('UPDATE medicines SET stock = ?, status = ? WHERE id = ?', [newStock, newStatus, order.medicine_id]);

        await conn.commit();
        res.json({ data: true });
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
}

async function deleteSale(req, res) {
    const [r] = await pool.execute('DELETE FROM sales_orders WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) throw new ApiError(404, '销售单不存在');
    res.json({ data: true });
}

module.exports = { listSales, getSale, createSale, updateSale, approveSale, deleteSale };