const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const analyticsController = require('../controllers/analyticsController');

router.post('/', authenticateToken, analyticsController.incomeStats);

module.exports = router; 