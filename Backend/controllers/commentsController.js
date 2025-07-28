const pool = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Set up multer storage for comment images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/comment_uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Helper function to update comment counts
async function updateCommentCounts(commentId) {
  try {
    const [likesCount] = await pool.query(
      'SELECT COUNT(*) as count FROM COMMENT_INTERACTIONS WHERE COMMENT_ID = ? AND INTERACTION_TYPE = ?',
      [commentId, 'like']
    );
    
    const [dislikesCount] = await pool.query(
      'SELECT COUNT(*) as count FROM COMMENT_INTERACTIONS WHERE COMMENT_ID = ? AND INTERACTION_TYPE = ?',
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
      `SELECT C.COMMENT_ID, C.TEXT AS COMMENT_TEXT, C.TIME, C.USER_ID,C.IMG_LINK,
              U.USER_FIRSTNAME AS USERNAME, C.LIKE_COUNT, C.DISLIKE_COUNT, U.PROFILE_PICTURE,
              C.PARENT_ID, C.DELETED, C.EDITED,
              ${userId ? 'CI.INTERACTION_TYPE AS USER_INTERACTION' : 'NULL AS USER_INTERACTION'}
       FROM COMMENT C
       JOIN USER U ON C.USER_ID = U.USER_ID
       ${userId ? 'LEFT JOIN COMMENT_INTERACTIONS CI ON C.COMMENT_ID = CI.COMMENT_ID AND CI.USER_ID = ?' : ''}
       WHERE C.SHOW_EPISODE_ID = ?
       ORDER BY C.TIME ASC`,
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
  const { episode_id, comment_text, parent_id, img_link } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO COMMENT 
       (USER_ID, SHOW_EPISODE_ID, TEXT, PARENT_ID, TIME, IMG_LINK, LIKE_COUNT, DISLIKE_COUNT, DELETED, EDITED, PINNED)
       VALUES (?, ?, ?, ?, NOW(), ?, 0, 0, 0, 0, 0)`,
      [userId, episode_id, comment_text, parent_id || null, img_link || null]
    );
    const [commentRows] = await pool.query(
      `SELECT C.COMMENT_ID, C.TEXT AS COMMENT_TEXT, C.TIME, C.USER_ID,
              U.USER_FIRSTNAME AS USERNAME, C.LIKE_COUNT, C.DISLIKE_COUNT, C.PARENT_ID, C.IMG_LINK
       FROM COMMENT C
       JOIN USER U ON C.USER_ID = U.USER_ID
       WHERE C.COMMENT_ID = ?`,
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
      'SELECT INTERACTION_TYPE FROM COMMENT_INTERACTIONS WHERE USER_ID = ? AND COMMENT_ID = ?',
      [userId, commentId]
    );
    
    if (currentInteraction.length === 0) {
      // No previous interaction - add like
      await pool.query(
        'INSERT INTO COMMENT_INTERACTIONS (USER_ID, COMMENT_ID, INTERACTION_TYPE) VALUES (?, ?, ?)',
        [userId, commentId, 'like']
      );
    } else if (currentInteraction[0].INTERACTION_TYPE === 'like') {
      // Already liked - remove like
      await pool.query(
        'DELETE FROM COMMENT_INTERACTIONS WHERE USER_ID = ? AND COMMENT_ID = ?',
        [userId, commentId]
      );
    } else {
      // Was disliked - change to like
      await pool.query(
        'UPDATE COMMENT_INTERACTIONS SET INTERACTION_TYPE = ? WHERE USER_ID = ? AND COMMENT_ID = ?',
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
      'SELECT INTERACTION_TYPE FROM COMMENT_INTERACTIONS WHERE USER_ID = ? AND COMMENT_ID = ?',
      [userId, commentId]
    );
    
    if (currentInteraction.length === 0) {
      // No previous interaction - add dislike
      await pool.query(
        'INSERT INTO COMMENT_INTERACTIONS (USER_ID, COMMENT_ID, INTERACTION_TYPE) VALUES (?, ?, ?)',
        [userId, commentId, 'dislike']
      );
    } else if (currentInteraction[0].INTERACTION_TYPE === 'dislike') {
      // Already disliked - remove dislike
      await pool.query(
        'DELETE FROM COMMENT_INTERACTIONS WHERE USER_ID = ? AND COMMENT_ID = ?',
        [userId, commentId]
      );
    } else {
      // Was liked - change to dislike
      await pool.query(
        'UPDATE COMMENT_INTERACTIONS SET INTERACTION_TYPE = ? WHERE USER_ID = ? AND COMMENT_ID = ?',
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
const fs = require('fs');

// 🔹 Soft delete a comment (only if user owns it) + Clean up images
exports.deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.userId;

  try {
    // Check ownership and get image info
    const [rows] = await pool.query('SELECT USER_ID, PARENT_ID, IMG_LINK FROM COMMENT WHERE COMMENT_ID = ?', [commentId]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (rows[0].USER_ID !== userId) {
      return res.status(403).json({ error: 'You can only delete your own comment' });
    }

    const parentId = rows[0].PARENT_ID;
    const imgLink = rows[0].IMG_LINK;

    // Helper function to delete image file
    const deleteImageFile = (imgPath) => {
      if (imgPath) {
        const fullPath = path.join(__dirname, '../public', imgPath);
        const fs = require('fs');
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error('Error deleting image file:', err);
          } else {
            console.log('Image file deleted:', fullPath);
          }
        });
      }
    };

    // Soft delete the comment and clear IMG_LINK
    await pool.query('UPDATE COMMENT SET DELETED = 1, IMG_LINK = NULL WHERE COMMENT_ID = ?', [commentId]);
    
    // Delete the image file immediately
    deleteImageFile(imgLink);

    // Function to hard delete comment and its deleted children if no undeleted children remain
    async function tryHardDelete(commentId) {
      // Check if any undeleted replies exist for this comment
      const [undeletedReplies] = await pool.query(
        'SELECT COMMENT_ID FROM COMMENT WHERE PARENT_ID = ? AND DELETED = 0',
        [commentId]
      );

      if (undeletedReplies.length === 0) {
        // Get all images that will be deleted (parent + deleted children)
        const [imagesToDelete] = await pool.query(
          'SELECT IMG_LINK FROM COMMENT WHERE COMMENT_ID = ? OR (PARENT_ID = ? AND DELETED = 1)',
          [commentId, commentId]
        );

        // Delete image files (though they should already be null for soft-deleted comments)
        imagesToDelete.forEach(row => {
          if (row.IMG_LINK) {
            deleteImageFile(row.IMG_LINK);
          }
        });

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
      `SELECT CI.COMMENT_ID, CI.INTERACTION_TYPE 
       FROM COMMENT_INTERACTIONS CI
       JOIN COMMENT C ON CI.COMMENT_ID = C.COMMENT_ID
       WHERE CI.USER_ID = ? AND C.SHOW_EPISODE_ID = ? AND C.DELETED = 0`,
      [userId, episodeId]
    );
    
    const likes = interactions
      .filter(i => i.INTERACTION_TYPE === 'like')
      .map(i => i.COMMENT_ID);
      
    const dislikes = interactions
      .filter(i => i.INTERACTION_TYPE === 'dislike')
      .map(i => i.COMMENT_ID);
    
    res.json({ likes, dislikes });
  } catch (err) {
    console.error('Error fetching user interactions:', err);
    res.status(500).json({ error: 'Failed to fetch user interactions' });
  }
};

// 🔹 Upload image for comment
exports.uploadCommentImage = [
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    // Return the relative path to be stored in IMG_LINK
    const imgLink = `/images/comment_uploads/${req.file.filename}`;
    res.json({ imgLink });
  }
];

// 🔹 Edit a comment or reply
// Replace your editComment function with this debug version:
exports.editComment = async (req, res) => {
  console.log('🔍 Edit comment called with:', {
    commentId: req.params.commentId,
    userId: req.user?.userId,
    body: req.body
  });

  const commentId = req.params.commentId;
  const userId = req.user.userId;
  const { text } = req.body;
  
  if (!text || !text.trim()) {
    console.log('❌ Text validation failed');
    return res.status(400).json({ error: 'Text is required' });
  }
  
  try {
    console.log('🔍 Checking ownership for comment:', commentId);
    
    // Check ownership
    const [rows] = await pool.query('SELECT USER_ID FROM COMMENT WHERE COMMENT_ID = ? AND DELETED = 0', [commentId]);
    console.log('🔍 Ownership check result:', rows);
    
    if (!rows.length) {
      console.log('❌ Comment not found');
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (rows[0].USER_ID !== userId) {
      console.log('❌ User not authorized:', { owner: rows[0].USER_ID, requester: userId });
      return res.status(403).json({ error: 'You can only edit your own comment' });
    }
    
    console.log('✅ Updating comment text...');
    await pool.query('UPDATE COMMENT SET TEXT = ?, EDITED = 1 WHERE COMMENT_ID = ?', [text, commentId]);
    
    console.log('🔍 Fetching updated comment...');
    const [updated] = await pool.query(
      `SELECT C.COMMENT_ID, C.TEXT AS COMMENT_TEXT, C.TIME, C.USER_ID, C.EDITED,
              U.USER_FIRSTNAME AS USERNAME, C.LIKE_COUNT, C.DISLIKE_COUNT, C.PARENT_ID, C.IMG_LINK, U.PROFILE_PICTURE
       FROM COMMENT C
       JOIN USER U ON C.USER_ID = U.USER_ID
       WHERE C.COMMENT_ID = ? AND C.DELETED = 0`,
      [commentId]
    );
    
    console.log('🔍 Updated comment result:', updated);
    
    if (!updated.length) {
      console.log('❌ Comment not found after update');
      return res.status(404).json({ error: 'Comment not found after update' });
    }
    
    console.log('✅ Edit successful, returning:', updated[0]);
    res.json(updated[0]);
  } catch (err) {
    console.error('❌ Error editing comment:', err);
    res.status(500).json({ error: 'Failed to edit comment' });
  }
};