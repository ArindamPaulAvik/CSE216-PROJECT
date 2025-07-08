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
  const [visibleReplies, setVisibleReplies] = useState(new Set());
  const [repliesMap, setRepliesMap] = useState({}); // commentId => [replies]
  const [repliesPagination, setRepliesPagination] = useState({}); // commentId => { page, hasMore }
  const [activeReplyBoxes, setActiveReplyBoxes] = useState(new Set());
  const [replyTexts, setReplyTexts] = useState({});



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
  
  const toggleRepliesVisibility = async (commentId) => {
    const isVisible = visibleReplies.has(commentId);
    const updated = new Set(visibleReplies);

    if (isVisible) {
      updated.delete(commentId);
      setVisibleReplies(updated);
    } else {
      // First time: fetch page 1 of replies
      if (!repliesMap[commentId]) {
        await fetchReplies(commentId, 1);
      }
      updated.add(commentId);
      setVisibleReplies(updated);
    }
  };

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

    const data = await res.json(); // { user_liked, user_disliked, like_count, dislike_count }

    // Update top-level comments
    setComments(prev =>
      prev.map(c =>
        c.COMMENT_ID === commentId
          ? {
              ...c,
              USER_LIKED: data.user_liked,
              USER_DISLIKED: data.user_disliked,
              LIKE_COUNT: data.like_count,
              DISLIKE_COUNT: data.dislike_count
            }
          : c
      )
    );

    // Update replies in repliesMap
    setRepliesMap(prev => {
      const updatedMap = { ...prev };
      for (const parentId in updatedMap) {
        updatedMap[parentId] = updatedMap[parentId].map(reply => {
          if (reply.COMMENT_ID === commentId) {
            return {
              ...reply,
              USER_LIKED: data.user_liked,
              USER_DISLIKED: data.user_disliked,
              LIKE_COUNT: data.like_count,
              DISLIKE_COUNT: data.dislike_count
            };
          }
          return reply;
        });
      }
      return updatedMap;
    });

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



  const fetchReplies = async (parentId, page = 1) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await axios.get(`http://localhost:5000/comment/${parentId}/replies?page=${page}&limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { replies, pagination } = res.data;

    // Sort replies by time (oldest first)
    const sortedReplies = replies.sort((a, b) => {
      const timeA = new Date(a.TIME || 0).getTime();
      const timeB = new Date(b.TIME || 0).getTime();
      return timeA - timeB; // oldest first
    });

    setRepliesMap((prev) => {
      const existingReplies = prev[parentId] || [];
      const newReplies = page === 1 ? sortedReplies : [...existingReplies, ...sortedReplies];
      
      // Sort the combined array to maintain chronological order
      const finalSortedReplies = newReplies.sort((a, b) => {
        const timeA = new Date(a.TIME || 0).getTime();
        const timeB = new Date(b.TIME || 0).getTime();
        return timeA - timeB; // oldest first
      });

      return {
        ...prev,
        [parentId]: finalSortedReplies,
      };
    });

    setRepliesPagination((prev) => ({
      ...prev,
      [parentId]: {
        page: pagination.currentPage,
        hasMore: pagination.hasMore
      }
    }));
  } catch (err) {
    console.error('Error fetching replies:', err);
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
    
    const data = await res.json(); // { user_liked, user_disliked, like_count, dislike_count }

    // Update top-level comments
    setComments(prev =>
      prev.map(c =>
        c.COMMENT_ID === commentId
          ? {
              ...c,
              USER_LIKED: data.user_liked,
              USER_DISLIKED: data.user_disliked,
              LIKE_COUNT: data.like_count,
              DISLIKE_COUNT: data.dislike_count
            }
          : c
      )
    );

    // Update replies in repliesMap
    setRepliesMap(prev => {
      const updatedMap = { ...prev };
      for (const parentId in updatedMap) {
        updatedMap[parentId] = updatedMap[parentId].map(reply => {
          if (reply.COMMENT_ID === commentId) {
            return {
              ...reply,
              USER_LIKED: data.user_liked,
              USER_DISLIKED: data.user_disliked,
              LIKE_COUNT: data.like_count,
              DISLIKE_COUNT: data.dislike_count
            };
          }
          return reply;
        });
      }
      return updatedMap;
    });

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
    setActiveReplyBoxes(prev => {
      const updated = new Set(prev);
      if (updated.has(commentId)) {
        updated.delete(commentId);
      } else {
        updated.add(commentId);
      }
      return updated;
    });
  };

  const handleReplyTextChange = (commentId, text) => {
    setReplyTexts(prev => ({
      ...prev,
      [commentId]: text
    }));
  };

  const handleReplySubmit = async (parentId) => {
  const token = localStorage.getItem('token');
  const text = replyTexts[parentId];
  if (!token || !text?.trim()) return;

  try {
    const res = await axios.post(
      `http://localhost:5000/episode/${selectedEpisode.SHOW_EPISODE_ID}/comment`,
      {
        text,
        parent_id: parentId
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const newReply = res.data.comment;

    // Update replies map - insert in chronological order
    setRepliesMap(prev => {
      const existingReplies = prev[parentId] || [];
      const updatedReplies = [...existingReplies, newReply];
      
      // Sort to maintain chronological order (oldest first)
      const sortedReplies = updatedReplies.sort((a, b) => {
        const timeA = new Date(a.TIME || 0).getTime();
        const timeB = new Date(b.TIME || 0).getTime();
        return timeA - timeB; // oldest first
      });

      return {
        ...prev,
        [parentId]: sortedReplies
      };
    });

    // Clear reply input
    setReplyTexts(prev => ({ ...prev, [parentId]: '' }));
    setActiveReplyBoxes(prev => {
      const updated = new Set(prev);
      updated.delete(parentId);
      return updated;
    });

    // Ensure replies are shown
    setVisibleReplies(prev => new Set(prev).add(parentId));
  } catch (err) {
    console.error('Error posting reply:', err);
  }
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
      border: '1px solid #333',
    }}
  >
    {/* Comment header */}
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

    {/* Comment text */}
    <p style={{ color: '#ccc', marginBottom: '10px' }}>{comment.TEXT}</p>

    {/* Comment action buttons: Like, Dislike, Reply, Report */}
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
          transition: 'all 0.2s ease',
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
        {likingComments.has(comment.COMMENT_ID) && <span style={{ fontSize: '0.8rem' }}>...</span>}
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
          transition: 'all 0.2s ease',
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
        {dislikingComments.has(comment.COMMENT_ID) && <span style={{ fontSize: '0.8rem' }}>...</span>}
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

    {activeReplyBoxes.has(comment.COMMENT_ID) && (
  <div style={{ marginTop: '10px' }}>
    <textarea
      value={replyTexts[comment.COMMENT_ID] || ''}
      onChange={(e) => handleReplyTextChange(comment.COMMENT_ID, e.target.value)}
      placeholder="Write your reply..."
      style={{
        width: '100%',
        minHeight: '60px',
        padding: '10px',
        fontSize: '0.95rem',
        borderRadius: '6px',
        border: '1px solid #555',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        resize: 'vertical',
        marginBottom: '10px'
      }}
    ></textarea>
    <button
      onClick={() => handleReplySubmit(comment.COMMENT_ID)}
      style={{
        backgroundColor: '#e50914',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      Send Reply
    </button>
  </div>
)}


    {/* View/Hide Replies Toggle */}
    <div style={{ marginTop: '12px' }}>
      <button
        onClick={() => toggleRepliesVisibility(comment.COMMENT_ID)}
        style={{
          background: 'none',
          border: 'none',
          color: '#e50914',
          fontSize: '1.1rem',       // bigger font size
          padding: '8px 16px',      // bigger padding
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.textShadow = '0 0 8px #e50914, 0 0 12px #e50914';
        }}
        onMouseLeave={(e) => {
          e.target.style.textShadow = 'none';
        }}
      >
        {visibleReplies.has(comment.COMMENT_ID) ? 'Hide replies' : 'View replies'}
      </button>
    </div>

    {/* Render Replies (if any) */}
    {visibleReplies.has(comment.COMMENT_ID) && (
      <div style={{ marginTop: '12px', paddingLeft: '20px', borderLeft: '2px solid #444' }}>
        {(repliesMap[comment.COMMENT_ID] || []).map((reply) => (
          <div
            key={reply.COMMENT_ID}
            style={{
              backgroundColor: '#1c1c1c',
              padding: '10px 15px',
              marginBottom: '10px',
              borderRadius: '6px',
              border: '1px solid #333',
            }}
          >
            <p style={{ marginBottom: '5px', color: '#eee' }}>
              <strong>{reply.USER_FIRSTNAME} {reply.USER_LASTNAME}</strong>{' '}
              <span style={{ color: '#777', fontSize: '0.85rem' }}>
                • {formatCommentDate(reply.TIME)}
              </span>
              {reply.EDITED === 1 && (
                <span style={{ color: '#999', fontSize: '0.75rem', marginLeft: '8px' }}>(edited)</span>
              )}
            </p>

            <p style={{ color: '#ccc', marginBottom: '10px' }}>{reply.TEXT}</p>

            {/* Reply buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Like */}
              <button
                onClick={() => toggleCommentLike(reply.COMMENT_ID)}
                disabled={likingComments.has(reply.COMMENT_ID)}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: likingComments.has(reply.COMMENT_ID) ? 'not-allowed' : 'pointer',
                  color: reply.USER_LIKED ? '#e50914' : '#999',
                  fontSize: '0.9rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!likingComments.has(reply.COMMENT_ID)) {
                    e.target.style.backgroundColor = 'rgba(30, 27, 27, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>
                  {reply.USER_LIKED ? <FaThumbsUp /> : <FaRegThumbsUp />}
                </span>
                <span>{reply.LIKE_COUNT || 0}</span>
                {likingComments.has(reply.COMMENT_ID) && <span style={{ fontSize: '0.8rem' }}>...</span>}
              </button>

              {/* Dislike */}
              <button
                onClick={() => toggleCommentDislike(reply.COMMENT_ID)}
                disabled={likingComments.has(reply.COMMENT_ID)}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: dislikingComments.has(reply.COMMENT_ID) ? 'not-allowed' : 'pointer',
                  color: reply.USER_DISLIKED ? '#007bff' : '#999',
                  fontSize: '0.9rem',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!dislikingComments.has(reply.COMMENT_ID)) {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>
                  {reply.USER_DISLIKED ? <FaThumbsDown /> : <FaRegThumbsDown />}
                </span>
                <span>{reply.DISLIKE_COUNT || 0}</span>
                {dislikingComments.has(reply.COMMENT_ID) && <span style={{ fontSize: '0.8rem' }}>...</span>}
              </button>

              {/* Reply */}
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

              {/* Report */}
              <button
                onClick={() => handleReport(reply.COMMENT_ID)}
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
        ))}
      </div>
    )}
  </div>
))
      )}
    </div>
  );
}

export default CommentsSection;