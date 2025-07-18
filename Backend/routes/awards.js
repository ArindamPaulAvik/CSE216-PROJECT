// routes/awards.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getAllAwards,
  getAwardById
} = require('../controllers/awardsController');

router.get('/', authenticateToken, getAllAwards);
router.get('/:id', authenticateToken, getAwardById);

module.exports = router;
