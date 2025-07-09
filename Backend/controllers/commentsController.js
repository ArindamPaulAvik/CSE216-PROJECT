const pool = require('../db');
const jwt = require('jsonwebtoken');

// Helper function to update comment counts
async function updateCommentCounts(commentId) {
  try {
    const [likesCount] = await pool.query(
      'SELECT COUNT(*) as count FROM comment_interactions WHERE comment_id = ? AND interaction_type = ?',
      [commentId, 'like']
    );
    
    const [dislikesCount] = await pool.query(
      'SELECT COUNT(*) as count FROM comment_interactions WHERE comment_id = ? AND interaction_type = ?',
      [commentId, 'dislike']
    );
    
    await pool.query(
      'UPDATE COMMENT SET LIKE_COUNT = ?, DISLIKE_COUNT = ? WHERE COMMENT_ID = ?',
      [likesCount[0].count, dislikesCount[0].count, commentId]
    );
  } catch (err) {
    console.error('Error updating comment counts:', err);
    throw err;
  }
}

// 🔹 Fetch comments for an episode with username using stored counts and user interactions
exports.getComments = async (req, res) => {
  const episodeId = req.params.episodeId;
  const userId = req.user ? req.user.userId : null; // Handle case where user might not be authenticated
  
  try {
    let query, params;
    
    if (userId) {
      // Include user's interaction status in the query
      query = `
        SELECT c.COMMENT_ID, c.TEXT AS COMMENT_TEXT, c.TIME, c.USER_ID,
               u.USER_FIRSTNAME AS USERNAME, c.LIKE_COUNT, c.DISLIKE_COUNT,
               ci.interaction_type AS USER_INTERACTION
        FROM COMMENT c
        JOIN USER u ON c.USER_ID = u.USER_ID
        LEFT JOIN comment_interactions ci ON c.COMMENT_ID = ci.comment_id AND ci.user_id = ?
        WHERE c.SHOW_EPISODE_ID = ? AND c.DELETED = 0
        ORDER BY c.TIME DESC
      `;
      params = [userId, episodeId];
    } else {
      // No user authentication, just get comments without interaction status
      query = `
        SELECT c.COMMENT_ID, c.TEXT AS COMMENT_TEXT, c.TIME, c.USER_ID,
               u.USER_FIRSTNAME AS USERNAME, c.LIKE_COUNT, c.DISLIKE_COUNT,
               NULL AS USER_INTERACTION
        FROM COMMENT c
        JOIN USER u ON c.USER_ID = u.USER_ID
        WHERE c.SHOW_EPISODE_ID = ? AND c.DELETED = 0
        ORDER BY c.TIME DESC
      `;
      params = [episodeId];
    }
    
    const [comments] = await pool.query(query, params);
    
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// 🔹 Add a comment
exports.addComment = async (req, res) => {
  const userId = req.user.userId;
  const { episode_id, comment_text } = req.body;
  
  try {
    const [result] = await pool.query(
      `INSERT INTO COMMENT 
       (USER_ID, SHOW_EPISODE_ID, TEXT, PARENT_ID, TIME, IMG_LINK, LIKE_COUNT, DISLIKE_COUNT, DELETED, EDITED, PINNED)
       VALUES (?, ?, ?, NULL, NOW(), NULL, 0, 0, 0, 0, 0)`,
      [userId, episode_id, comment_text]
    );
    
    res.json({ 
      message: 'Comment added successfully',
      commentId: result.insertId
    });
  } catch (err) {
    console.error('❌ Add comment error:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// 🔹 Like a comment using comment_interactions table
exports.likeComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.userId;
  
  try {
    // Start transaction to ensure consistency
    await pool.query('START TRANSACTION');
    
    // Check current interaction
    const [currentInteraction] = await pool.query(
      'SELECT interaction_type FROM comment_interactions WHERE user_id = ? AND comment_id = ?',
      [userId, commentId]
    );
    
    if (currentInteraction.length === 0) {
      // No previous interaction - add like
      await pool.query(
        'INSERT INTO comment_interactions (user_id, comment_id, interaction_type) VALUES (?, ?, ?)',
        [userId, commentId, 'like']
      );
    } else if (currentInteraction[0].interaction_type === 'like') {
      // Already liked - remove like
      await pool.query(
        'DELETE FROM comment_interactions WHERE user_id = ? AND comment_id = ?',
        [userId, commentId]
      );
    } else {
      // Was disliked - change to like
      await pool.query(
        'UPDATE comment_interactions SET interaction_type = ? WHERE user_id = ? AND comment_id = ?',
        ['like', userId, commentId]
      );
    }
    
    // Update comment counts
    await updateCommentCounts(commentId);
    
    await pool.query('COMMIT');
    res.json({ message: 'Like status updated successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error liking comment:', err);
    res.status(500).json({ error: 'Failed to like comment' });
  }
};

// 🔹 Dislike a comment using comment_interactions table
exports.dislikeComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.userId;
  
  try {
    // Start transaction to ensure consistency
    await pool.query('START TRANSACTION');
    
    // Check current interaction
    const [currentInteraction] = await pool.query(
      'SELECT interaction_type FROM comment_interactions WHERE user_id = ? AND comment_id = ?',
      [userId, commentId]
    );
    
    if (currentInteraction.length === 0) {
      // No previous interaction - add dislike
      await pool.query(
        'INSERT INTO comment_interactions (user_id, comment_id, interaction_type) VALUES (?, ?, ?)',
        [userId, commentId, 'dislike']
      );
    } else if (currentInteraction[0].interaction_type === 'dislike') {
      // Already disliked - remove dislike
      await pool.query(
        'DELETE FROM comment_interactions WHERE user_id = ? AND comment_id = ?',
        [userId, commentId]
      );
    } else {
      // Was liked - change to dislike
      await pool.query(
        'UPDATE comment_interactions SET interaction_type = ? WHERE user_id = ? AND comment_id = ?',
        ['dislike', userId, commentId]
      );
    }
    
    // Update comment counts
    await updateCommentCounts(commentId);
    
    await pool.query('COMMIT');
    res.json({ message: 'Dislike status updated successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error disliking comment:', err);
    res.status(500).json({ error: 'Failed to dislike comment' });
  }
};

// 🔹 Soft delete a comment
exports.deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  
  try {
    await pool.query(`UPDATE COMMENT SET DELETED = 1 WHERE COMMENT_ID = ?`, [commentId]);
    res.json({ message: 'Comment soft-deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// 🔹 Get user's like/dislike status for an episode's comments (OPTIMIZED)
exports.getUserInteractions = async (req, res) => {
  const episodeId = req.params.episodeId;
  const userId = req.user.userId;
  
  try {
    // Single optimized query to get user interactions for all comments in episode
    const [interactions] = await pool.query(
      `SELECT ci.comment_id, ci.interaction_type 
       FROM comment_interactions ci
       JOIN COMMENT c ON ci.comment_id = c.COMMENT_ID
       WHERE ci.user_id = ? AND c.SHOW_EPISODE_ID = ? AND c.DELETED = 0`,
      [userId, episodeId]
    );
    
    const likes = interactions
      .filter(i => i.interaction_type === 'like')
      .map(i => i.comment_id);
      
    const dislikes = interactions
      .filter(i => i.interaction_type === 'dislike')
      .map(i => i.comment_id);
    
    res.json({ likes, dislikes });
  } catch (err) {
    console.error('Error fetching user interactions:', err);
    res.status(500).json({ error: 'Failed to fetch user interactions' });
  }
};