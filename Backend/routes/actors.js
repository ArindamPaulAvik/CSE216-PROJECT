// routes/actors.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { upload } = require('../config/multerConfig');
const {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actorsController');

// Public routes (for users)
router.get('/', authenticateToken, getAllActors);
router.get('/:id', authenticateToken, getActorById);

module.exports = router;


