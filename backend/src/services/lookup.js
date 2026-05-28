const { pool } = require('../db/pool');
const { ApiError } = require('../lib/api-error');

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

async function getCategoryIdByName(name) {
    const [rows] = await pool.execute('SELECT id FROM categories WHERE name = ? LIMIT 1', [name]);
    if (!rows[0]) throw new ApiError(400, '分类不存在');
    return rows[0].id;
}

module.exports = { getMedicineIdByName, getSupplierIdByName, getCategoryIdByName };
