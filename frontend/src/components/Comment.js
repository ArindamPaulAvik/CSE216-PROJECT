import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AiFillLike, AiFillDislike, AiFillDelete, AiOutlineComment } from 'react-icons/ai';
import { motion } from 'framer-motion';

// Modal styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(22, 33, 62, 0.65)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const modalBoxStyle = {
  background: '#1a1a40',
  border: '2px solid #7f5af0',
  borderRadius: '14px',
  padding: '32px 28px 22px 28px',
  minWidth: '320px',
  maxWidth: '90vw',
  boxShadow: '0 8px 32px rgba(22,33,62,0.35)',
  color: '#fff',
  textAlign: 'center',
};
const modalButtonRow = {
  display: 'flex',
  gap: '18px',
  justifyContent: 'center',
  marginTop: '28px',
};
const modalButton = {
  padding: '9px 28px',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '1rem',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

function CommentSection({ episodeId }) {
  // Modal state for delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null); // { commentId, isReply, parentId }
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLikes, setUserLikes] = useState(new Set());
  const [userDislikes, setUserDislikes] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null); // commentId being replied to
  const [replyText, setReplyText] = useState('');

  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Always get current user id from localStorage, and update if it changes (even in same tab)
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('user_id'));
  useEffect(() => {
    const handleStorage = () => setCurrentUserId(localStorage.getItem('user_id'));
    window.addEventListener('storage', handleStorage);

    // Patch localStorage.setItem to dispatch a custom event for same-tab updates
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'user_id') {
        window.dispatchEvent(new Event('user_id_changed'));
      }
    };
    // Listen for the custom event
    window.addEventListener('user_id_changed', handleStorage);

    // Also update on mount
    handleStorage();
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('user_id_changed', handleStorage);
      // Restore original setItem
      localStorage.setItem = originalSetItem;
    };
  }, []);

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

  // Add parent comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const tempComment = {
      COMMENT_ID: `temp-${Date.now()}`,
      COMMENT_TEXT: newComment,
      USERNAME: 'You',
      USER_ID: currentUserId,
      LIKE_COUNT: 0,
      DISLIKE_COUNT: 0,
      isTemp: true,
      replies: []
    };
    setComments(prev => [tempComment, ...prev]);
    setNewComment('');
    try {
      const res = await axios.post(
        `http://localhost:5000/comments`,
        { episode_id: episodeId, comment_text: newComment },
        { headers }
      );
      setComments(prev => prev.map(comment =>
        comment.COMMENT_ID === tempComment.COMMENT_ID
          ? { ...res.data, isTemp: false, replies: [] }
          : comment
      ));
    } catch (err) {
      console.error('Error posting comment:', err);
      setComments(prev => prev.filter(c => c.COMMENT_ID !== tempComment.COMMENT_ID));
      setNewComment(tempComment.COMMENT_TEXT);
    }
  };

  // Add reply to a parent comment
  const handleAddReply = async (parentId) => {
    if (!replyText.trim()) return;
    const tempReply = {
      COMMENT_ID: `temp-reply-${Date.now()}`,
      COMMENT_TEXT: replyText,
      USERNAME: 'You',
      USER_ID: currentUserId,
      LIKE_COUNT: 0,
      DISLIKE_COUNT: 0,
      isTemp: true,
      PARENT_ID: parentId
    };
    setComments(prev => prev.map(parent =>
      parent.COMMENT_ID === parentId
        ? { ...parent, replies: [...(parent.replies || []), tempReply] }
        : parent
    ));
    setReplyText('');
    setReplyingTo(null);
    try {
      const res = await axios.post(
        `http://localhost:5000/comments`,
        { episode_id: episodeId, comment_text: tempReply.COMMENT_TEXT, parent_id: parentId },
        { headers }
      );
      setComments(prev => prev.map(parent =>
        parent.COMMENT_ID === parentId
          ? { ...parent, replies: parent.replies.map(r =>
              r.COMMENT_ID === tempReply.COMMENT_ID ? { ...res.data, isTemp: false } : r
            ) }
          : parent
      ));
    } catch (err) {
      console.error('Error posting reply:', err);
      setComments(prev => prev.map(parent =>
        parent.COMMENT_ID === parentId
          ? { ...parent, replies: parent.replies.filter(r => r.COMMENT_ID !== tempReply.COMMENT_ID) }
          : parent
      ));
      setReplyText(tempReply.COMMENT_TEXT);
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
        // Top-level comment
        let newLikeCount = comment.LIKE_COUNT || 0;
        let newDislikeCount = comment.DISLIKE_COUNT || 0;
        if (wasLiked) {
          newLikeCount -= 1;
        } else {
          newLikeCount += 1;
          if (wasDisliked) newDislikeCount -= 1;
        }
        return { ...comment, LIKE_COUNT: Math.max(0, newLikeCount), DISLIKE_COUNT: Math.max(0, newDislikeCount) };
      } else if (comment.replies && comment.replies.length > 0) {
        // Check replies
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.COMMENT_ID === commentId) {
              let newLikeCount = reply.LIKE_COUNT || 0;
              let newDislikeCount = reply.DISLIKE_COUNT || 0;
              if (wasLiked) {
                newLikeCount -= 1;
              } else {
                newLikeCount += 1;
                if (wasDisliked) newDislikeCount -= 1;
              }
              return { ...reply, LIKE_COUNT: Math.max(0, newLikeCount), DISLIKE_COUNT: Math.max(0, newDislikeCount) };
            }
            return reply;
          })
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
        // Top-level comment
        let newLikeCount = comment.LIKE_COUNT || 0;
        let newDislikeCount = comment.DISLIKE_COUNT || 0;
        if (wasDisliked) {
          newDislikeCount -= 1;
        } else {
          newDislikeCount += 1;
          if (wasLiked) newLikeCount -= 1;
        }
        return { ...comment, LIKE_COUNT: Math.max(0, newLikeCount), DISLIKE_COUNT: Math.max(0, newDislikeCount) };
      } else if (comment.replies && comment.replies.length > 0) {
        // Check replies
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.COMMENT_ID === commentId) {
              let newLikeCount = reply.LIKE_COUNT || 0;
              let newDislikeCount = reply.DISLIKE_COUNT || 0;
              if (wasDisliked) {
                newDislikeCount -= 1;
              } else {
                newDislikeCount += 1;
                if (wasLiked) newLikeCount -= 1;
              }
              return { ...reply, LIKE_COUNT: Math.max(0, newLikeCount), DISLIKE_COUNT: Math.max(0, newDislikeCount) };
            }
            return reply;
          })
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

  // Open modal for delete confirmation
  const handleDelete = (commentId, isReply = false, parentId = null) => {
    if (actionLoading.has(commentId)) return;
    setDeleteTarget({ commentId, isReply, parentId });
  };

  // Actually perform the delete after confirmation
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { commentId, isReply, parentId } = deleteTarget;
    setActionLoading(prev => new Set([...prev, commentId]));

    // Store for restoration
    let commentToDelete = null;
    if (isReply && parentId) {
      const parent = comments.find(c => c.COMMENT_ID === parentId);
      if (parent && parent.replies) {
        commentToDelete = parent.replies.find(r => r.COMMENT_ID === commentId);
      }
      // Optimistically remove reply
      setComments(prev => prev.map(c =>
        c.COMMENT_ID === parentId
          ? { ...c, replies: c.replies.filter(r => r.COMMENT_ID !== commentId) }
          : c
      ));
    } else {
      commentToDelete = comments.find(c => c.COMMENT_ID === commentId);
      // Optimistically remove parent comment
      setComments(prev => prev.filter(c => c.COMMENT_ID !== commentId));
    }

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
      await axios.delete(`http://localhost:5000/comments/${commentId}`, { headers });
    } catch (err) {
      console.error('Error deleting comment:', err);
      // Restore on error
      if (isReply && parentId && commentToDelete) {
        setComments(prev => prev.map(c =>
          c.COMMENT_ID === parentId
            ? { ...c, replies: [...c.replies, commentToDelete] }
            : c
        ));
      } else if (commentToDelete) {
        setComments(prev => {
          const newComments = [...prev];
          const originalIndex = comments.findIndex(c => c.COMMENT_ID === commentId);
          newComments.splice(originalIndex, 0, commentToDelete);
          return newComments;
        });
      }
      await fetchComments();
      await fetchUserInteractions();
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      setDeleteTarget(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => setDeleteTarget(null);

  return (
    <div style={{ padding: '20px', color: '#fff', background: 'rgba(22, 33, 62, 0.85)', borderRadius: '15px', border: '1px solid #533483', boxShadow: '0 8px 25px rgba(22, 33, 62, 0.3)', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', textAlign: 'center', textShadow: '1px 1px 2px #533483', fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '30px' }}>Comments</h2>
      {/* Add Comment Section */}
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#16213e',
            color: '#fff',
            border: '1.5px solid #533483',
            borderRadius: '8px',
            resize: 'none',
            minHeight: '80px',
            fontFamily: 'inherit',
          }}
        />
        <motion.button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          whileHover={{
            scale: 1.05,
            boxShadow: '0px 0px 10px #7f5af0',
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: '10px',
            padding: '10px 22px',
            background: !newComment.trim() ? '#533483' : 'linear-gradient(45deg, #533483 0%, #16213e 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: !newComment.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(22,33,62,0.2)'
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
                backgroundColor: comment.isTemp ? '#1a1a40' : '#16213e',
                border: comment.isTemp ? '2px solid #7f5af0' : '1.5px solid #533483',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px',
                opacity: comment.isTemp ? 0.8 : 1,
                boxShadow: comment.isTemp ? '0 0 8px 2px #7f5af0' : '0 4px 15px rgba(22, 33, 62, 0.2)'
              }}
            >
              {/* Comment Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <strong style={{ color: '#7f5af0' }}>
                  {comment.USERNAME || 'Anonymous'}
                  {comment.isTemp && <span style={{ color: '#888', fontSize: '12px' }}> (posting...)</span>}
                </strong>
              </div>
              {/* Comment Content */}
              <p style={{
                margin: '10px 0',
                lineHeight: '1.5',
                wordBreak: 'break-word',
                color: '#fff'
              }}>
                {comment.COMMENT_TEXT}
              </p>
              {/* Like/Dislike Buttons + Reply Button */}
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
                      color: userLikes.has(comment.COMMENT_ID) ? '#7f5af0' : '#ccc',
                      background: userLikes.has(comment.COMMENT_ID) ? 'rgba(127, 90, 240, 0.12)' : 'transparent',
                      border: userLikes.has(comment.COMMENT_ID) ? '1.5px solid #7f5af0' : '1.5px solid transparent',
                      borderRadius: '6px',
                    }}
                  >
                    <motion.span
                      whileHover={{
                        scale: 1.3,
                        color: '#7f5af0',
                        filter: 'drop-shadow(0 0 4px #7f5af0)'
                      }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        color: userLikes.has(comment.COMMENT_ID) ? '#7f5af0' : '#ccc',
                        filter: userLikes.has(comment.COMMENT_ID) ? 'drop-shadow(0 0 8px #7f5af0)' : 'none',
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
                      color: userDislikes.has(comment.COMMENT_ID) ? '#e50914' : '#ccc',
                      background: userDislikes.has(comment.COMMENT_ID) ? 'rgba(229, 9, 20, 0.12)' : 'transparent',
                      border: userDislikes.has(comment.COMMENT_ID) ? '1.5px solid #e50914' : '1.5px solid transparent',
                      borderRadius: '6px',
                    }}
                  >
                    <motion.span
                      whileHover={{
                        scale: 1.3,
                        color: '#e50914',
                        filter: 'drop-shadow(0 0 4px #e50914)'
                      }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        color: userDislikes.has(comment.COMMENT_ID) ? '#e50914' : '#ccc',
                        filter: userDislikes.has(comment.COMMENT_ID) ? 'drop-shadow(0 0 8px #e50914)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <AiFillDislike size={18} />
                    </motion.span>
                    <span style={{ minWidth: '20px' }}>
                      {comment.DISLIKE_COUNT || 0}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(comment.COMMENT_ID)}
                    style={{ ...iconButtonStyle, color: '#7f5af0', border: '1px solid #7f5af0', borderRadius: '6px', background: 'rgba(127,90,240,0.08)' }}
                  >
                    <AiOutlineComment size={18} style={{ marginRight: 4 }} /> Reply
                  </button>
                </div>
              )}
              {/* Reply Box */}
              {replyingTo === comment.COMMENT_ID && (
                <div style={{ marginTop: '15px', marginLeft: '0' }}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#1a1a40',
                      color: '#fff',
                      border: '1.5px solid #7f5af0',
                      borderRadius: '8px',
                      resize: 'none',
                      minHeight: '50px',
                      fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <motion.button
                      onClick={() => handleAddReply(comment.COMMENT_ID)}
                      disabled={!replyText.trim()}
                      whileHover={{ scale: 1.05, boxShadow: '0px 0px 10px #7f5af0' }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '7px 18px',
                        background: !replyText.trim() ? '#533483' : 'linear-gradient(45deg, #7f5af0 0%, #533483 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        cursor: !replyText.trim() ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 2px 8px rgba(127,90,240,0.15)'
                      }}
                    >
                      Reply
                    </motion.button>
                    <motion.button
                      onClick={() => { setReplyingTo(null); setReplyText(''); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '7px 18px',
                        background: '#222',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 2px 8px rgba(127,90,240,0.10)'
                      }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              )}
              {/* Replies (single nested level) */}
              {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <div style={{ marginTop: '18px', marginLeft: '30px', borderLeft: '2px solid #7f5af0', paddingLeft: '18px' }}>
                  {comment.replies.map(reply => (
                    <motion.div
                      key={reply.COMMENT_ID}
                      initial={reply.isTemp ? { opacity: 0, y: -10 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        backgroundColor: reply.isTemp ? '#22224a' : '#1a1a40',
                        border: reply.isTemp ? '2px solid #7f5af0' : '1.5px solid #7f5af0',
                        borderRadius: '10px',
                        padding: '10px',
                        marginBottom: '10px',
                        opacity: reply.isTemp ? 0.8 : 1,
                        fontSize: '0.98em',
                        boxShadow: reply.isTemp ? '0 0 6px 1px #7f5af0' : '0 2px 8px rgba(127,90,240,0.10)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ color: '#7f5af0', fontWeight: 600 }}>{reply.USERNAME || 'Anonymous'}{reply.isTemp && <span style={{ color: '#888', fontSize: '11px' }}> (posting...)</span>}</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {/* Delete for reply */}
                          {(() => { console.log('Reply USER_ID:', reply.USER_ID, 'Current user:', currentUserId); return String(reply.USER_ID) === String(currentUserId) && !reply.isTemp; })() && (
                            <button
                              type="button"
                              onClick={() => handleDelete(reply.COMMENT_ID, true, comment.COMMENT_ID)}
                              disabled={actionLoading.has(reply.COMMENT_ID)}
                              style={{ ...iconButtonStyle, color: actionLoading.has(reply.COMMENT_ID) ? '#555' : '#e50914', background: 'rgba(229, 9, 20, 0.08)', border: '1px solid #e50914', borderRadius: '6px' }}
                            >
                              <motion.span whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 4px #e50914)' }} whileTap={{ scale: 0.9 }}>
                                <AiFillDelete size={15} />
                              </motion.span>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <div style={{ color: '#fff', marginBottom: '6px' }}>{reply.COMMENT_TEXT}</div>
                      {/* Like/Dislike/Reply for reply - all in one row below the reply content */}
                      {!reply.isTemp && (
                        <div style={{
                          display: 'flex',
                          gap: '15px',
                          alignItems: 'center',
                          marginTop: '10px'
                        }}>
                          <button
                            type="button"
                            onClick={() => handleLike(reply.COMMENT_ID)}
                            disabled={actionLoading.has(reply.COMMENT_ID)}
                            style={{
                              ...iconButtonStyle,
                              color: userLikes.has(reply.COMMENT_ID) ? '#7f5af0' : '#ccc',
                              background: userLikes.has(reply.COMMENT_ID) ? 'rgba(127, 90, 240, 0.12)' : 'transparent',
                              border: userLikes.has(reply.COMMENT_ID) ? '1.5px solid #7f5af0' : '1.5px solid transparent',
                              borderRadius: '6px',
                            }}
                          >
                            <motion.span
                              whileHover={{ scale: 1.3, color: '#7f5af0', filter: 'drop-shadow(0 0 4px #7f5af0)' }}
                              whileTap={{ scale: 0.9 }}
                              style={{
                                color: userLikes.has(reply.COMMENT_ID) ? '#7f5af0' : '#ccc',
                                filter: userLikes.has(reply.COMMENT_ID) ? 'drop-shadow(0 0 8px #7f5af0)' : 'none',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <AiFillLike size={16} />
                            </motion.span>
                            <span style={{ minWidth: '16px' }}>{reply.LIKE_COUNT || 0}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDislike(reply.COMMENT_ID)}
                            disabled={actionLoading.has(reply.COMMENT_ID)}
                            style={{
                              ...iconButtonStyle,
                              color: userDislikes.has(reply.COMMENT_ID) ? '#e50914' : '#ccc',
                              background: userDislikes.has(reply.COMMENT_ID) ? 'rgba(229, 9, 20, 0.12)' : 'transparent',
                              border: userDislikes.has(reply.COMMENT_ID) ? '1.5px solid #e50914' : '1.5px solid transparent',
                              borderRadius: '6px',
                            }}
                          >
                            <motion.span
                              whileHover={{ scale: 1.3, color: '#e50914', filter: 'drop-shadow(0 0 4px #e50914)' }}
                              whileTap={{ scale: 0.9 }}
                              style={{
                                color: userDislikes.has(reply.COMMENT_ID) ? '#e50914' : '#ccc',
                                filter: userDislikes.has(reply.COMMENT_ID) ? 'drop-shadow(0 0 8px #e50914)' : 'none',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <AiFillDislike size={16} />
                            </motion.span>
                            <span style={{ minWidth: '16px' }}>{reply.DISLIKE_COUNT || 0}</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    {/* Delete Confirmation Modal */}
    {deleteTarget && (
      <div style={modalOverlayStyle}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          style={modalBoxStyle}
        >
          <h3 style={{ color: '#e50914', marginBottom: '18px', fontWeight: 'bold', fontSize: '1.25rem' }}>Delete Confirmation</h3>
          <div style={{ color: '#fff', marginBottom: '10px', fontSize: '1.08rem' }}>
            Are you sure you want to delete this {deleteTarget.isReply ? 'reply' : 'comment'}?
          </div>
          <div style={modalButtonRow}>
            <button
              onClick={confirmDelete}
              style={{ ...modalButton, background: 'linear-gradient(45deg, #e50914 0%, #7f5af0 100%)', color: '#fff', border: 'none' }}
              disabled={actionLoading.has(deleteTarget.commentId)}
            >
              {actionLoading.has(deleteTarget.commentId) ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={cancelDelete}
              style={{ ...modalButton, background: '#222', color: '#fff', border: '1.5px solid #7f5af0' }}
              disabled={actionLoading.has(deleteTarget.commentId)}
            >
              Cancel
            </button>
          </div>
        </motion.div>
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