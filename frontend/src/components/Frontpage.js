import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

function FrontPage() {
  const [trendingShows, setTrendingShows] = useState([]);
  const [watchAgainShows, setWatchAgainShows] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/login';
      return;
    }

    axios.get('http://localhost:5000/frontpage', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTrendingShows(res.data.trendingshows || []);
        setWatchAgainShows(res.data.watchagainshows || []);
      })
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error('Error fetching frontpage:', err);
        }
      });
  }, []);

  useEffect(() => {
    if (trendingShows.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTrendingIndex(prev => (prev + 1) % trendingShows.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [trendingShows]);

  const trending = trendingShows[currentTrendingIndex] || {};

  const renderShowBox = useCallback((show) => (
    <div
      className="movie-box"
      key={show.SHOW_ID}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/show/${show.SHOW_ID}`)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/show/${show.SHOW_ID}`)}
      style={{ cursor: 'pointer' }}
    >
      <img src={show.THUMBNAIL} alt={show.TITLE} className="movie-thumbnail" loading="lazy" />
      <div className="movie-bottom-overlay">
        <h3>{show.TITLE}</h3>
        <p>⭐ {show.RATING}</p>
      </div>
      <div className="movie-hover-description">
        <p>{show.DESCRIPTION}</p>
      </div>
    </div>
  ), [navigate]);

  return (
    <Layout>
      {/* Hero Section with Featured/Trending Show */}
      {trendingShows.length > 0 && (
        <section style={{
          display: 'flex',
          backgroundColor: '#1c1c1c',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 60,
          height: 300,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            flex: '0 0 40%',
            padding: 30,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#ddd',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7))'
          }}>
            <h2 style={{ 
              fontSize: '2.2rem', 
              marginBottom: 15,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {trending.TITLE}
            </h2>
            <p style={{
              flexGrow: 1,
              fontSize: '1rem',
              lineHeight: 1.6,
              overflowY: 'auto',
              maxHeight: 140,
              marginBottom: 15,
              color: '#ccc'
            }}>
              {trending.DESCRIPTION}
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              marginTop: 'auto'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                ⭐ {trending.RATING}
              </span>
              <button
                onClick={() => navigate(`/show/${trending.SHOW_ID}`)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Watch Now
              </button>
            </div>
          </div>
          <div style={{ flex: '1 1 60%', position: 'relative' }}>
            <img
              src={trending.THUMBNAIL}
              alt={trending.TITLE}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.85)'
              }}
              loading="lazy"
            />
            {/* Play button overlay on hero image */}
            <div 
              onClick={() => navigate(`/show/${trending.SHOW_ID}`)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '3px solid rgba(255,255,255,0.8)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.9)';
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '20px solid #fff',
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent',
                marginLeft: '6px'
              }} />
            </div>
          </div>
        </section>
      )}

      {/* Trending Now Section */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ 
          color: '#fff', 
          marginBottom: 30,
          fontSize: '1.8rem',
          fontWeight: 'bold',
          borderBottom: '3px solid #667eea',
          paddingBottom: '10px',
          display: 'inline-block'
        }}>
          Trending Now
        </h2>
        <div className="movie-grid">
          {trendingShows.map(renderShowBox)}
        </div>
        {trendingShows.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', fontSize: '1.1rem', marginTop: '40px' }}>
            No trending shows available at the moment.
          </p>
        )}
      </section>

      {/* Watch Again Section */}
      <section>
        <h2 style={{ 
          color: '#fff', 
          marginBottom: 30,
          fontSize: '1.8rem',
          fontWeight: 'bold',
          borderBottom: '3px solid #764ba2',
          paddingBottom: '10px',
          display: 'inline-block'
        }}>
          Watch Again
        </h2>
        <div className="movie-grid">
          {watchAgainShows.map(renderShowBox)}
        </div>
        {watchAgainShows.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', fontSize: '1.1rem', marginTop: '40px' }}>
            No shows to watch again yet. Start watching some content!
          </p>
        )}
      </section>

      {/* Custom Styles - Same as before but enhanced */}
      <style>{`
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
        }
        .movie-box {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background-color: #1c1c1c;
          height: 420px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .movie-box:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .movie-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .movie-bottom-overlay {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 20px 15px;
          background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0));
          color: #fff;
          z-index: 2;
        }
        .movie-bottom-overlay h3 {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          font-weight: bold;
        }
        .movie-bottom-overlay p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }
        .movie-hover-description {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          padding: 20px;
          background-color: rgba(0, 0, 0, 0.95);
          color: #ddd;
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 3;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .movie-hover-description p {
          line-height: 1.6;
          margin: 0;
        }
        .movie-box:hover .movie-hover-description {
          opacity: 1;
        }
        .movie-box:hover .movie-bottom-overlay {
          opacity: 0;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .movie-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }
          .movie-box {
            height: 350px;
          }
        }
      `}</style>
    </Layout>
  );
}

export default FrontPage;