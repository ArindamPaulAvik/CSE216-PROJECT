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

// Fetches episodes with VIDEO_URL
exports.getEpisodesByShow = async (req, res) => {
  const showId = req.params.showId;
  
  const [episodes] = await pool.query(`
    SELECT 
      SHOW_EPISODE_ID,
      EPISODE_NUMBER,
      SHOW_EPISODE_TITLE,
      SHOW_EPISODE_DESCRIPTION,
      SHOW_EPISODE_DURATION,
      SHOW_EPISODE_RELEASE_DATE,
      VIDEO_URL  // ← This is where the video URL comes from
    FROM SHOW_EPISODE
    WHERE SHOW_ID = ?
    ORDER BY EPISODE_NUMBER ASC
  `, [showId]);
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
