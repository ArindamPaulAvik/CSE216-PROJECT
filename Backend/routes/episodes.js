// routes/episodes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getEpisodeInfo,
  getEpisodesByShow,
  updateEpisode
} = require('../controllers/episodesController');

router.get('/episode/:episodeId', authenticateToken, getEpisodeInfo);
router.get('/show/:showId/episodes', authenticateToken, getEpisodesByShow);
router.put('/episode/:episodeId', authenticateToken, updateEpisode);

module.exports = router;
