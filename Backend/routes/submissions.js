const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissionsController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const path = require('path');

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

// Catch-all route to see if requests are reaching the router
router.use('*', (req, res) => {
  res.json({ 
    message: 'Request reached submissions router',
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl
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

// Create new episode submission (publisher only) - with enhanced debugging
router.post('/episode', (req, res, next) => {
  console.log('=== EPISODE ROUTE HIT ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  next();
}, authenticateToken, (req, res, next) => {
  console.log('=== AFTER AUTHENTICATION ===');
  console.log('User:', req.user);
  next();
}, submissionsController.createEpisodeSubmission);

// Get submissions by publisher (publisher only)
router.get('/my-submissions', authenticateToken, submissionsController.getPublisherSubmissions);

module.exports = router;
