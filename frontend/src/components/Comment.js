import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { AiFillLike, AiFillDislike, AiFillDelete, AiOutlineComment } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { FaFilter } from 'react-icons/fa';
import { FaComments } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import ReactDOM from 'react-dom';

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

// Helper to format time (e.g., '2 hours ago')
function formatTime(timeString) {
  const now = new Date();
  const commentTime = new Date(timeString);
  const diffMs = now - commentTime;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return commentTime.toLocaleDateString();
}

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
  const [openMenu, setOpenMenu] = useState(null); // { type, id }
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortMode, setSortMode] = useState('recent'); // 'recent' or 'liked'
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  // Add state for reply image and preview (per reply box)
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const replyFileInputRef = useRef();

  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const filterRef = useRef();

  // Close filter popup on outside click
  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

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

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Add parent comment
  const handleAddComment = async () => {
    if (!newComment.trim() && !selectedImage) return;
    let imgLink = null;
    let tempImgPreview = imagePreview;
    if (selectedImage) {
      // Upload image to backend
      const formData = new FormData();
      formData.append('image', selectedImage);
      try {
        const res = await axios.post('http://localhost:5000/comments/upload-image', formData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        });
        imgLink = res.data.imgLink;
      } catch (err) {
        console.error('Error uploading image:', err);
        imgLink = null;
      }
    }
    const tempComment = {
      COMMENT_ID: `temp-${Date.now()}`,
      COMMENT_TEXT: newComment,
      USERNAME: 'You',
      USER_ID: currentUserId,
      LIKE_COUNT: 0,
      DISLIKE_COUNT: 0,
      isTemp: true,
      replies: [],
      IMG_LINK: tempImgPreview || imgLink,
    };
    setComments(prev => [tempComment, ...prev]);
    setNewComment('');
    setSelectedImage(null);
    setImagePreview(null);
    try {
      const res = await axios.post(
        `http://localhost:5000/comments`,
        { episode_id: episodeId, comment_text: newComment, img_link: imgLink },
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

  // Handle reply image selection
  const handleReplyImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplyImage(file);
      setReplyImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected reply image
  const handleRemoveReplyImage = () => {
    setReplyImage(null);
    setReplyImagePreview(null);
    if (replyFileInputRef.current) replyFileInputRef.current.value = '';
  };

  // Add reply to a parent comment (with image support)
  const handleAddReply = async (parentId) => {
    if (!replyText.trim() && !replyImage) return;
    let imgLink = null;
    let tempImgPreview = replyImagePreview;
    if (replyImage) {
      // Upload image to backend
      const formData = new FormData();
      formData.append('image', replyImage);
      try {
        const res = await axios.post('http://localhost:5000/comments/upload-image', formData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        });
        imgLink = res.data.imgLink;
      } catch (err) {
        console.error('Error uploading reply image:', err);
        imgLink = null;
      }
    }
    const tempReply = {
      COMMENT_ID: `temp-reply-${Date.now()}`,
      COMMENT_TEXT: replyText,
      USERNAME: 'You',
      USER_ID: currentUserId,
      LIKE_COUNT: 0,
      DISLIKE_COUNT: 0,
      isTemp: true,
      PARENT_ID: parentId,
      IMG_LINK: tempImgPreview || imgLink,
    };
    setComments(prev => prev.map(parent =>
      parent.COMMENT_ID === parentId
        ? { ...parent, replies: [...(parent.replies || []), tempReply] }
        : parent
    ));
    setReplyText('');
    setReplyImage(null);
    setReplyImagePreview(null);
    setReplyingTo(null);
    try {
      const res = await axios.post(
        `http://localhost:5000/comments`,
        { episode_id: episodeId, comment_text: tempReply.COMMENT_TEXT, parent_id: parentId, img_link: imgLink },
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
    const { commentId } = deleteTarget;
    setActionLoading(prev => new Set([...prev, commentId]));

    try {
      await axios.delete(`http://localhost:5000/comments/${commentId}`, { headers });
      // After deletion, always fetch latest comments and user interactions from backend
      await fetchComments();
      await fetchUserInteractions();
    } catch (err) {
      console.error('Error deleting comment:', err);
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

  

  // Add a ref for the menu to handle outside click
  const menuRef = useRef();

  // Close menu on click outside
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    if (openMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenu]);

  // Sort comments and replies by time (most recent first)
  const sortedComments = [...comments].sort((a, b) => {
    if (sortMode === 'liked') {
      return (b.LIKE_COUNT || 0) - (a.LIKE_COUNT || 0) || new Date(b.TIME) - new Date(a.TIME);
    }
    // Default: most recent
    return new Date(b.TIME) - new Date(a.TIME);
  });

  return (
    <div style={{ padding: '20px', color: '#fff', background: 'rgba(22, 33, 62, 0.85)', borderRadius: '15px', border: '1px solid #533483', boxShadow: '0 8px 25px rgba(22, 33, 62, 0.3)', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', textAlign: 'center', textShadow: '1px 1px 2px #533483', fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '30px' }}>Comments</h2>
      {/* Add Comment Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 4,
              padding: 6,
              marginLeft: 4,
              boxShadow: selectedImage ? '0 0 8px 2px #a259ff' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'box-shadow 0.2s',
            }}
            title="Add image"
          >
            <FaImage size={22} color={selectedImage ? '#a259ff' : '#aaa'} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        {imagePreview && (
          <div style={{ margin: '10px 0 0 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, border: '1.5px solid #7f5af0' }} />
            <button onClick={handleRemoveImage} style={{ color: '#e50914', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>Remove</button>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <motion.button
            onClick={handleAddComment}
            disabled={!newComment.trim() && !selectedImage}
            whileHover={{
              scale: 1.05,
              boxShadow: '0px 0px 10px #7f5af0',
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '10px 22px',
              background: !newComment.trim() && !selectedImage
                ? '#533483'
                : 'linear-gradient(45deg, #533483 0%, #16213e 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: !newComment.trim() && !selectedImage ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(22,33,62,0.2)'
            }}
          >
            Post Comment
          </motion.button>
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <motion.button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                outline: filterOpen ? '2px solid #a259ff' : 'none',
                borderRadius: 4,
                padding: 2,
                boxShadow: filterOpen ? '0 0 8px 2px #a259ff' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              whileHover={{
                boxShadow: '0 0 8px 2px #a259ff',
                filter: 'drop-shadow(0 0 6px #a259ff)'
              }}
              onClick={() => setFilterOpen(v => !v)}
              aria-label="Filter comments"
            >
              <FaFilter size={18} color="#a259ff" />
            </motion.button>
            {filterOpen && (
              <div
                ref={filterRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#222',
                  color: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                  zIndex: 100,
                  minWidth: 120,
                  padding: 8,
                  marginTop: 6,
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    background: sortMode === 'liked' ? '#a259ff22' : 'none',
                    borderRadius: 6,
                    marginBottom: 2,
                  }}
                  onClick={() => {
                    setSortMode('liked');
                    setFilterOpen(false);
                  }}
                >
                  Most Liked
                </div>
                <div
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    background: sortMode === 'recent' ? '#a259ff22' : 'none',
                    borderRadius: 6,
                  }}
                  onClick={() => {
                    setSortMode('recent');
                    setFilterOpen(false);
                  }}
                >
                  Most Recent
                </div>
              </div>
            )}
          </div>
        </div>
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
          {sortedComments.map((comment) => (
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
                marginBottom: '10px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Profile Picture */}
                  <img
                    src={
                      !comment.DELETED
                        ? (comment.PROFILE_PICTURE
                            ? `http://localhost:5000/images/user/${comment.PROFILE_PICTURE}`
                            : 'http://localhost:5000/images/user/default-user.jpg')
                        : undefined
                    }
                    alt="Profile"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: 8,
                      border: '2px solid #7f5af0',
                      background: '#222',
                      display: comment.DELETED ? 'none' : 'block',
                    }}
                  />
                  <strong style={{ color: '#7f5af0' }}>
                    {comment.DELETED ? '[USER]' : (comment.USERNAME || 'Anonymous')}
                    {comment.isTemp && <span style={{ color: '#888', fontSize: '12px' }}> (posting...)</span>}
                  </strong>
                  <span className="comment-time" style={{ marginLeft: 10, color: '#aaa', fontSize: '0.95em' }}>
                    {formatTime(comment.TIME)}
                  </span>
                </div>
                {/* Three dots menu button for comment */}
                {!comment.DELETED && (
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    aria-label="More options"
                    onClick={() => setOpenMenu(openMenu && openMenu.type === 'comment' && openMenu.id === comment.COMMENT_ID ? null : { type: 'comment', id: comment.COMMENT_ID })}
                    style={{
                      background: openMenu && openMenu.type === 'comment' && openMenu.id === comment.COMMENT_ID ? 'rgba(127,90,240,0.15)' : 'none',
                      border: 'none',
                      color: '#aaa',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: '50%',
                      transition: 'background 0.2s, box-shadow 0.2s',
                      outline: 'none',
                      boxShadow: openMenu && openMenu.type === 'comment' && openMenu.id === comment.COMMENT_ID ? '0 0 8px 2px #7f5af0' : '0 0 0 0 #000',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 8px 2px #7f5af0'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = openMenu && openMenu.type === 'comment' && openMenu.id === comment.COMMENT_ID ? '0 0 8px 2px #7f5af0' : '0 0 0 0 #000'}
                  >
                    &#8942;
                  </button>
                  {openMenu && openMenu.type === 'comment' && openMenu.id === comment.COMMENT_ID && (
                    <div ref={menuRef} style={{
                      position: 'absolute',
                      top: 0,
                      left: 'calc(100% + 8px)',
                      background: '#22224a',
                      border: '1.5px solid #7f5af0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 12px rgba(127,90,240,0.15)',
                      zIndex: 10,
                      minWidth: '110px',
                      padding: '6px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                    }}>
                      {String(comment.USER_ID) === String(currentUserId) && !comment.isTemp ? (
                        <>
                          <button
                            type="button"
                            onClick={() => { setOpenMenu(null); /* implement edit later */ }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#7f5af0',
                              fontWeight: 600,
                              width: '100%',
                              padding: '10px 16px',
                              cursor: 'pointer',
                              fontSize: '15px',
                              textAlign: 'left',
                              borderRadius: '6px',
                              transition: 'background 0.2s',
                              marginBottom: '2px',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => { setOpenMenu(null); handleDelete(comment.COMMENT_ID, false, null); }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#e50914',
                              fontWeight: 600,
                              width: '100%',
                              padding: '10px 16px',
                              cursor: 'pointer',
                              fontSize: '15px',
                              textAlign: 'left',
                              borderRadius: '6px',
                              transition: 'background 0.2s',
                            }}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setOpenMenu(null); /* implement report later */ }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ffb300',
                            fontWeight: 600,
                            width: '100%',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            textAlign: 'left',
                            borderRadius: '6px',
                            transition: 'background 0.2s',
                          }}
                        >
                          Report
                        </button>
                      )}
                    </div>
                  )}
                </div>
                )}
              </div>
              {/* Comment Content */}
              <p style={{
                margin: '10px 0',
                lineHeight: '1.5',
                wordBreak: 'break-word',
                color: '#fff'
              }}>
                {comment.DELETED ? '[DELETED]' : comment.COMMENT_TEXT}
              </p>
              {/* Show image in comment if exists */}
              {comment.IMG_LINK && (
                <div style={{ margin: '10px 0' }}>
                  <img src={`http://localhost:5000${comment.IMG_LINK}`} alt="Comment" style={{ maxWidth: 220, maxHeight: 180, borderRadius: 8, border: '1.5px solid #7f5af0' }} />
                </div>
              )}
              {/* Like/Dislike Buttons + Reply Button */}
              {!comment.isTemp && !comment.DELETED && (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                    <button
                      type="button"
                      onClick={() => replyFileInputRef.current && replyFileInputRef.current.click()}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 4,
                        padding: 6,
                        marginLeft: 4,
                        boxShadow: replyImage ? '0 0 8px 2px #a259ff' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'box-shadow 0.2s',
                      }}
                      title="Add image"
                    >
                      <FaImage size={20} color={replyImage ? '#a259ff' : '#aaa'} />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={replyFileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleReplyImageChange}
                    />
                  </div>
                  {replyImagePreview && (
                    <div style={{ margin: '10px 0 0 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={replyImagePreview} alt="Preview" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 8, border: '1.5px solid #7f5af0' }} />
                      <button onClick={handleRemoveReplyImage} style={{ color: '#e50914', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Remove</button>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <motion.button
                      onClick={() => handleAddReply(comment.COMMENT_ID)}
                      disabled={!replyText.trim() && !replyImage}
                      whileHover={{ scale: 1.05, boxShadow: '0px 0px 10px #7f5af0' }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '7px 18px',
                        background: !replyText.trim() && !replyImage ? '#533483' : 'linear-gradient(45deg, #7f5af0 0%, #533483 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        cursor: !replyText.trim() && !replyImage ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 2px 8px rgba(127,90,240,0.15)'
                      }}
                    >
                      Reply
                    </motion.button>
                    <motion.button
                      onClick={() => { setReplyingTo(null); setReplyText(''); handleRemoveReplyImage(); }}
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
                        backgroundColor: comment.isTemp ? '#1a1a40' : '#16213e', // match parent
                        border: comment.isTemp ? '2px solid #7f5af0' : '1.5px solid #533483', // match parent
                        borderRadius: '10px',
                        padding: '10px',
                        marginBottom: '10px',
                        opacity: reply.isTemp ? 0.8 : 1,
                        fontSize: '0.98em',
                        boxShadow: reply.isTemp ? '0 0 6px 1px #7f5af0' : '0 2px 8px rgba(127,90,240,0.10)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {/* Profile Picture for reply */}
                          <img
                            src={
                              !reply.DELETED
                                ? (reply.PROFILE_PICTURE
                                    ? (reply.PROFILE_PICTURE.startsWith('/images/user/')
                                        ? `http://localhost:5000${reply.PROFILE_PICTURE}`
                                        : `http://localhost:5000/images/user/${reply.PROFILE_PICTURE}`)
                                    : 'http://localhost:5000/images/user/default-user.jpg')
                                : undefined
                            }
                            alt="Profile"
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              marginRight: 8,
                              border: '2px solid #7f5af0',
                              background: '#222',
                              display: reply.DELETED ? 'none' : 'block',
                            }}
                          />
                          <span style={{ color: '#7f5af0', fontWeight: 600 }}>
                            {reply.DELETED ? '[USER]' : (reply.USERNAME || 'Anonymous')}{reply.isTemp && <span style={{ color: '#888', fontSize: '11px' }}> (posting...)</span>}
                          </span>
                          <span className="comment-time" style={{ marginLeft: 10, color: '#aaa', fontSize: '0.95em' }}>
                            {formatTime(reply.TIME)}
                          </span>
                        </div>
                        {/* Three dots menu button for reply */}
                        {!reply.DELETED && (
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            aria-label="More options"
                            onClick={() => setOpenMenu(openMenu && openMenu.type === 'reply' && openMenu.id === reply.COMMENT_ID ? null : { type: 'reply', id: reply.COMMENT_ID })}
                            style={{
                              background: openMenu && openMenu.type === 'reply' && openMenu.id === reply.COMMENT_ID ? 'rgba(127,90,240,0.15)' : 'none',
                              border: 'none',
                              color: '#aaa',
                              fontSize: '18px',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              borderRadius: '50%',
                              transition: 'background 0.2s, box-shadow 0.2s',
                              outline: 'none',
                              boxShadow: openMenu && openMenu.type === 'reply' && openMenu.id === reply.COMMENT_ID ? '0 0 8px 2px #7f5af0' : '0 0 0 0 #000',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 8px 2px #7f5af0'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = openMenu && openMenu.type === 'reply' && openMenu.id === reply.COMMENT_ID ? '0 0 8px 2px #7f5af0' : '0 0 0 0 #000'}
                          >
                            &#8942;
                          </button>
                          {openMenu && openMenu.type === 'reply' && openMenu.id === reply.COMMENT_ID && (
                            <div ref={menuRef} style={{
                              position: 'absolute',
                              top: 0,
                              left: 'calc(100% + 8px)',
                              background: '#22224a',
                              border: '1.5px solid #7f5af0',
                              borderRadius: '8px',
                              boxShadow: '0 2px 12px rgba(127,90,240,0.15)',
                              zIndex: 10,
                              minWidth: '110px',
                              padding: '6px 0',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'stretch',
                            }}>
                              {String(reply.USER_ID) === String(currentUserId) && !reply.isTemp ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => { setOpenMenu(null); /* implement edit later */ }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#7f5af0',
                                      fontWeight: 600,
                                      width: '100%',
                                      padding: '10px 16px',
                                      cursor: 'pointer',
                                      fontSize: '15px',
                                      textAlign: 'left',
                                      borderRadius: '6px',
                                      transition: 'background 0.2s',
                                      marginBottom: '2px',
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setOpenMenu(null); handleDelete(reply.COMMENT_ID, true, comment.COMMENT_ID); }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#e50914',
                                      fontWeight: 600,
                                      width: '100%',
                                      padding: '10px 16px',
                                      cursor: 'pointer',
                                      fontSize: '15px',
                                      textAlign: 'left',
                                      borderRadius: '6px',
                                      transition: 'background 0.2s',
                                    }}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => { setOpenMenu(null); /* implement report later */ }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ffb300',
                                    fontWeight: 600,
                                    width: '100%',
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    textAlign: 'left',
                                    borderRadius: '6px',
                                    transition: 'background 0.2s',
                                  }}
                                >
                                  Report
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        )}
                      </div>
                      <div style={{ color: reply.DELETED ? '#888' : '#fff', marginBottom: '6px' }}>{reply.DELETED ? '[DELETED]' : reply.COMMENT_TEXT}</div>
                      {/* Like/Dislike/Reply for reply - all in one row below the reply content */}
                      {!reply.isTemp && !reply.DELETED && (
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
                      {/* In the reply display, show image if present */}
                      {reply.IMG_LINK && (
                        <div style={{ margin: '8px 0' }}>
                          <img src={`http://localhost:5000${reply.IMG_LINK}`} alt="Reply" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, border: '1.5px solid #7f5af0' }} />
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
   {deleteTarget && ReactDOM.createPortal(
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(22, 33, 62, 0.65)',
      backdropFilter: 'blur(4px)',
    }}
    onClick={cancelDelete} // Click outside to close
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal
      style={{
        ...modalBoxStyle,
        position: 'relative',
        margin: 0,
        zIndex: 2100,
        maxWidth: '90vw',
        maxHeight: '90vh',
      }}
    >
      <h3 style={{ 
        color: '#e50914', 
        marginBottom: '18px', 
        fontWeight: 'bold', 
        fontSize: '1.25rem' 
      }}>
        Delete Confirmation
      </h3>
      <div style={{ 
        color: '#fff', 
        marginBottom: '10px', 
        fontSize: '1.08rem' 
      }}>
        Are you sure you want to delete this {deleteTarget.isReply ? 'reply' : 'comment'}?
      </div>
      <div style={modalButtonRow}>
        <button
          onClick={confirmDelete}
          style={{ 
            ...modalButton, 
            background: 'linear-gradient(45deg, #e50914 0%, #7f5af0 100%)', 
            color: '#fff', 
            border: 'none' 
          }}
          disabled={actionLoading.has(deleteTarget.commentId)}
        >
          {actionLoading.has(deleteTarget.commentId) ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={cancelDelete}
          style={{ 
            ...modalButton, 
            background: '#222', 
            color: '#fff', 
            border: '1.5px solid #7f5af0' 
          }}
          disabled={actionLoading.has(deleteTarget.commentId)}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </div>,
  document.body
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