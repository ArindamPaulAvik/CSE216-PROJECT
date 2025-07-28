const pool = require('../db');

// Record a watch event
const recordWatchEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { showEpisodeId } = req.body;

    if (!showEpisodeId) {
      return res.status(400).json({
        success: false,
        error: 'Show episode ID is required'
      });
    }

    // Insert new watch record
    const insertQuery = `
      INSERT INTO USER_EPISODE (USER_ID, SHOW_EPISODE_ID, WATCHED, TIMESTAMP)
      VALUES (?, ?, 1, NOW())
    `;
    
    await pool.execute(insertQuery, [userId, showEpisodeId]);
    
    res.json({
      success: true,
      message: 'Watch event recorded successfully'
    });
  } catch (error) {
    console.error('Error recording watch event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record watch event'
    });
  }
};

module.exports = {
  recordWatchEvent
};
