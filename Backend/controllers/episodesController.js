// controllers/episodesController.js
const pool = require('../db');

exports.getEpisodeInfo = async (req, res) => {
  const episodeId = req.params.episodeId;

  try {
    const [episode] = await pool.query(`
      SELECT 
        se.SHOW_EPISODE_ID,
        se.SHOW_EPISODE_TITLE,
        se.EPISODE_NUMBER,
        se.SHOW_EPISODE_DESCRIPTION,
        se.SHOW_EPISODE_DURATION,
        se.SHOW_EPISODE_RELEASE_DATE,
        se.VIDEO_URL,
        s.TITLE as SHOW_TITLE,
        s.SHOW_ID
      FROM SHOW_EPISODE se
      JOIN \`SHOW\` s ON se.SHOW_ID = s.SHOW_ID
      WHERE se.SHOW_EPISODE_ID = ? AND s.REMOVED = 0
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

    res.json(episodes);
  } catch (err) {
    console.error('Error fetching episodes:', err);
    res.status(500).json({ error: 'Database error' });
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
