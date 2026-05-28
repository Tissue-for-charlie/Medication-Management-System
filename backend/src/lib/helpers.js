function statusFromStock(stock) {
    if (stock < 20) return '预警';
    if (stock < 50) return '不足';
    return '充足';
}

function makeCode(prefix) {
    return `${prefix}${Date.now()}`;
}

module.exports = { statusFromStock, makeCode };
