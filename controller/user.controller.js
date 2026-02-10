const Joi = require('joi');
const users = require('../model/user.model');
const winston = require('../config/winston');

module.exports = {
    register: async (req, res) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(2).max(100).required(),
            email: Joi.string().email().min(2).max(100).required(),
            password: Joi.string().min(6).max(50).required(),
        });
        try {
            const { value, error } = schema.validate(req.body);
            if (error) return res.status(400).json({ success: 0, msg: error.details[0].message });

            const result = await users.register(value);
            res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },

    login: async (req, res) => {
        const schema = Joi.object({
            email: Joi.string().email().min(2).max(100).required(),
            password: Joi.string().min(2).max(50).required(),
        });
        try {
            const { value, error } = schema.validate(req.body);
            if (error) return res.status(400).json({ success: 0, msg: error.details[0].message });

            const result = await users.login(value);
            res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },
};
