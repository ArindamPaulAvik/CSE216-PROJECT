// routes/actors.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getAllActors,

  getActorById
} = require('../controllers/actorsController');

router.get('/', authenticateToken, getAllActors);
router.get('/:id', authenticateToken, getActorById);

module.exports = router;


