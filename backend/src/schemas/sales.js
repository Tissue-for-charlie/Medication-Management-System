const Joi = require('joi');
const { pagingQuery } = require('./common');

const salesListQuery = pagingQuery.keys({
    status: Joi.string().allow('').optional()
});

const saleCreateBody = Joi.object({
    code: Joi.string().trim().min(1).max(64).optional(),
    medicine: Joi.string().trim().min(1).max(128).required(),
    qty: Joi.number().integer().min(1).max(100000000).required(),
    price: Joi.number().min(0).max(999999).required(),
    customer: Joi.string().trim().min(1).max(128).required(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    seller: Joi.string().allow('').max(64).default(''),
    status: Joi.string().valid('已完成', '待确认', '已退货').default('待确认')
});

const saleUpdateBody = Joi.object({
    code: Joi.string().trim().min(1).max(64).optional(),
    medicine: Joi.string().trim().min(1).max(128).optional(),
    qty: Joi.number().integer().min(1).max(100000000).optional(),
    price: Joi.number().min(0).max(999999).optional(),
    customer: Joi.string().trim().min(1).max(128).optional(),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
    seller: Joi.string().allow('').max(64).optional(),
    status: Joi.string().valid('已完成', '待确认', '已退货').optional()
}).min(1);

module.exports = { salesListQuery, saleCreateBody, saleUpdateBody };
