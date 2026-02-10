const express = require('express');
const event = require('../controller/event.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/getEvents', event.getEvents);
router.post('/getEventById', event.getEventById);
router.post('/createEvent', authMiddleware, adminMiddleware, event.createEvent);
router.post('/updateEvent', authMiddleware, adminMiddleware, event.updateEvent);
router.post('/deleteEvent', authMiddleware, adminMiddleware, event.deleteEvent);

module.exports = router;
