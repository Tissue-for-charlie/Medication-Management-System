const Joi = require('joi');

const idParam = Joi.object({
    id: Joi.number().integer().positive().required()
});

const pagingQuery = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).max(1000).default(100),
    search: Joi.string().allow('').optional()
});

module.exports = { idParam, pagingQuery };
