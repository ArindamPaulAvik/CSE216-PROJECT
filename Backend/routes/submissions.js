const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissionsController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const path = require('path');
const pool = require('../db'); // Add this for direct database access

// Simple test route to verify router is accessible
router.get('/test-simple', (req, res) => {
  res.json({ message: 'Submissions router is accessible', timestamp: new Date().toISOString() });
});

// Debug route to test if submissions router is working
router.get('/debug', (req, res) => {
  res.json({ 
    message: 'Submissions router is working',
    availableRoutes: [
      'GET /submissions/',
      'POST /submissions/',
      'POST /submissions/show',
      'POST /submissions/episode',
      'GET /submissions/my-submissions'
    ]
  });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'banner') {
      cb(null, 'public/banners/');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'public/shows/');
    } else {
      cb(null, 'public/uploads/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

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

// Create new show submission (publisher only) - with file uploads
router.post('/show', authenticateToken, upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), submissionsController.createShowSubmission);

// Create new episode submission (publisher only)
router.post('/episode', authenticateToken, submissionsController.createEpisodeSubmission);

// Get submissions by publisher (publisher only)
router.get('/my-submissions', authenticateToken, submissionsController.getPublisherSubmissions);

// Catch-all route for debugging - using proper route pattern
router.use('/debug-catch-all', (req, res) => {
  res.json({ 
    message: 'Request reached submissions router debug route',
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl
  });
});

module.exports = router;