const Joi = require('joi');
const { pagingQuery } = require('./common');

const categoriesListQuery = pagingQuery;

const categoryCreateBody = Joi.object({
    name: Joi.string().trim().min(1).max(64).required(),
    code: Joi.string().trim().min(1).max(32).required(),
    desc: Joi.string().allow('').max(255).default(''),
    sort: Joi.number().integer().min(1).max(9999).default(1),
    status: Joi.string().valid('启用', '禁用').required()
});

const categoryUpdateBody = Joi.object({
    name: Joi.string().trim().min(1).max(64).optional(),
    code: Joi.string().trim().min(1).max(32).optional(),
    desc: Joi.string().allow('').max(255).optional(),
    sort: Joi.number().integer().min(1).max(9999).optional(),
    status: Joi.string().valid('启用', '禁用').optional()
}).min(1);

module.exports = { categoriesListQuery, categoryCreateBody, categoryUpdateBody };
