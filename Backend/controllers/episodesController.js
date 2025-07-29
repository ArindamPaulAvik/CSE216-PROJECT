// controllers/episodesController.js
const pool = require('../db');

exports.getEpisodeInfo = async (req, res) => {
  const episodeId = req.params.episodeId;

  try {
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

    res.json(episode[0]);
  } catch (err) {
    console.error('Error fetching episode:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getEpisodesByShow = async (req, res) => {
  const showId = req.params.showId;

  try {
    console.log('Fetching episodes for show ID:', showId);
    
    // First, let's check if the show exists
    const [showCheck] = await pool.query(`
      SELECT SHOW_ID, TITLE FROM SHOWS WHERE SHOW_ID = ?
    `, [showId]);
    
    if (showCheck.length === 0) {
      console.log('Show not found with ID:', showId);
      return res.status(404).json({ error: 'Show not found' });
    }
    
    console.log('Show found:', showCheck[0]);

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
    `, [showId]);

    console.log('Episodes found:', episodes.length);
    if (episodes.length > 0) {
      console.log('Sample episode:', episodes[0]);
    }

    res.json(episodes);
  } catch (err) {
    console.error('Error fetching episodes:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'Database error', 
      message: err.message,
      stack: err.stack 
    });
  }
};

exports.updateEpisode = async (req, res) => {
  const episodeId = req.params.episodeId;
  const { title, description, duration, videoUrl } = req.body;

  try {
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
    res.status(500).json({ error: 'Database error' });
  }
};
