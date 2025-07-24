const express = require('express');
const router = express.Router();
const { recordWatchEvent } = require('../controllers/watchController');
const authenticateToken = require('../middleware/authenticateToken');

// POST /watch/record - Record a watch event
router.post('/record', authenticateToken, recordWatchEvent);

module.exports = router;
