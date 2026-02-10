const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ level: 'info', filename: './logs/app.log' }),
        new winston.transports.File({ level: 'error', filename: './logs/error.log' }),
    ],
    exitOnError: false,
});

module.exports = logger;
