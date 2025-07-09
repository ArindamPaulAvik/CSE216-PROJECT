// routes/frontpage.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { getFrontpage } = require('../controllers/frontpageController');

router.get('/frontpage', authenticateToken, getFrontpage);

module.exports = router;
