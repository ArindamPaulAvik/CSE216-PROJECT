const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const marketingController = require('../controllers/marketingController');

// Get marketing dashboard statistics
router.get('/stats', marketingController.getMarketingStats);

module.exports = router; 