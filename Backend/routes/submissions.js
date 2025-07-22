const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissionsController');
const authenticateToken = require('../middleware/authenticateToken');

// Test endpoint (no auth required)
router.get('/test', (req, res) => {
  res.json({ message: 'Submissions API is working', timestamp: new Date().toISOString() });
});

// Get all submissions (admin only)
router.get('/', authenticateToken, submissionsController.getAllSubmissions);

// Update submission verdict (admin only)
router.put('/:id/verdict', authenticateToken, submissionsController.updateSubmissionVerdict);

// Create new submission (publisher only)
router.post('/', authenticateToken, submissionsController.createSubmission);

// Get submissions by publisher (publisher only)
router.get('/my-submissions', authenticateToken, submissionsController.getPublisherSubmissions);

module.exports = router;
