
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { validatePromoCode } = require('../controllers/promoController');

// POST validate promo code
router.post('/validate', authenticateToken, validatePromoCode);

module.exports = router;
