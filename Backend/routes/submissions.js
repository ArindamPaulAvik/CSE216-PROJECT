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

// Create new episode submission (publisher only) - DIRECT IMPLEMENTATION
router.post('/episode', (req, res, next) => {
  console.log('=== EPISODE ROUTE HIT ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  next();
}, authenticateToken, async (req, res) => {
  console.log('=== AFTER AUTHENTICATION ===');
  console.log('User:', req.user);
  
  try {
    const userType = req.user?.userType;
    const publisherId = req.user?.publisherId;
    
    // Check if user is a publisher
    if (userType !== 'publisher') {
      return res.status(403).json({ error: 'Access denied. Only publishers can add episodes.' });
    }

    // Get publisher ID if not in token
    let actualPublisherId = publisherId;
    if (!actualPublisherId) {
      const [publisherRows] = await pool.query(
        'SELECT PUBLISHER_ID FROM PUBLISHER WHERE PERSON_ID = ?',
        [req.user.personId]
      );
      
      if (publisherRows.length === 0) {
        return res.status(403).json({ error: 'Publisher account not found.' });
      }
      actualPublisherId = publisherRows[0].PUBLISHER_ID;
    }

    const { title, description, episodeLink } = req.body;
    
    // Validate required fields
    if (!title || !description || !episodeLink) {
      return res.status(400).json({ error: 'Missing required fields: title, description, episodeLink' });
    }

    console.log('Inserting episode:', { title, description, episodeLink, actualPublisherId });

    // Insert episode into database - adjust table/column names as needed
    const [result] = await pool.query(
      `INSERT INTO EPISODES (TITLE, DESCRIPTION, EPISODE_LINK, PUBLISHER_ID, CREATED_DATE, STATUS) 
       VALUES (?, ?, ?, ?, NOW(), 'PENDING')`,
      [title, description, episodeLink, actualPublisherId]
    );

    console.log('Episode inserted successfully:', result);

    res.json({ 
      success: true, 
      episodeId: result.insertId,
      message: 'Episode added successfully' 
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'Failed to add episode',
      details: err.message 
    });
  }
});

// Get submissions by publisher (publisher only)
router.get('/my-submissions', authenticateToken, submissionsController.getPublisherSubmissions);

// Catch-all route to see if requests are reaching the router (MOVE TO END)
router.use('*', (req, res) => {
  res.json({ 
    message: 'Request reached submissions router but no matching route found',
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl
  });
});

module.exports = router;