const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const authenticateToken = require('../middleware/authenticateToken');

// ✅ Get all comments for an episode
router.get('/episode/:episodeId', commentsController.getComments);

// ✅ Post a new comment (requires login)
router.post('/', authenticateToken, commentsController.addComment);

// ✅ Like a comment
router.put('/:commentId/like', authenticateToken, commentsController.likeComment);

// ✅ Dislike a comment
router.put('/:commentId/dislike', authenticateToken, commentsController.dislikeComment);

// ✅ Soft delete a comment
router.delete('/:commentId', authenticateToken, commentsController.deleteComment);

// Add this route to your comments routes file
// (wherever you have your other comment routes)
router.get('/episode/:episodeId/user-interactions', authenticateToken, commentsController.getUserInteractions);

// Image upload for comments
router.post('/upload-image', commentsController.uploadCommentImage);

module.exports = router;
