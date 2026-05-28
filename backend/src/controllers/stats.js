const { pool } = require('../db/pool');

let cached = null;
let cachedAt = 0;
const CACHE_TTL = 60 * 1000; // 1分钟

async function getStats(req, res) {
    const now = Date.now();
    if (cached && (now - cachedAt) < CACHE_TTL) {
        return res.json({ data: cached });
    }

    const [[medCount]] = await pool.execute('SELECT COUNT(*) AS c FROM medicines');
    const [[procSum]] = await pool.execute('SELECT COALESCE(SUM(total),0) AS s FROM procurement_orders WHERE DATE_FORMAT(order_date,"%Y-%m") = DATE_FORMAT(CURDATE(),"%Y-%m")');
    const [[procSumLastMonth]] = await pool.execute('SELECT COALESCE(SUM(total),0) AS s FROM procurement_orders WHERE DATE_FORMAT(order_date,"%Y-%m") = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH),"%Y-%m")');
    const [[salesSum]] = await pool.execute('SELECT COALESCE(SUM(total),0) AS s FROM sales_orders WHERE DATE_FORMAT(sale_date,"%Y-%m") = DATE_FORMAT(CURDATE(),"%Y-%m")');
    const [[salesSumLastMonth]] = await pool.execute('SELECT COALESCE(SUM(total),0) AS s FROM sales_orders WHERE DATE_FORMAT(sale_date,"%Y-%m") = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH),"%Y-%m")');
    const [[warnCount]] = await pool.execute('SELECT COUNT(*) AS c FROM medicines WHERE status = "预警"');

    const [alerts] = await pool.execute(
        'SELECT id, name, stock, DATE_FORMAT(expire_date, "%Y-%m-%d") AS expire FROM medicines WHERE status IN ("预警","不足") ORDER BY stock ASC, id ASC LIMIT 50'
    );
    const [recentSales] = await pool.execute(
        `SELECT o.id, o.code, m.name AS medicine, o.qty, o.total, o.customer,
            DATE_FORMAT(o.sale_date, "%Y-%m-%d") AS date, o.status
       FROM sales_orders o
       JOIN medicines m ON m.id = o.medicine_id
       ORDER BY o.id DESC
       LIMIT 10`
    );

    const [dailySales] = await pool.execute(
        `SELECT DATE(sale_date) as date, COALESCE(SUM(total),0) as total
         FROM sales_orders
         WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY DATE(sale_date)
         ORDER BY date ASC`
    );

    const data = {
        medicinesTotal: medCount.c,
        procurementMonthTotal: Number(procSum.s),
        procurementLastMonth: Number(procSumLastMonth.s),
        salesMonthTotal: Number(salesSum.s),
        salesLastMonth: Number(salesSumLastMonth.s),
        stockWarningTotal: warnCount.c,
        alerts,
        recentSales,
        dailySales
    };

    cached = data;
    cachedAt = now;

    res.json({ data });
}

function clearStatsCache() {
    cached = null;
    cachedAt = 0;
}

module.exports = { getStats, clearStatsCache };
