
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const settingsController = require('../controllers/settingsController');

// Remove /users from the route paths since they'll be mounted under /users
router.get('/preferences', authenticateToken, settingsController.getUserPreferences);
router.put('/preferences', authenticateToken, settingsController.updateUserPreferences);

module.exports = router;