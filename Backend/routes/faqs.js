const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQStats,
  searchFAQs
} = require('../controllers/faqController');

// Get all FAQs (public route)
router.get('/', getAllFAQs);

// Search FAQs (public route)
router.get('/search', searchFAQs);

// Get FAQ statistics (Support Admin only)
router.get('/stats', authenticateToken, getFAQStats);

// Create new FAQ (Support Admin only)
router.post('/', authenticateToken, createFAQ);

// Update FAQ (Support Admin only)
router.put('/:id', authenticateToken, updateFAQ);

// Get FAQ by ID (public route)
router.get('/:id', getFAQById);

// Delete FAQ (Support Admin only)
router.delete('/:id', authenticateToken, deleteFAQ);

module.exports = router;
