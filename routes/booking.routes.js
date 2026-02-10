const express = require('express');
const booking = require('../controller/booking.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { bookingLimiter } = require('../middleware/rateLimiter.middleware');
const router = express.Router();

router.post('/createBooking', authMiddleware, bookingLimiter, booking.createBooking);
router.post('/cancelBooking', authMiddleware, booking.cancelBooking);
router.get('/getMyBookings', authMiddleware, booking.getMyBookings);

module.exports = router;
