const Joi = require('joi');
const events = require('../model/event.model');
const winston = require('../config/winston');

module.exports = {
    createEvent: async (req, res) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(2).max(150).required(),
            description: Joi.string().trim().max(500).optional().allow('', null),
            date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required()
                .messages({ 'string.pattern.base': 'Date must be in YYYY-MM-DD format' }),
            capacity: Joi.number().integer().min(1).required(),
        });
        try {
            const { value, error } = schema.validate(req.body);
            if (error) return res.status(400).json({ success: 0, msg: error.details[0].message });

            const result = await events.createEvent(value, req.user);
            return res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            return res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },

    getEvents: async (req, res) => {
        try {
            const filters = {
                start: req.query.start || null,
                end: req.query.end || null,
                page: req.query.page || 1,
                limit: req.query.limit || 10,
            };
            const result = await events.getEvents(filters);
            return res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            return res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },

    getEventById: async (req, res) => {
        const schema = Joi.object({
            eventid: Joi.number().integer().min(1).required(),
        });
        try {
            const { value, error } = schema.validate(req.body);
            if (error) return res.status(400).json({ success: 0, msg: error.details[0].message });

            const result = await events.getEventById(value.eventid);
            return res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            return res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },

    updateEvent: async (req, res) => {
        const schema = Joi.object({
            eventid: Joi.number().integer().min(1).required(),
            name: Joi.string().trim().min(2).max(150).optional(),
            description: Joi.string().trim().max(500).optional().allow('', null),
            date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
                .messages({ 'string.pattern.base': 'Date must be in YYYY-MM-DD format' }),
            capacity: Joi.number().integer().min(1).optional(),
            status: Joi.valid(1, 2, 3).optional(),
        });
        try {
            const { value, error } = schema.validate(req.body);
            if (error) return res.status(400).json({ success: 0, msg: error.details[0].message });

            const { eventid, ...data } = value;
            const result = await events.updateEvent(eventid, data);
            return res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            return res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },

    deleteEvent: async (req, res) => {
        const schema = Joi.object({
            eventid: Joi.number().integer().min(1).required(),
        });
        try {
            const { value, error } = schema.validate(req.body);
            if (error) return res.status(400).json({ success: 0, msg: error.details[0].message });

            const result = await events.deleteEvent(value.eventid);
            return res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            return res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },
};
