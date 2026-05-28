const Joi = require('joi');
const { pagingQuery } = require('./common');

const procurementListQuery = pagingQuery.keys({
    status: Joi.string().allow('').optional()
});

const procurementCreateBody = Joi.object({
    code: Joi.string().trim().min(1).max(64).optional(),
    medicine: Joi.string().trim().min(1).max(128).required(),
    supplier: Joi.string().trim().min(1).max(128).required(),
    qty: Joi.number().integer().min(1).max(100000000).required(),
    price: Joi.number().min(0).max(999999).required(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    operator: Joi.string().allow('').max(64).default(''),
    status: Joi.string().valid('待审核', '已审核', '已入库', '已取消').default('待审核'),
    note: Joi.string().allow('').max(255).default('')
});

const procurementUpdateBody = Joi.object({
    code: Joi.string().trim().min(1).max(64).optional(),
    medicine: Joi.string().trim().min(1).max(128).optional(),
    supplier: Joi.string().trim().min(1).max(128).optional(),
    qty: Joi.number().integer().min(1).max(100000000).optional(),
    price: Joi.number().min(0).max(999999).optional(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
    operator: Joi.string().allow('').max(64).optional(),
    status: Joi.string().valid('待审核', '已审核', '已入库', '已取消').optional(),
    note: Joi.string().allow('').max(255).optional()
}).min(1);

module.exports = { procurementListQuery, procurementCreateBody, procurementUpdateBody };
