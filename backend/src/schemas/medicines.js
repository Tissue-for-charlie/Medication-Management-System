const Joi = require('joi');
const { pagingQuery } = require('./common');

const medicinesListQuery = pagingQuery.keys({
    category: Joi.string().allow('').optional(),
    status: Joi.string().allow('').optional()
});

const medicineCreateBody = Joi.object({
    code: Joi.string().trim().min(1).max(32).required(),
    name: Joi.string().trim().min(1).max(128).required(),
    category: Joi.string().trim().min(1).max(64).required(),
    spec: Joi.string().allow('').max(128).default(''),
    price: Joi.number().min(0).max(999999).required(),
    stock: Joi.number().integer().min(0).max(100000000).required(),
    expire: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    maker: Joi.string().allow('').max(128).default('')
});

const medicineUpdateBody = Joi.object({
    code: Joi.string().trim().min(1).max(32).optional(),
    name: Joi.string().trim().min(1).max(128).optional(),
    category: Joi.string().trim().min(1).max(64).optional(),
    spec: Joi.string().allow('').max(128).optional(),
    price: Joi.number().min(0).max(999999).optional(),
    stock: Joi.number().integer().min(0).max(100000000).optional(),
    expire: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
    maker: Joi.string().allow('').max(128).optional()
}).min(1);

module.exports = { medicinesListQuery, medicineCreateBody, medicineUpdateBody };
