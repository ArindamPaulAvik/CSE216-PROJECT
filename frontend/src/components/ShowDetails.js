import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import { FaThumbsUp, FaRegThumbsUp, FaThumbsDown, FaRegThumbsDown } from 'react-icons/fa';

function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [likingComments, setLikingComments] = useState(new Set());
  const [dislikingComments, setDislikingComments] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const videoRef = useRef(null);

  // Fetch current favorite status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`http://localhost:5000/favorite/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsFavorite(res.data.favorite);
      })
      .catch((err) => {
        console.warn('Could not check favorite status.');
        setIsFavorite(false);
      });
  }, [id]);

  // Fetch show details and episodes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/login';
      return;
    }

    // Fetch show details
    axios
      .get(`http://localhost:5000/show/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setShow(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error('Error fetching show details:', err);
          setError('Could not fetch show details.');
          setLoading(false);
        }
      });

    // Fetch episodes for this show
    axios
      .get(`http://localhost:5000/show/${id}/episodes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEpisodes(res.data);
        // Auto-select first episode if available
        if (res.data.length > 0) {
          setSelectedEpisode(res.data[0]);
        }
      })
      .catch((err) => {
        console.error('Error fetching episodes:', err);
      });
  }, [id]);

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

  // Video player functions
  const playEpisode = (episode) => {
    setSelectedEpisode(episode);
    setShowVideoPlayer(true);
    setIsPlaying(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Video event handlers
  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);
  const handleVideoEnded = () => {
    setIsPlaying(false);
    // Auto-play next episode if available
    const currentIndex = episodes.findIndex(ep => ep.SHOW_EPISODE_ID === selectedEpisode.SHOW_EPISODE_ID);
    if (currentIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentIndex + 1];
      setTimeout(() => {
        playEpisode(nextEpisode);
      }, 2000);
    }
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .post(
        `http://localhost:5000/favorite/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setIsFavorite(res.data.favorite);
      })
      .catch((err) => {
        console.error('Failed to toggle favorite:', err);
      });
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

    const data = await res.json(); // { user_liked, like_count }

    // ✅ Update both like and dislike states
    setComments(prev =>
      prev.map(c =>
        c.COMMENT_ID === commentId
          ? {
              ...c,
              USER_LIKED: data.user_liked,
              LIKE_COUNT: data.like_count,
              USER_DISLIKED: data.user_liked ? false : c.USER_DISLIKED,
              DISLIKE_COUNT: data.user_liked ? c.DISLIKE_COUNT - 1 : c.DISLIKE_COUNT
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

    // ✅ Update both dislike and like states
    setComments(prev =>
      prev.map(c =>
        c.COMMENT_ID === commentId
          ? {
              ...c,
              USER_DISLIKED: data.user_disliked,
              DISLIKE_COUNT: data.dislike_count,
              USER_LIKED: data.user_disliked ? false : c.USER_LIKED,
              LIKE_COUNT: data.user_disliked ? c.LIKE_COUNT - 1 : c.LIKE_COUNT
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


  // Format duration properly
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <Layout>
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: '#fff',
            fontSize: '1.2rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #333',
              borderTop: '4px solid #e50914',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Loading...
          </div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#e50914',
            fontSize: '1.2rem',
            padding: '40px',
            background: 'rgba(229, 9, 20, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(229, 9, 20, 0.3)'
          }}>
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  if (!show) return null;

  return (
    <Layout>
      <div style={{
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
        minHeight: '100vh',
        paddingBottom: '60px'
      }}>
        {/* Video Player Modal */}
        {showVideoPlayer && selectedEpisode && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'relative',
              width: '90%',
              maxWidth: '1200px',
              backgroundColor: '#000',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {/* Video Player Header */}
              <div style={{
                padding: '15px 20px',
                backgroundColor: '#1a1a1a',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #333'
              }}>
                <h3 style={{ color: '#fff', margin: 0 }}>
                  Episode {selectedEpisode.EPISODE_NUMBER}: {selectedEpisode.SHOW_EPISODE_TITLE}
                </h3>
                <button
                  onClick={closeVideoPlayer}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '5px 10px'
                  }}
                >
                  ✕
                </button>
              </div>
              
              {/* Video Element */}
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh'
                }}
                controls
                autoPlay
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                src={`/movies/${selectedEpisode.VIDEO_URL}`}
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Video Controls Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '60px',
                left: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '10px 15px',
                borderRadius: '6px',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0'}>
                <button
                  onClick={togglePlayPause}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <span style={{ fontSize: '0.9rem' }}>
                  {formatDuration(selectedEpisode.SHOW_EPISODE_DURATION)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section with Background */}
        <div style={{
          position: 'relative',
          height: '70vh',
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(/showS/${show.THUMBNAIL}) center/cover`,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 60px 60px'
        }}>
          <div style={{
            maxWidth: '800px',
            color: '#fff'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '-1px'
            }}>
              {show.TITLE}
            </h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '25px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(229, 9, 20, 0.9)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>
                <span>⭐</span>
                <span>{show.RATING}/10</span>
              </div>
              
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '500',
                backdropFilter: 'blur(10px)'
              }}>
                {formatDuration(show.DURATION)}
              </span>
              
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '500',
                backdropFilter: 'blur(10px)'
              }}>
                {show.RELEASE_DATE?.slice(0, 4)}
              </span>
              
              {show.AGE_RESTRICTION_NAME && (
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  {show.AGE_RESTRICTION_NAME}
                </span>
              )}
            </div>

            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '30px',
              maxWidth: '600px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              {show.DESCRIPTION}
            </p>

            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => episodes.length > 0 && playEpisode(episodes[0])}
                style={{
                  background: 'linear-gradient(45deg, #fff 0%, #f0f0f0 100%)',
                  color: '#000',
                  border: 'none',
                  padding: '15px 35px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                }}
              >
                <span>▶️</span>
                Play
              </button>

              {isFavorite !== null && (
                <button
                  onClick={toggleFavorite}
                  style={{
                    background: 'rgba(42, 42, 42, 0.8)',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.3)',
                    padding: '13px 30px',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(42, 42, 42, 0.8)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>
                    {isFavorite ? '❤️' : '🤍'}
                  </span>
                  {isFavorite ? 'Remove from List' : 'Add to List'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{
          padding: '40px 60px',
          maxWidth: '1200px',
          margin: '0 auto',
          color: '#fff'
        }}>
          {/* Show Information */}
          <div style={{
            marginBottom: '40px',
            lineHeight: '1.8'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '30px',
              color: '#fff'
            }}>
              Show Information
            </h2>

            <div style={{
              fontSize: '1.1rem',
              color: '#ccc'
            }}>
              <p style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#fff' }}>Category:</strong> {show.CATEGORY_NAME || 'N/A'}
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#fff' }}>Genre:</strong> {show.GENRES || 'N/A'}
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#fff' }}>Duration:</strong> {formatDuration(show.DURATION)}
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#fff' }}>Release Date:</strong> {formatReleaseDate(show.RELEASE_DATE)}
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#fff' }}>Publisher:</strong> {show.PUBLISHER_NAME || 'N/A'}
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#fff' }}>Rating:</strong> {show.RATING}/10
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#fff' }}>Age Rating:</strong> {show.AGE_RESTRICTION_NAME || 'N/A'}
              </p>
              
              {show.SEASON_COUNT > 0 && (
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#fff' }}>Seasons:</strong> {show.SEASON_COUNT}
                </p>
              )}
            </div>

            {/* Episodes Section */}
            {episodes.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>
                  Episodes
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '15px',
                  marginBottom: '30px'
                }}>
                  {episodes.map((episode) => (
                    <div
                      key={episode.SHOW_EPISODE_ID}
                      style={{
                        backgroundColor: selectedEpisode?.SHOW_EPISODE_ID === episode.SHOW_EPISODE_ID ? '#333' : '#1a1a1a',
                        padding: '15px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: selectedEpisode?.SHOW_EPISODE_ID === episode.SHOW_EPISODE_ID ? '2px solid #e50914' : '1px solid #333',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2a2a2a';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = selectedEpisode?.SHOW_EPISODE_ID === episode.SHOW_EPISODE_ID ? '#333' : '#1a1a1a';
                      }}
                    >
                      <div onClick={() => setSelectedEpisode(episode)}>
                        <h3 style={{ color: '#fff', marginBottom: '5px' }}>
                          Episode {episode.EPISODE_NUMBER}: {episode.SHOW_EPISODE_TITLE}
                        </h3>
                        <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                          {episode.SHOW_EPISODE_DESCRIPTION}
                        </p>
                        <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '5px' }}>
                          {formatDuration(episode.SHOW_EPISODE_DURATION)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            {selectedEpisode && (
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
                    <p style={{ color: 'red', marginTop: '8px' }}>{commentError}</p>
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
                              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
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
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ShowDetails;