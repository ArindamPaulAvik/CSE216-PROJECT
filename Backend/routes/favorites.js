// routes/favorites.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  toggleFavorite,
  getFavorites,
  checkFavorite
} = require('../controllers/favoritesController');

router.post('/favorite/:showId', authenticateToken, toggleFavorite);
router.get('/favorites', authenticateToken, getFavorites);
router.get('/favorite/:showId', authenticateToken, checkFavorite);

module.exports = router;
