const Joi = require('joi');
const { pagingQuery } = require('./common');

const suppliersListQuery = pagingQuery;

const supplierCreateBody = Joi.object({
    name: Joi.string().trim().min(1).max(128).required(),
    contact: Joi.string().allow('').max(64).default(''),
    phone: Joi.string().allow('').max(32).default(''),
    address: Joi.string().allow('').max(255).default(''),
    rating: Joi.string().valid('A+级', 'A级', 'B级', 'C级').required(),
    status: Joi.string().valid('合作中', '暂停').required()
});

const supplierUpdateBody = Joi.object({
    name: Joi.string().trim().min(1).max(128).optional(),
    contact: Joi.string().allow('').max(64).optional(),
    phone: Joi.string().allow('').max(32).optional(),
    address: Joi.string().allow('').max(255).optional(),
    rating: Joi.string().valid('A+级', 'A级', 'B级', 'C级').optional(),
    status: Joi.string().valid('合作中', '暂停').optional()
}).min(1);

module.exports = { suppliersListQuery, supplierCreateBody, supplierUpdateBody };
