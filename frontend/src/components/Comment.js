import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AiFillLike, AiFillDislike, AiFillDelete } from 'react-icons/ai';
import { motion } from 'framer-motion';

function CommentSection({ episodeId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLikes, setUserLikes] = useState(new Set());
  const [userDislikes, setUserDislikes] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(new Set());
  
  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const currentUserId = localStorage.getItem('user_id');

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/comments/episode/${episodeId}`,
        { headers }
      );
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
    setLoading(false);
  }, [episodeId, headers]);

  const fetchUserInteractions = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/comments/episode/${episodeId}/user-interactions`,
        { headers }
      );
      
      const { likes = [], dislikes = [] } = res.data;
      setUserLikes(new Set(likes));
      setUserDislikes(new Set(dislikes));
    } catch (err) {
      console.error('Error fetching user interactions:', err);
    }
  }, [episodeId, headers]);

  useEffect(() => {
    if (episodeId) {
      fetchComments();
      fetchUserInteractions();
    }
  }, [episodeId, fetchComments, fetchUserInteractions]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    const tempComment = {
      COMMENT_ID: `temp-${Date.now()}`,
      COMMENT_TEXT: newComment,
      USERNAME: 'You', // or get from localStorage/context
      USER_ID: currentUserId,
      LIKE_COUNT: 0,
      DISLIKE_COUNT: 0,
      isTemp: true
    };
    
    // Optimistically add comment to UI
    setComments(prev => [tempComment, ...prev]);
    setNewComment('');
    
    try {
      const res = await axios.post(
        `http://localhost:5000/comments`,
        { episode_id: episodeId, comment_text: newComment },
        { headers }
      );
      
      // Replace temp comment with real comment
      setComments(prev => prev.map(comment => 
        comment.COMMENT_ID === tempComment.COMMENT_ID 
          ? { ...res.data, isTemp: false }
          : comment
      ));
    } catch (err) {
      console.error('Error posting comment:', err);
      // Remove temp comment on error
      setComments(prev => prev.filter(c => c.COMMENT_ID !== tempComment.COMMENT_ID));
      setNewComment(tempComment.COMMENT_TEXT); // Restore text for retry
    }
  };

  const handleLike = async (commentId) => {
    if (actionLoading.has(commentId)) return;
    
    setActionLoading(prev => new Set([...prev, commentId]));
    
    const wasLiked = userLikes.has(commentId);
    const wasDisliked = userDislikes.has(commentId);
    
    // Optimistic UI updates
    setComments(prev => prev.map(comment => {
      if (comment.COMMENT_ID === commentId) {
        let newLikeCount = comment.LIKE_COUNT || 0;
        let newDislikeCount = comment.DISLIKE_COUNT || 0;
        
        if (wasLiked) {
          // Unlike
          newLikeCount -= 1;
        } else {
          // Like
          newLikeCount += 1;
          if (wasDisliked) {
            // Remove dislike
            newDislikeCount -= 1;
          }
        }
        
        return {
          ...comment,
          LIKE_COUNT: Math.max(0, newLikeCount),
          DISLIKE_COUNT: Math.max(0, newDislikeCount)
        };
      }
      return comment;
    }));
    
    // Update user interactions
    if (wasLiked) {
      setUserLikes(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    } else {
      setUserLikes(prev => new Set([...prev, commentId]));
      if (wasDisliked) {
        setUserDislikes(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    }
    
    try {
      await axios.put(
        `http://localhost:5000/comments/${commentId}/like`,
        {},
        { headers }
      );
    } catch (err) {
      console.error('Error liking comment:', err);
      // Revert optimistic updates on error
      await Promise.all([
        fetchComments(),
        fetchUserInteractions()
      ]);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleDislike = async (commentId) => {
    if (actionLoading.has(commentId)) return;
    
    setActionLoading(prev => new Set([...prev, commentId]));
    
    const wasLiked = userLikes.has(commentId);
    const wasDisliked = userDislikes.has(commentId);
    
    // Optimistic UI updates
    setComments(prev => prev.map(comment => {
      if (comment.COMMENT_ID === commentId) {
        let newLikeCount = comment.LIKE_COUNT || 0;
        let newDislikeCount = comment.DISLIKE_COUNT || 0;
        
        if (wasDisliked) {
          // Remove dislike
          newDislikeCount -= 1;
        } else {
          // Dislike
          newDislikeCount += 1;
          if (wasLiked) {
            // Remove like
            newLikeCount -= 1;
          }
        }
        
        return {
          ...comment,
          LIKE_COUNT: Math.max(0, newLikeCount),
          DISLIKE_COUNT: Math.max(0, newDislikeCount)
        };
      }
      return comment;
    }));
    
    // Update user interactions
    if (wasDisliked) {
      setUserDislikes(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    } else {
      setUserDislikes(prev => new Set([...prev, commentId]));
      if (wasLiked) {
        setUserLikes(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    }
    
    try {
      await axios.put(
        `http://localhost:5000/comments/${commentId}/dislike`,
        {},
        { headers }
      );
    } catch (err) {
      console.error('Error disliking comment:', err);
      // Revert optimistic updates on error
      await Promise.all([
        fetchComments(),
        fetchUserInteractions()
      ]);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleDelete = async (commentId) => {
    if (actionLoading.has(commentId)) return;
    
    setActionLoading(prev => new Set([...prev, commentId]));
    
    // Store the comment for potential restoration
    const commentToDelete = comments.find(c => c.COMMENT_ID === commentId);
    
    // Optimistically remove comment from UI
    setComments(prev => prev.filter(c => c.COMMENT_ID !== commentId));
    
    // Remove from user interactions
    setUserLikes(prev => {
      const newSet = new Set(prev);
      newSet.delete(commentId);
      return newSet;
    });
    setUserDislikes(prev => {
      const newSet = new Set(prev);
      newSet.delete(commentId);
      return newSet;
    });
    
    try {
      await axios.delete(`http://localhost:5000/comments/${commentId}`, {
        headers,
      });
    } catch (err) {
      console.error('Error deleting comment:', err);
      // Restore comment on error
      if (commentToDelete) {
        setComments(prev => {
          const newComments = [...prev];
          // Find the correct position to restore the comment
          const originalIndex = comments.findIndex(c => c.COMMENT_ID === commentId);
          newComments.splice(originalIndex, 0, commentToDelete);
          return newComments;
        });
      }
      // Refresh to get correct state
      await fetchComments();
      await fetchUserInteractions();
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h2>Comments</h2>
      
      {/* Add Comment Section */}
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#222',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '8px',
            resize: 'none',
            minHeight: '80px',
          }}
        />
        <motion.button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          whileHover={{
            scale: 1.05,
            boxShadow: '0px 0px 10px rgba(0,255,100,0.5)',
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: !newComment.trim() ? '#555' : '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: !newComment.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Post Comment
        </motion.button>
      </div>

      {/* Comments List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <motion.div
              key={comment.COMMENT_ID}
              initial={comment.isTemp ? { opacity: 0, y: -20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: comment.isTemp ? '#2a2a2a' : '#1a1a1a',
                border: comment.isTemp ? '1px solid #4CAF50' : '1px solid #333',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                opacity: comment.isTemp ? 0.8 : 1,
              }}
            >
              {/* Comment Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <strong style={{ color: '#4CAF50' }}>
                  {comment.USERNAME || 'Anonymous'}
                  {comment.isTemp && <span style={{ color: '#888', fontSize: '12px' }}> (posting...)</span>}
                </strong>
                {String(comment.USER_ID) === String(currentUserId) && !comment.isTemp && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.COMMENT_ID)}
                    disabled={actionLoading.has(comment.COMMENT_ID)}
                    style={{
                      ...iconButtonStyle,
                      color: actionLoading.has(comment.COMMENT_ID) ? '#555' : '#ff9800',
                    }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 4px #ff9800)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AiFillDelete size={16} />
                    </motion.span>
                    Delete
                  </button>
                )}
              </div>

              {/* Comment Content */}
              <p style={{ 
                margin: '10px 0', 
                lineHeight: '1.5',
                wordBreak: 'break-word'
              }}>
                {comment.COMMENT_TEXT}
              </p>

              {/* Like/Dislike Buttons */}
              {!comment.isTemp && (
                <div style={{ 
                  display: 'flex', 
                  gap: '15px', 
                  alignItems: 'center',
                  marginTop: '10px'
                }}>
                  <button
                    type="button"
                    onClick={() => handleLike(comment.COMMENT_ID)}
                    disabled={actionLoading.has(comment.COMMENT_ID)}
                    style={{
                      ...iconButtonStyle,
                      color: userLikes.has(comment.COMMENT_ID) ? '#4CAF50' : '#ccc',
                      backgroundColor: userLikes.has(comment.COMMENT_ID) ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                      border: userLikes.has(comment.COMMENT_ID) ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid transparent',
                    }}
                  >
                    <motion.span
                      whileHover={{ 
                        scale: 1.3, 
                        color: '#4CAF50', 
                        filter: 'drop-shadow(0 0 4px #4CAF50)' 
                      }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        color: userLikes.has(comment.COMMENT_ID) ? '#4CAF50' : '#ccc',
                        filter: userLikes.has(comment.COMMENT_ID) ? 'drop-shadow(0 0 8px #4CAF50)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <AiFillLike size={18} />
                    </motion.span>
                    <span style={{ minWidth: '20px' }}>
                      {comment.LIKE_COUNT || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDislike(comment.COMMENT_ID)}
                    disabled={actionLoading.has(comment.COMMENT_ID)}
                    style={{
                      ...iconButtonStyle,
                      color: userDislikes.has(comment.COMMENT_ID) ? '#f44336' : '#ccc',
                      backgroundColor: userDislikes.has(comment.COMMENT_ID) ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
                      border: userDislikes.has(comment.COMMENT_ID) ? '1px solid rgba(244, 67, 54, 0.3)' : '1px solid transparent',
                    }}
                  >
                    <motion.span
                      whileHover={{ 
                        scale: 1.3, 
                        color: '#f44336', 
                        filter: 'drop-shadow(0 0 4px #f44336)' 
                      }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        color: userDislikes.has(comment.COMMENT_ID) ? '#f44336' : '#ccc',
                        filter: userDislikes.has(comment.COMMENT_ID) ? 'drop-shadow(0 0 8px #f44336)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <AiFillDislike size={18} />
                    </motion.span>
                    <span style={{ minWidth: '20px' }}>
                      {comment.DISLIKE_COUNT || 0}
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
  padding: '4px 8px',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
};

export default CommentSection;