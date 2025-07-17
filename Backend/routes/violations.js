// routes/violations.js
const express = require('express');
const router = express.Router();
const { getAllViolations } = require('../controllers/violationController');

router.get('/', getAllViolations);

module.exports = router;
