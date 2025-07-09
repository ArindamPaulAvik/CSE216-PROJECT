// routes/episodes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getEpisodeInfo,
  getEpisodesByShow
} = require('../controllers/episodesController');

router.get('/episode/:episodeId', authenticateToken, getEpisodeInfo);
router.get('/show/:showId/episodes', authenticateToken, getEpisodesByShow);

module.exports = router;
