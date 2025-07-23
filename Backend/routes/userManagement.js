const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getAllUsers,
  getUserById,
  getUserStats,
  searchUsers,
  getAllCountries
} = require('../controllers/userManagementController');

// GET all users (admin only)
router.get('/', authenticateToken, getAllUsers);

// GET user statistics (admin only)
router.get('/stats', authenticateToken, getUserStats);

// GET all countries (admin only)
router.get('/countries', authenticateToken, getAllCountries);

// GET search users (admin only)
router.get('/search', authenticateToken, searchUsers);

// GET user by ID (admin only)
router.get('/:id', authenticateToken, getUserById);

module.exports = router;
