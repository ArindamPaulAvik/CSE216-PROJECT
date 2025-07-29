// controllers/episodesController.js
const pool = require('../db');

exports.getEpisodeInfo = async (req, res) => {
  const episodeId = req.params.episodeId;

  try {
    console.log('Getting episode info for ID:', episodeId); // Debug log
    
    const [episode] = await pool.query(`
      SELECT 
        SE.SHOW_EPISODE_ID,
        SE.SHOW_EPISODE_TITLE,
        SE.EPISODE_NUMBER,
        SE.SHOW_EPISODE_DESCRIPTION,
        SE.SHOW_EPISODE_DURATION,
        SE.SHOW_EPISODE_RELEASE_DATE,
        SE.VIDEO_URL,
        S.TITLE as SHOW_TITLE,
        S.SHOW_ID
      FROM SHOW_EPISODE SE
      JOIN SHOWS S ON SE.SHOW_ID = S.SHOW_ID
      WHERE SE.SHOW_EPISODE_ID = ? AND S.REMOVED = 0
    `, [episodeId]);

    if (episode.length === 0) {
      return res.status(404).json({ error: 'Episode not found' });
    }

    console.log('Retrieved episode:', episode[0]); // Debug log
    res.json(episode[0]);
  } catch (err) {
    console.error('Error fetching episode:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Fetches episodes with VIDEO_URL
exports.getEpisodesByShow = async (req, res) => {
  const showId = req.params.showId;

  try {
    console.log('=== getEpisodesByShow called ===');
    console.log('Show ID:', showId);
    
    // Validate showId
    if (!showId || isNaN(showId)) {
      return res.status(400).json({ error: 'Invalid show ID' });
    }
    
    console.log('Executing database query...');
    
    const [episodes] = await pool.query(`
      SELECT 
        SHOW_EPISODE_ID,
        EPISODE_NUMBER,
        SHOW_EPISODE_TITLE,
        SHOW_EPISODE_DESCRIPTION,
        SHOW_EPISODE_DURATION,
        SHOW_EPISODE_RELEASE_DATE,
        VIDEO_URL
      FROM SHOW_EPISODE
      WHERE SHOW_ID = ?
      ORDER BY EPISODE_NUMBER ASC
    `, [parseInt(showId)]);

    console.log('Query executed successfully');
    console.log('Episodes found:', episodes.length);
    
    if (episodes.length > 0) {
      episodes.forEach((episode, index) => {
        console.log(`Episode ${index + 1}:`, {
          id: episode.SHOW_EPISODE_ID,
          title: episode.SHOW_EPISODE_TITLE,
          episode_number: episode.EPISODE_NUMBER,
          video_url: episode.VIDEO_URL
        });
      });
    } else {
      console.log('No episodes found for show ID:', showId);
    }

    res.json(episodes);
  } catch (err) {
    console.error('=== ERROR in getEpisodesByShow ===');
    console.error('Error details:', err);
    res.status(500).json({ 
      error: 'Database error', 
      details: err.message,
      showId: showId 
    });
  }
};

exports.updateEpisode = async (req, res) => {
  const episodeId = req.params.episodeId;
  const { title, description, duration, videoUrl } = req.body;

  try {
    console.log('Updating episode', episodeId, 'with VIDEO_URL:', videoUrl); // Debug log
    
    const [result] = await pool.query(`
      UPDATE SHOW_EPISODE 
      SET 
        SHOW_EPISODE_TITLE = ?,
        SHOW_EPISODE_DESCRIPTION = ?,
        SHOW_EPISODE_DURATION = ?,
        VIDEO_URL = ?
      WHERE SHOW_EPISODE_ID = ?
    `, [title, description, duration, videoUrl, episodeId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Episode not found' });
    }

    res.json({ message: 'Episode updated successfully' });
  } catch (err) {
    console.error('Error updating episode:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Simple test endpoint that doesn't use database
exports.testEndpoint = async (req, res) => {
  try {
    console.log('Test endpoint called');
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    
    res.json({ 
      message: 'Test endpoint working', 
      showId: req.params.showId,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error in test endpoint:', err);
    res.status(500).json({ error: 'Test endpoint error', details: err.message });
  }
};