// routes/awards.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { awardUpload } = require('../config/multerConfig');
const {
  getAllAwards,
  getAwardById,
  getAwardsForShow,
  getAwardsForActor,
  getAwardsForDirector,
  createAward,
  updateAward,
  deleteAward
} = require('../controllers/awardsController');

// GET all awards with optional search
router.get('/', authenticateToken, getAllAwards);

// GET awards for a specific show
router.get('/show/:showId', authenticateToken, getAwardsForShow);

// GET awards for a specific actor
router.get('/actor/:actorId', authenticateToken, getAwardsForActor);

// GET awards for a specific director
router.get('/director/:directorId', authenticateToken, getAwardsForDirector);

// GET award by ID with recipients (this should come after specific routes)
router.get('/:id', authenticateToken, getAwardById);

// POST create new award with image upload
router.post('/', authenticateToken, awardUpload.single('image'), createAward);

// PUT update award with optional image upload
router.put('/:id', authenticateToken, awardUpload.single('image'), updateAward);

// DELETE award
router.delete('/:id', authenticateToken, deleteAward);

module.exports = router;
