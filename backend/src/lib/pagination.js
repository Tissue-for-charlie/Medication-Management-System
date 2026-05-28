function toPaging(query, total) {
    const page = query.page;
    const pageSize = query.pageSize;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return { page, pageSize, total, totalPages };
}

module.exports = { toPaging };
