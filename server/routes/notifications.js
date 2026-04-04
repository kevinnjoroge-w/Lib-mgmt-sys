const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// All notification routes should be protected, assume a single get endpoint for now
router.get('/:userId', notificationController.getUserNotifications);
router.put('/read/:id', notificationController.markAsRead);
router.put('/read-all/:userId', notificationController.markAllAsRead);

module.exports = router;
