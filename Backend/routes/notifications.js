// routes/notifications.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  getUnreadNotificationCount, 
  deleteNotification 
} = require('../controllers/notificationController');

// Get all notifications for the authenticated user
router.get('/notifications', authenticateToken, getUserNotifications);

// Test endpoint to check if routes are working
router.get('/notifications/test', (req, res) => {
  console.log('🧪 Test endpoint hit!');
  res.json({ message: 'Notification routes are working!', timestamp: new Date() });
});

// Get unread notification count
router.get('/notifications/unread-count', authenticateToken, getUnreadNotificationCount);

// Mark a specific notification as read
router.put('/notifications/:notificationId/read', authenticateToken, markNotificationAsRead);

// Mark all notifications as read
router.put('/notifications/read-all', authenticateToken, markAllNotificationsAsRead);

// Delete a specific notification
router.delete('/notifications/:notificationId', authenticateToken, deleteNotification);

module.exports = router;
