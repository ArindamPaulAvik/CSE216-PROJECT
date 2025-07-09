// routes/actors.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getAllActors,
  getActorById
} = require('../controllers/actorsController');

router.get('/actors', authenticateToken, getAllActors);
router.get('/actor/:id', authenticateToken, getActorById);

module.exports = router;


