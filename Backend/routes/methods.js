const express = require('express');
const router = express.Router();
const { getAllMethods } = require('../controllers/methodController');

// GET all payment methods
router.get('/', getAllMethods);

module.exports = router;
