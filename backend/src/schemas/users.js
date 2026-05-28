const Joi = require('joi');
const { pagingQuery } = require('./common');

const usersListQuery = pagingQuery.keys({
    role: Joi.string().allow('').optional(),
    status: Joi.string().allow('').optional()
});

const userCreateBody = Joi.object({
    username: Joi.string().trim().min(1).max(64).required(),
    name: Joi.string().trim().min(1).max(64).required(),
    phone: Joi.string().trim().min(6).max(32).required(),
    role: Joi.string().valid('超级管理员', '管理员', '普通用户').required(),
    status: Joi.string().valid('启用', '禁用').required(),
    password: Joi.string().min(1).max(255).default('123456'),
    created: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional()
});

const userUpdateBody = Joi.object({
    username: Joi.string().trim().min(1).max(64).optional(),
    name: Joi.string().trim().min(1).max(64).optional(),
    phone: Joi.string().trim().min(6).max(32).optional(),
    role: Joi.string().valid('超级管理员', '管理员', '普通用户').optional(),
    status: Joi.string().valid('启用', '禁用').optional(),
    password: Joi.string().min(1).max(255).optional()
}).min(1);

module.exports = { usersListQuery, userCreateBody, userUpdateBody };
