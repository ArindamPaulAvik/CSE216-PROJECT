// routes/awards.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { awardUpload } = require('../config/multerConfig');
const {
  getAllAwards,
  getAwardById,
  getAwardsForShow,
  createAward,
  updateAward,
  deleteAward
} = require('../controllers/awardsController');

// GET all awards with optional search
router.get('/', authenticateToken, getAllAwards);

// GET award by ID with recipients
router.get('/:id', authenticateToken, getAwardById);

// GET awards for a specific show
router.get('/show/:showId', authenticateToken, getAwardsForShow);

// POST create new award with image upload
router.post('/', authenticateToken, awardUpload.single('image'), createAward);

// PUT update award with optional image upload
router.put('/:id', authenticateToken, awardUpload.single('image'), updateAward);

// DELETE award
router.delete('/:id', authenticateToken, deleteAward);

module.exports = router;
