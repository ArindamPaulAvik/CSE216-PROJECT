// routes/violations.js
const express = require('express');
const router = express.Router();
const { getAllViolations, checkReportStatus, submitReport } = require('../controllers/violationController');

router.get('/', getAllViolations);
router.get('/check/:userId/:commentId', checkReportStatus);
router.post('/report', submitReport);

module.exports = router;

