const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { success: 0, msg: 'Too many attempts. Please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

const bookingLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 20,
    message: { success: 0, msg: 'Too many booking requests. Please try again after a minute' },
    standardHeaders: true,
    legacyHeaders: false,
});

const globalRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100,
    message: { success: 0, msg: 'Too many requests. Please try again after a minute' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, bookingLimiter, globalRateLimiter };
