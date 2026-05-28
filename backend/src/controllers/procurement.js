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

async function getSupplierIdByName(name) {
    const [rows] = await pool.execute('SELECT id FROM suppliers WHERE name = ? LIMIT 1', [name]);
    if (!rows[0]) throw new ApiError(400, '供应商不存在');
    return rows[0].id;
}

function makeCode(prefix) {
    return `${prefix}${Date.now()}`;
}

async function listProcurement(req, res) {
    const { page, pageSize, search, status } = req.query;
    const where = [];
    const args = [];
    if (search) {
        where.push('(p.code LIKE ? OR m.name LIKE ? OR s.name LIKE ? OR p.operator LIKE ?)');
        args.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
        where.push('p.status = ?');
        args.push(status);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [[c]] = await pool.execute(
        `SELECT COUNT(*) AS c
       FROM procurement_orders p
       JOIN medicines m ON m.id = p.medicine_id
       JOIN suppliers s ON s.id = p.supplier_id
       ${whereSql}`,
        args
    );

    const limit = Math.max(1, Math.min(1000, Number(pageSize)));
    const offset = Math.max(0, Number((page - 1) * pageSize));
    const [rows] = await pool.execute(
        `SELECT p.id, p.code, m.name AS medicine, s.name AS supplier, p.qty, p.price, p.total,
            DATE_FORMAT(p.order_date, "%Y-%m-%d") AS date,
            p.operator, p.status
       FROM procurement_orders p
       JOIN medicines m ON m.id = p.medicine_id
       JOIN suppliers s ON s.id = p.supplier_id
       ${whereSql}
       ORDER BY p.id DESC
       LIMIT ${limit} OFFSET ${offset}`,
        args
    );
    res.json({ data: rows, pagination: toPaging(req.query, c.c) });
}

async function getProcurement(req, res) {
    const [rows] = await pool.execute(
        `SELECT p.id, p.code, m.name AS medicine, s.name AS supplier, p.qty, p.price, p.total,
            DATE_FORMAT(p.order_date, "%Y-%m-%d") AS date,
            p.operator, p.status, p.note
       FROM procurement_orders p
       JOIN medicines m ON m.id = p.medicine_id
       JOIN suppliers s ON s.id = p.supplier_id
       WHERE p.id = ?`,
        [req.params.id]
    );
    if (!rows[0]) throw new ApiError(404, '采购单不存在');
    res.json({ data: rows[0] });
}

async function createProcurement(req, res) {
    const { code, medicine, supplier, qty, price, date, operator, status, note } = req.body;
    const medicineId = await getMedicineIdByName(medicine);
    const supplierId = await getSupplierIdByName(supplier);
    const finalCode = code || makeCode('PO');
    const total = Number((qty * price).toFixed(2));
    try {
        const [r] = await pool.execute(
            'INSERT INTO procurement_orders (code, medicine_id, supplier_id, qty, price, total, order_date, operator, status, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [finalCode, medicineId, supplierId, qty, price, total, date, operator, status, note]
        );
        const [rows] = await pool.execute(
            `SELECT p.id, p.code, m.name AS medicine, s.name AS supplier, p.qty, p.price, p.total,
              DATE_FORMAT(p.order_date, "%Y-%m-%d") AS date,
              p.operator, p.status
         FROM procurement_orders p
         JOIN medicines m ON m.id = p.medicine_id
         JOIN suppliers s ON s.id = p.supplier_id
         WHERE p.id = ?`,
            [r.insertId]
        );
        res.status(201).json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '采购单号已存在');
        throw e;
    }
}

async function updateProcurement(req, res) {
    const id = req.params.id;
    const body = req.body;
    const fields = [];
    const args = [];

    if (body.medicine !== undefined) {
        const medicineId = await getMedicineIdByName(body.medicine);
        fields.push('medicine_id = ?');
        args.push(medicineId);
    }
    if (body.supplier !== undefined) {
        const supplierId = await getSupplierIdByName(body.supplier);
        fields.push('supplier_id = ?');
        args.push(supplierId);
    }
    for (const [k, v] of Object.entries(body)) {
        if (k === 'medicine' || k === 'supplier') continue;
        if (k === 'date') {
            fields.push('order_date = ?');
            args.push(v);
            continue;
        }
        if (['code', 'qty', 'price', 'operator', 'status', 'note'].includes(k)) {
            fields.push(`${k} = ?`);
            args.push(v);
        }
    }
    if (body.qty !== undefined || body.price !== undefined) {
        const [rows] = await pool.execute('SELECT qty, price FROM procurement_orders WHERE id = ?', [id]);
        if (!rows[0]) throw new ApiError(404, '采购单不存在');
        const qty = body.qty !== undefined ? body.qty : rows[0].qty;
        const price = body.price !== undefined ? body.price : rows[0].price;
        fields.push('total = ?');
        args.push(Number((qty * price).toFixed(2)));
    }
    if (!fields.length) throw new ApiError(400, '无可更新字段');

    try {
        const [r] = await pool.execute(`UPDATE procurement_orders SET ${fields.join(', ')} WHERE id = ?`, [...args, id]);
        if (r.affectedRows === 0) throw new ApiError(404, '采购单不存在');
        const [rows] = await pool.execute(
            `SELECT p.id, p.code, m.name AS medicine, s.name AS supplier, p.qty, p.price, p.total,
              DATE_FORMAT(p.order_date, "%Y-%m-%d") AS date,
              p.operator, p.status
         FROM procurement_orders p
         JOIN medicines m ON m.id = p.medicine_id
         JOIN suppliers s ON s.id = p.supplier_id
         WHERE p.id = ?`,
            [id]
        );
        res.json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '采购单号已存在');
        throw e;
    }
}

async function approveProcurement(req, res) {
    const id = req.params.id;
    const [[order]] = await pool.execute('SELECT medicine_id, qty, status FROM procurement_orders WHERE id = ?', [id]);
    if (!order) throw new ApiError(404, '采购单不存在');
    if (order.status !== '待审核') throw new ApiError(400, '只有待审核状态的采购单可以审核');

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.execute('UPDATE procurement_orders SET status = ? WHERE id = ?', ['已审核', id]);

        const [[med]] = await conn.execute('SELECT stock FROM medicines WHERE id = ? FOR UPDATE', [order.medicine_id]);
        const newStock = med.stock + order.qty;
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

async function deleteProcurement(req, res) {
    const [r] = await pool.execute('DELETE FROM procurement_orders WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) throw new ApiError(404, '采购单不存在');
    res.json({ data: true });
}

module.exports = {
    listProcurement,
    getProcurement,
    createProcurement,
    updateProcurement,
    approveProcurement,
    deleteProcurement
};
