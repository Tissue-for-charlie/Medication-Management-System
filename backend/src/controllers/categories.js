const { pool } = require('../db/pool');
const { ApiError } = require('../lib/api-error');

function toPaging(query, total) {
    const page = query.page;
    const pageSize = query.pageSize;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return { page, pageSize, total, totalPages };
}

async function listCategories(req, res) {
    const { page, pageSize, search } = req.query;
    const where = [];
    const args = [];
    if (search) {
        where.push('(c.name LIKE ? OR c.code LIKE ?)');
        args.push(`%${search}%`, `%${search}%`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [[c]] = await pool.execute(`SELECT COUNT(*) AS c FROM categories c ${whereSql}`, args);

    const limit = Math.max(1, Math.min(1000, Number(pageSize)));
    const offset = Math.max(0, Number((page - 1) * pageSize));
    const [rows] = await pool.execute(
        `SELECT c.id, c.name, c.code, c.description AS \`desc\`,
            (SELECT COUNT(*) FROM medicines m WHERE m.category_id = c.id) AS count,
            c.sort, c.status
       FROM categories c
       ${whereSql}
       ORDER BY c.sort ASC, c.id ASC
       LIMIT ${limit} OFFSET ${offset}`,
        args
    );
    res.json({ data: rows, pagination: toPaging(req.query, c.c) });
}

async function getCategory(req, res) {
    const [rows] = await pool.execute(
        `SELECT c.id, c.name, c.code, c.description AS \`desc\`,
            (SELECT COUNT(*) FROM medicines m WHERE m.category_id = c.id) AS count,
            c.sort, c.status
       FROM categories c
       WHERE c.id = ?`,
        [req.params.id]
    );
    if (!rows[0]) throw new ApiError(404, '分类不存在');
    res.json({ data: rows[0] });
}

async function createCategory(req, res) {
    const { name, code, desc, sort, status } = req.body;
    try {
        const [r] = await pool.execute(
            'INSERT INTO categories (name, code, description, sort, status) VALUES (?, ?, ?, ?, ?)',
            [name, code, desc, sort, status]
        );
        const [rows] = await pool.execute(
            `SELECT c.id, c.name, c.code, c.description AS \`desc\`,
              (SELECT COUNT(*) FROM medicines m WHERE m.category_id = c.id) AS count,
              c.sort, c.status
         FROM categories c
         WHERE c.id = ?`,
            [r.insertId]
        );
        res.status(201).json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '分类编码已存在');
        throw e;
    }
}

async function updateCategory(req, res) {
    const id = req.params.id;
    const fields = [];
    const args = [];
    for (const [k, v] of Object.entries(req.body)) {
        if (k === 'desc') {
            fields.push('description = ?');
            args.push(v);
            continue;
        }
        if (['name', 'code', 'sort', 'status'].includes(k)) {
            fields.push(`${k} = ?`);
            args.push(v);
        }
    }
    if (!fields.length) throw new ApiError(400, '无可更新字段');
    try {
        const [r] = await pool.execute(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, [...args, id]);
        if (r.affectedRows === 0) throw new ApiError(404, '分类不存在');
        const [rows] = await pool.execute(
            `SELECT c.id, c.name, c.code, c.description AS \`desc\`,
              (SELECT COUNT(*) FROM medicines m WHERE m.category_id = c.id) AS count,
              c.sort, c.status
         FROM categories c
         WHERE c.id = ?`,
            [id]
        );
        res.json({ data: rows[0] });
    } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw new ApiError(409, '分类编码已存在');
        throw e;
    }
}

async function deleteCategory(req, res) {
    const [[c]] = await pool.execute('SELECT COUNT(*) AS c FROM medicines WHERE category_id = ?', [req.params.id]);
    if (c.c > 0) throw new ApiError(409, '该分类下仍有关联药品，无法删除');
    const [r] = await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) throw new ApiError(404, '分类不存在');
    res.json({ data: true });
}

module.exports = { listCategories, getCategory, createCategory, updateCategory, deleteCategory };
