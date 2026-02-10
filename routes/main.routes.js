const express = require('express');
const userRoutes = require('./user.routes');
const eventRoutes = require('./event.routes');
const bookingRoutes = require('./booking.routes');
const routes = express.Router();

routes.use('/auth', userRoutes);
routes.use('/events', eventRoutes);
routes.use('/bookings', bookingRoutes);

module.exports = routes;
