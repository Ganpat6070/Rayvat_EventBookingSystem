const Joi = require('joi');
const bookings = require('../model/booking.model');
const winston = require('../config/winston');

module.exports = {
    createBooking: async (req, res) => {
        const schema = Joi.object({
            eventid: Joi.number().integer().min(1).required(),
            seats: Joi.number().integer().min(1).max(10).optional(),
        });
        
        try {
            const { value, error } = schema.validate(req.body);
            if (error) return res.status(400).json({ success: 0, msg: error.details[0].message });

            const result = await bookings.createBooking(value, req.user);
            return res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            return res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },

    cancelBooking: async (req, res) => {
        const schema = Joi.object({
            bookingid: Joi.number().integer().min(1).required(),
        });
        try {
            const { value, error } = schema.validate(req.body);
            if (error) return res.status(400).json({ success: 0, msg: error.details[0].message });

            const result = await bookings.cancelBooking(value.bookingid, req.user);
            return res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            return res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },

    getMyBookings: async (req, res) => {
        try {
            const result = await bookings.getMyBookings(req.user);
            return res.status(result.status).json(result);
        } catch (error) {
            winston.error(error.message);
            return res.status(500).json({ success: 0, msg: 'Internal server error' });
        }
    },
};
