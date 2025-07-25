const db = require('../db');

// Get rating for a specific episode by a user
const getUserEpisodeRating = async (req, res) => {
  try {
    const { episodeId } = req.params;
    const userId = req.user.userId;
    
    // Get the actual SHOW_EPISODE_ID (handles both direct episode ID and show ID for movies)
    const fetchEpisodeQuery = `
      SELECT SHOW_EPISODE_ID 
      FROM show_episode 
      WHERE SHOW_EPISODE_ID = ? OR SHOW_ID = ?
      LIMIT 1
    `;
    const [episodeResult] = await db.execute(fetchEpisodeQuery, [episodeId, episodeId]);
    
    if (episodeResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found'
      });
    }
    
    const actualEpisodeId = episodeResult[0].SHOW_EPISODE_ID;
    
    const query = `
      SELECT RATING_VALUE, RATING_DATE 
      FROM rating 
      WHERE USER_ID = ? AND SHOW_EPISODE_ID = ?
    `;
    
    const [ratings] = await db.execute(query, [userId, actualEpisodeId]);
    
    res.json({
      success: true,
      rating: ratings.length > 0 ? ratings[0] : null
    });
  } catch (error) {
    console.error('Error fetching user episode rating:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rating'
    });
  }
};

// Get average rating for an episode
const getEpisodeAverageRating = async (req, res) => {
  try {
    const { episodeId } = req.params;
    
    // Get the actual SHOW_EPISODE_ID (handles both direct episode ID and show ID for movies)
    const fetchEpisodeQuery = `
      SELECT SHOW_EPISODE_ID 
      FROM show_episode 
      WHERE SHOW_EPISODE_ID = ? OR SHOW_ID = ?
      LIMIT 1
    `;
    const [episodeResult] = await db.execute(fetchEpisodeQuery, [episodeId, episodeId]);
    
    if (episodeResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found'
      });
    }
    
    const actualEpisodeId = episodeResult[0].SHOW_EPISODE_ID;
    
    const query = `
      SELECT 
        AVG(RATING_VALUE) as average_rating,
        COUNT(*) as total_ratings
      FROM rating 
      WHERE SHOW_EPISODE_ID = ?
    `;
    
    const [results] = await db.execute(query, [actualEpisodeId]);
    
    res.json({
      success: true,
      averageRating: results[0].average_rating ? parseFloat(results[0].average_rating).toFixed(1) : 0,
      totalRatings: results[0].total_ratings
    });
  } catch (error) {
    console.error('Error fetching episode average rating:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch average rating'
    });
  }
};

// Submit or update rating for an episode
const submitEpisodeRating = async (req, res) => {
  try {
    const { episodeId } = req.params;
    const { ratingValue } = req.body;
    const userId = req.user.userId;
    
    if (!ratingValue || ratingValue < 1 || ratingValue > 10) {
      return res.status(400).json({
        success: false,
        error: 'Rating value must be between 1 and 10'
      });
    }
    
    // Get the actual SHOW_EPISODE_ID (handles both direct episode ID and show ID)
    const fetchEpisodeQuery = `
      SELECT SHOW_EPISODE_ID 
      FROM show_episode 
      WHERE SHOW_EPISODE_ID = ? OR SHOW_ID = ?
    `;
    const [episodeResult] = await db.execute(fetchEpisodeQuery, [episodeId, episodeId]);
    
    if (episodeResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found'
      });
    }
    
    const actualEpisodeId = episodeResult[0].SHOW_EPISODE_ID;
    
    // Check if rating already exists
    const checkQuery = 'SELECT * FROM rating WHERE USER_ID = ? AND SHOW_EPISODE_ID = ?';
    const [existingRatings] = await db.execute(checkQuery, [userId, actualEpisodeId]);
    
    if (existingRatings.length > 0) {
      // Update existing rating
      const updateQuery = `
        UPDATE rating 
        SET RATING_VALUE = ?, RATING_DATE = CURRENT_TIMESTAMP 
        WHERE USER_ID = ? AND SHOW_EPISODE_ID = ?
      `;
      await db.execute(updateQuery, [ratingValue, userId, actualEpisodeId]);
      
      res.json({
        success: true,
        message: 'Rating updated successfully'
      });
    } else {
      // Insert new rating
      const insertQuery = `
        INSERT INTO rating (USER_ID, SHOW_EPISODE_ID, RATING_VALUE) 
        VALUES (?, ?, ?)
      `;
      await db.execute(insertQuery, [userId, actualEpisodeId, ratingValue]);
      
      res.status(201).json({
        success: true,
        message: 'Rating submitted successfully'
      });
    }
  } catch (error) {
    console.error('Error submitting episode rating:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit rating'
    });
  }
};

// Delete user's rating for an episode
const deleteEpisodeRating = async (req, res) => {
  try {
    const { episodeId } = req.params;
    const userId = req.user.userId;
    
    // Get the actual SHOW_EPISODE_ID (handles both direct episode ID and show ID for movies)
    const fetchEpisodeQuery = `
      SELECT SHOW_EPISODE_ID 
      FROM show_episode 
      WHERE SHOW_EPISODE_ID = ? OR SHOW_ID = ?
      LIMIT 1
    `;
    const [episodeResult] = await db.execute(fetchEpisodeQuery, [episodeId, episodeId]);
    
    if (episodeResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found'
      });
    }
    
    const actualEpisodeId = episodeResult[0].SHOW_EPISODE_ID;
    
    const deleteQuery = 'DELETE FROM rating WHERE USER_ID = ? AND SHOW_EPISODE_ID = ?';
    const [result] = await db.execute(deleteQuery, [userId, actualEpisodeId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting episode rating:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete rating'
    });
  }
};

// Get all ratings by a specific user (for profile page)
const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const query = `
      SELECT 
        r.RATING_VALUE,
        r.RATING_DATE,
        r.SHOW_EPISODE_ID,
        se.EPISODE_NUMBER,
        s.SHOW_ID,
        s.TITLE as SHOW_TITLE,
        s.THUMBNAIL,
        s.SEASON,
        c.CATEGORY_NAME
      FROM rating r
      JOIN show_episode se ON r.SHOW_EPISODE_ID = se.SHOW_EPISODE_ID
      JOIN \`show\` s ON se.SHOW_ID = s.SHOW_ID
      LEFT JOIN category c ON s.CATEGORY_ID = c.CATEGORY_ID
      WHERE r.USER_ID = ? AND s.REMOVED = 0
      ORDER BY r.RATING_DATE DESC
    `;
    
    const [ratings] = await db.execute(query, [userId]);
    
    res.json({
      success: true,
      ratings
    });
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user ratings'
    });
  }
};

// Get ratings for all episodes of a show (for show statistics)
const getShowRatings = async (req, res) => {
  try {
    const { showId } = req.params;
    
    const query = `
      SELECT 
        se.SHOW_EPISODE_ID,
        se.EPISODE_NUMBER,
        se.TITLE as EPISODE_TITLE,
        AVG(r.RATING_VALUE) as average_rating,
        COUNT(r.RATING_VALUE) as total_ratings
      FROM show_episode se
      LEFT JOIN rating r ON se.SHOW_EPISODE_ID = r.SHOW_EPISODE_ID
      WHERE se.SHOW_ID = ?
      GROUP BY se.SHOW_EPISODE_ID, se.EPISODE_NUMBER, se.TITLE
      ORDER BY se.EPISODE_NUMBER
    `;
    
    const [episodes] = await db.execute(query, [showId]);
    
    res.json({
      success: true,
      episodes
    });
  } catch (error) {
    console.error('Error fetching show ratings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch show ratings'
    });
  }
};

module.exports = {
  getUserEpisodeRating,
  getEpisodeAverageRating,
  submitEpisodeRating,
  deleteEpisodeRating,
  getUserRatings,
  getShowRatings
};
