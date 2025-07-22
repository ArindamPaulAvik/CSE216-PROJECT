// routes/admin.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { actorUpload } = require('../config/multerConfig');
const {
  createActor,
  updateActor,
  deleteActor
} = require('../controllers/actorsController');

// Admin routes for actors
router.post('/actors', authenticateToken, actorUpload.single('picture'), createActor);
router.put('/actors/:id', authenticateToken, actorUpload.single('picture'), updateActor);
router.delete('/actors/:id', authenticateToken, deleteActor);

module.exports = router;
