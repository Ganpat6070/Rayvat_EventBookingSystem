require('dotenv').config();
const express = require('express');
const routes = require('./routes/main.routes');
const { globalRateLimiter } = require('./middleware/rateLimiter.middleware');
const winston = require('./config/winston');

const app = express();
const PORT = process.env.PORT || 8000;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', globalRateLimiter, routes);

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    winston.error({ message: err.message, error: String(err.stack), errortype: 'handled' });
    res.status(statusCode).json({
        success: 0,
        msg: err.message || 'Internal server error',
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    winston.error({ message: String(reason), error: String(reason), errortype: 'unhandledRejection' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    winston.error({ message: error.message, error: String(error.stack), errortype: 'uncaughtException' });
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});