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

// 🔹 Fetch comments for an episode with nested replies (single level) and user info
exports.getComments = async (req, res) => {
  const episodeId = req.params.episodeId;
  const userId = req.user ? req.user.userId : null;
  try {
    // Fetch all comments for the episode
    const [comments] = await pool.query(
      `SELECT c.COMMENT_ID, c.TEXT AS COMMENT_TEXT, c.TIME, c.USER_ID,
              u.USER_FIRSTNAME AS USERNAME, c.LIKE_COUNT, c.DISLIKE_COUNT,
              c.PARENT_ID, c.DELETED,
              ${userId ? 'ci.interaction_type AS USER_INTERACTION' : 'NULL AS USER_INTERACTION'}
       FROM COMMENT c
       JOIN USER u ON c.USER_ID = u.USER_ID
       ${userId ? 'LEFT JOIN comment_interactions ci ON c.COMMENT_ID = ci.comment_id AND ci.user_id = ?' : ''}
       WHERE c.SHOW_EPISODE_ID = ?
       ORDER BY c.TIME ASC`,
      userId ? [userId, episodeId] : [episodeId]
    );

    // Map deleted comments to show [DELETED] and [USER]
    const mappedComments = comments.map(c => ({
      ...c,
      COMMENT_TEXT: c.DELETED ? '[DELETED]' : c.COMMENT_TEXT,
      USERNAME: c.DELETED ? '[USER]' : c.USERNAME
    }));

    // Organize comments into parent and replies (single nested level)
    const parents = [];
    const repliesMap = {};
    for (const c of mappedComments) {
      if (!c.PARENT_ID) {
        parents.push({ ...c, replies: [] });
      } else {
        if (!repliesMap[c.PARENT_ID]) repliesMap[c.PARENT_ID] = [];
        repliesMap[c.PARENT_ID].push(c);
      }
    }
    // Attach replies to parents
    for (const parent of parents) {
      parent.replies = repliesMap[parent.COMMENT_ID] || [];
    }
    res.json(parents);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// 🔹 Add a comment or reply (if parent_id is provided)
exports.addComment = async (req, res) => {
  const userId = req.user.userId;
  const { episode_id, comment_text, parent_id } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO COMMENT 
       (USER_ID, SHOW_EPISODE_ID, TEXT, PARENT_ID, TIME, IMG_LINK, LIKE_COUNT, DISLIKE_COUNT, DELETED, EDITED, PINNED)
       VALUES (?, ?, ?, ?, NOW(), NULL, 0, 0, 0, 0, 0)`,
      [userId, episode_id, comment_text, parent_id || null]
    );
    const [commentRows] = await pool.query(
      `SELECT c.COMMENT_ID, c.TEXT AS COMMENT_TEXT, c.TIME, c.USER_ID,
              u.USER_FIRSTNAME AS USERNAME, c.LIKE_COUNT, c.DISLIKE_COUNT, c.PARENT_ID
       FROM COMMENT c
       JOIN USER u ON c.USER_ID = u.USER_ID
       WHERE c.COMMENT_ID = ?`,
      [result.insertId]
    );
    res.json(commentRows[0]);
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

// 🔹 Soft delete a comment (only if user owns it)
exports.deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.userId;

  try {
    // Check ownership
    const [rows] = await pool.query('SELECT USER_ID, PARENT_ID FROM COMMENT WHERE COMMENT_ID = ?', [commentId]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (rows[0].USER_ID !== userId) {
      return res.status(403).json({ error: 'You can only delete your own comment' });
    }

    const parentId = rows[0].PARENT_ID;

    // Soft delete the comment
    await pool.query('UPDATE COMMENT SET DELETED = 1 WHERE COMMENT_ID = ?', [commentId]);

    // Function to hard delete comment and its deleted children if no undeleted children remain
    async function tryHardDelete(commentId) {
      // Check if any undeleted replies exist for this comment
      const [undeletedReplies] = await pool.query(
        'SELECT COMMENT_ID FROM COMMENT WHERE PARENT_ID = ? AND DELETED = 0',
        [commentId]
      );

      if (undeletedReplies.length === 0) {
        // Hard delete this comment and its deleted children
        await pool.query(
          'DELETE FROM COMMENT WHERE COMMENT_ID = ? OR (PARENT_ID = ? AND DELETED = 1)',
          [commentId, commentId]
        );
      }
    }

    // Try hard delete the current comment if no undeleted children
    await tryHardDelete(commentId);

    // If parent exists and is deleted, check if parent can also be hard deleted
    if (parentId) {
      // Check if parent is deleted
      const [parentRow] = await pool.query('SELECT DELETED FROM COMMENT WHERE COMMENT_ID = ?', [parentId]);
      if (parentRow.length && parentRow[0].DELETED === 1) {
        // Try hard delete parent (which deletes parent and all its deleted children)
        await tryHardDelete(parentId);
      }
    }

    res.json({ message: 'Comment deleted successfully' });
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