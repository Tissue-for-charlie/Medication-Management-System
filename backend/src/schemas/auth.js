const Joi = require('joi');

const loginBody = Joi.object({
    username: Joi.string().trim().min(1).max(64).required(),
    password: Joi.string().min(1).max(255).required()
});

module.exports = { loginBody };
