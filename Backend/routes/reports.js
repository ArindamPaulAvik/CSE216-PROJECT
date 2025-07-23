// routes/reports.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getUndealtReports,
  getReportById,
  getAllViolations,
  deleteReportedComment,
  dismissReport
} = require('../controllers/reportsController');

// GET all undealt reports
router.get('/undealt', authenticateToken, getUndealtReports);

// GET all violations
router.get('/violations', authenticateToken, getAllViolations);

// GET reports statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // This is a placeholder for reports statistics
    res.json({
      total: 0,
      pending: 0,
      resolved: 0
    });
  } catch (error) {
    console.error('Error fetching reports stats:', error);
    res.status(500).json({ error: 'Failed to fetch reports statistics' });
  }
});

// GET report by ID
router.get('/:id', authenticateToken, getReportById);

// PUT dismiss report
router.put('/:id/dismiss', authenticateToken, dismissReport);

// DELETE reported comment
router.delete('/comment/:commentId', authenticateToken, deleteReportedComment);

module.exports = router;
