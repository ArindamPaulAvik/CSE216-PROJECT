const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getUserEpisodeRating,
  getEpisodeAverageRating,
  submitEpisodeRating,
  deleteEpisodeRating,
  getUserRatings,
  getShowRatings
} = require('../controllers/ratingController');

// Get user's rating for a specific episode
router.get('/user/episode/:episodeId', authenticateToken, getUserEpisodeRating);

// Get average rating for an episode
router.get('/episode/:episodeId/average', getEpisodeAverageRating);

// Submit or update rating for an episode
router.post('/episode/:episodeId', authenticateToken, submitEpisodeRating);

// Delete user's rating for an episode
router.delete('/episode/:episodeId', authenticateToken, deleteEpisodeRating);

// Get all ratings by the current user
router.get('/user/all', authenticateToken, getUserRatings);

// Get ratings for all episodes of a show
router.get('/show/:showId', getShowRatings);

module.exports = router;
