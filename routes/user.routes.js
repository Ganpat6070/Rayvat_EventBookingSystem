const express = require('express');
const user = require('../controller/user.controller');
const { authLimiter } = require('../middleware/rateLimiter.middleware');
const router = express.Router();

router.post('/register', authLimiter, user.register);
router.post('/login', authLimiter, user.login);

module.exports = router;
