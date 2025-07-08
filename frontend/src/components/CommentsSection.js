import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaRegThumbsUp, FaThumbsDown, FaRegThumbsDown, FaReply, FaFlag } from 'react-icons/fa';

function CommentsSection({ selectedEpisode }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [likingComments, setLikingComments] = useState(new Set());
  const [dislikingComments, setDislikingComments] = useState(new Set());

  // Fetch comments when episode is selected
  useEffect(() => {
    if (!selectedEpisode) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingComments(true);
    axios
      .get(`http://localhost:5000/episode/${selectedEpisode.SHOW_EPISODE_ID}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setComments(res.data.comments || []);
        setLoadingComments(false);
      })
      .catch((err) => {
        console.error('Error fetching comments:', err);
        setComments([]);
        setLoadingComments(false);
      });
  }, [selectedEpisode]);

  // Toggle comment like
  const toggleCommentLike = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLikingComments(prev => new Set(prev).add(commentId));

    try {
      const res = await fetch(`http://localhost:5000/comment/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json(); // { user_liked, like_count }

      setComments(prev =>
        prev.map(c =>
          c.COMMENT_ID === commentId
            ? {
                ...c,
                USER_LIKED: data.user_liked,
                LIKE_COUNT: data.like_count,
                USER_DISLIKED: data.user_liked && c.USER_DISLIKED ? false : c.USER_DISLIKED,
                DISLIKE_COUNT: data.user_liked && c.USER_DISLIKED ? c.DISLIKE_COUNT - 1 : c.DISLIKE_COUNT
              }
            : c
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLikingComments(prev => {
        const updated = new Set(prev);
        updated.delete(commentId);
        return updated;
      });
    }
  };

  const toggleCommentDislike = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setDislikingComments(prev => new Set(prev).add(commentId));

    try {
      const res = await fetch(`http://localhost:5000/comment/${commentId}/dislike`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json(); // { user_disliked, dislike_count }

      setComments(prev =>
        prev.map(c =>
          c.COMMENT_ID === commentId
            ? {
                ...c,
                USER_DISLIKED: data.user_disliked,
                DISLIKE_COUNT: data.dislike_count,
                USER_LIKED: data.user_disliked && c.USER_LIKED ? false : c.USER_LIKED,
                LIKE_COUNT: data.user_disliked && c.USER_LIKED ? c.LIKE_COUNT - 1 : c.LIKE_COUNT
              }
            : c
        )
      );
    } catch (err) {
      console.error('Error toggling dislike:', err);
    } finally {
      setDislikingComments(prev => {
        const updated = new Set(prev);
        updated.delete(commentId);
        return updated;
      });
    }
  };

  const handleReply = (commentId) => {
    console.log('Reply clicked for comment', commentId);
    // Add reply UI logic here
  };

  const handleReport = (commentId) => {
    console.log('Report clicked for comment', commentId);
    // Add report modal or backend API logic here
  };

  // Format comment date
  const formatCommentDate = (dateString) => {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Recently';
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setCommentError('You must be logged in to comment.');
      return;
    }

    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }

    if (!selectedEpisode) {
      setCommentError('Please select an episode to comment on.');
      return;
    }

    axios
      .post(
        `http://localhost:5000/episode/${selectedEpisode.SHOW_EPISODE_ID}/comment`,
        { 
          text: newComment,
          parent_id: null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const newCommentData = res.data.comment;
        setComments([newCommentData, ...comments]);
        setNewComment('');
        setCommentError('');
      })
      .catch((err) => {
        console.error('Error posting comment:', err);
        setCommentError('Failed to post comment.');
      });
  };

  return (
    <div style={{ marginTop: '60px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>
        Comments for Episode {selectedEpisode.EPISODE_NUMBER}
      </h2>

      <form onSubmit={handleCommentSubmit} style={{ marginBottom: '30px' }}>
        <textarea
          placeholder="Write your comment here..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '15px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #555',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            resize: 'vertical'
          }}
        ></textarea>
        {commentError && (
          <p style={{ color: 'green', marginTop: '8px' }}>{commentError}</p>
        )}
        <button
          type="submit"
          style={{
            marginTop: '10px',
            backgroundColor: '#e50914',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Post Comment
        </button>
      </form>

      {/* Render Comments */}
      {loadingComments ? (
        <p style={{ color: '#aaa' }}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p style={{ color: '#aaa' }}>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment, index) => (
          <div
            key={comment.COMMENT_ID || `comment-${index}`}
            style={{
              backgroundColor: '#111',
              padding: '15px 20px',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid #333'
            }}
          >
            <p style={{ marginBottom: '8px', color: '#eee' }}>
              <strong>{comment.USER_FIRSTNAME} {comment.USER_LASTNAME}</strong>{' '}
              <span style={{ color: '#777', fontSize: '0.9rem' }}>
                • {formatCommentDate(comment.TIME)}
              </span>
              {comment.EDITED === 1 && (
                <span style={{ color: '#999', fontSize: '0.8rem', marginLeft: '10px' }}>
                  (edited)
                </span>
              )}
            </p>
            <p style={{ color: '#ccc', marginBottom: '10px' }}>{comment.TEXT}</p>
            
            {/* Like + Dislike Buttons (side by side) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Like Button */}
              <button
                onClick={() => toggleCommentLike(comment.COMMENT_ID)}
                disabled={likingComments.has(comment.COMMENT_ID)}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: likingComments.has(comment.COMMENT_ID) ? 'not-allowed' : 'pointer',
                  color: comment.USER_LIKED ? '#e50914' : '#999',
                  fontSize: '0.9rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!likingComments.has(comment.COMMENT_ID)) {
                    e.target.style.backgroundColor = 'rgba(30, 27, 27, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>
                  {comment.USER_LIKED ? <FaThumbsUp /> : <FaRegThumbsUp />}
                </span>
                <span>{comment.LIKE_COUNT || 0}</span>
                {likingComments.has(comment.COMMENT_ID) && (
                  <span style={{ fontSize: '0.8rem' }}>...</span>
                )}
              </button>

              {/* Dislike Button */}
              <button
                onClick={() => toggleCommentDislike(comment.COMMENT_ID)}
                disabled={dislikingComments.has(comment.COMMENT_ID)}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: dislikingComments.has(comment.COMMENT_ID) ? 'not-allowed' : 'pointer',
                  color: comment.USER_DISLIKED ? '#007bff' : '#999',
                  fontSize: '0.9rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!dislikingComments.has(comment.COMMENT_ID)) {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>
                  {comment.USER_DISLIKED ? <FaThumbsDown /> : <FaRegThumbsDown />}
                </span>
                <span>{comment.DISLIKE_COUNT || 0}</span>
                {dislikingComments.has(comment.COMMENT_ID) && (
                  <span style={{ fontSize: '0.8rem' }}>...</span>
                )}
              </button>

              {/* Reply Button */}
              <button
                onClick={() => handleReply(comment.COMMENT_ID)}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  color: '#999',
                  fontSize: '0.9rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}><FaReply /></span>
                <span>Reply</span>
              </button>

              {/* Report Button */}
              <button
                onClick={() => handleReport(comment.COMMENT_ID)}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  color: '#999',
                  fontSize: '0.9rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}><FaFlag /></span>
                <span>Report</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentsSection;