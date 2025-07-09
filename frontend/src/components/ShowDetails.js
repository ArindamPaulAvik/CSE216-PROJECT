import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import VideoPlayer from './videoplayer';
import CommentsSection from './CommentsSection';

function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

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
        <VideoPlayer
          showVideoPlayer={showVideoPlayer}
          selectedEpisode={selectedEpisode}
          videoRef={videoRef}
          isPlaying={isPlaying}
          closeVideoPlayer={closeVideoPlayer}
          togglePlayPause={togglePlayPause}
          handleVideoPlay={handleVideoPlay}
          handleVideoPause={handleVideoPause}
          handleVideoEnded={handleVideoEnded}
          formatDuration={formatDuration}
        />

        {/* Hero Section with Background */}
        <div style={{
          position: 'relative',
          height: '70vh',
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(33, 28, 28, 0.8)), url(/showS/${show.THUMBNAIL}) center/cover`,
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
              {show.TITLE} {show.CATEGORY_ID === 2 && `S${show.SEASON}`}
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
                {formatDuration(selectedEpisode?.SHOW_EPISODE_DURATION || 'N/A')}
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
                onClick={() => selectedEpisode && playEpisode(selectedEpisode)}
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
          {/* Container for Episodes and Show Info */}
<div style={{
  display: 'flex',
  gap: '40px',
  marginTop: '40px',
  marginBottom: '30px',
  width: '100%', // full width so info box can go all the way right
  maxWidth: '100vw', // limit to viewport width
  boxSizing: 'border-box',
  paddingRight: 0,  // no right padding to allow edge alignment
}}>

  {/* Episodes Section (left) */}
  {/* Episodes Section (left) */}
{episodes.length > 0 && (
  <div style={{
    width: '500px',  // Adjust width as needed
    maxWidth: '100%', 
    minWidth: '300px',
    flexShrink: 0,
  }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>
      Episodes
    </h2>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      {episodes.map((episode) => (
        <div
          key={episode.SHOW_EPISODE_ID}
          style={{
            backgroundColor: selectedEpisode?.SHOW_EPISODE_ID === episode.SHOW_EPISODE_ID ? '#333' : '#1a1a1a',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: selectedEpisode?.SHOW_EPISODE_ID === episode.SHOW_EPISODE_ID ? '2px solid #e50914' : '1px solid #333',
            transition: 'all 0.3s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2a2a2a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = selectedEpisode?.SHOW_EPISODE_ID === episode.SHOW_EPISODE_ID ? '#333' : '#1a1a1a';
          }}
          onClick={() => {
            setSelectedEpisode(episode);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span style={{ color: '#fff', fontWeight: '600' }}>
            Episode {episode.EPISODE_NUMBER}
          </span>
          <span style={{ color: '#999', fontSize: '0.85rem' }}>
            {formatDuration(episode.SHOW_EPISODE_DURATION)}
          </span>
        </div>
      ))}
    </div>
  </div>
)}


  {/* Show Information Section (right) */}
  <div style={{
    flex: '0 0 280px',  // fixed width
    position: 'sticky',
    top: '20px',       // optional: so it sticks slightly below top on scroll
    alignSelf: 'flex-start',
    right: 0,
    background: 'rgba(42, 42, 42, 0.85)',
    padding: '20px 25px',
    borderRadius: '12px 0 0 12px', // rounded only left side for style
    color: '#ccc',
    lineHeight: '1.8',
    boxShadow: 'none',
    marginLeft: 'auto', // keep pushed right
  }}> 
    <p style={{ marginBottom: '15px' }}>
      <strong style={{ color: '#fff' }}>Category:</strong> {show.CATEGORY_NAME || 'N/A'}
    </p>

    <p style={{ marginBottom: '15px' }}>
      <strong style={{ color: '#fff' }}>Genre:</strong> {show.GENRES || 'N/A'}
    </p>

    <p style={{ marginBottom: '15px' }}>
      <strong style={{ color: '#fff' }}>Duration:</strong> {formatDuration(selectedEpisode?.SHOW_EPISODE_DURATION || 'N/A')}
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
</div>

{/* Comments Section below */}
{selectedEpisode && (
  <CommentsSection selectedEpisode={selectedEpisode} />
)}
        </div>
      </div>
    </Layout>
  );
}

export default ShowDetails;