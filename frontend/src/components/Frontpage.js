import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { useLocation } from 'react-router-dom';

function FrontPage() {
  const [trendingShows, setTrendingShows] = useState([]);
  const [watchAgainShows, setWatchAgainShows] = useState([]);
  const [recommendedShows, setRecommendedShows] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [userName, setUserName] = useState('User');
  const [profilePicture, setProfilePicture] = useState('');
  const location = useLocation();
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
        const data = res.data;
        setTrendingShows(data.trendingshows || []);
        setWatchAgainShows(data.watchagainshows || []);
        setRecommendedShows(data.recommendedShows || []);
        setUserName(data.userName || 'User');
        if (data.profilePicture) {
          setProfilePicture(`http://localhost:5000/images/user/${data.profilePicture}`);
        }
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
  const params = new URLSearchParams(location.search);
  const scrollTo = params.get('scrollTo');
  if (scrollTo) {
    setTimeout(() => {
      const target = document.getElementById(scrollTo);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500); // wait for content to load
  }
}, [location.search]);

  useEffect(() => {
    if (trendingShows.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTrendingIndex(prev => (prev + 1) % trendingShows.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [trendingShows]);

  const trending = trendingShows[currentTrendingIndex] || {};

  const getImagePath = (thumbnail) => {
    if (!thumbnail) return 'http://localhost:5000/shows/placeholder.jpg';
    return `/shows/${thumbnail}`;
  };

  const handleImageError = (e, showTitle, thumbnail) => {
    console.error(`Image error for ${showTitle}`, thumbnail);
    e.target.src = '/placeholder.jpg';
  };

  const renderShowBox = useCallback((show) => (
    <div
      className="show-card"
      key={show.SHOW_ID}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/show/${show.SHOW_ID}`)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/show/${show.SHOW_ID}`)}
    >
      <div className="card-image-container">
        <img 
          src={getImagePath(show.THUMBNAIL)} 
          alt={show.TITLE}
          className="card-image"
          loading="lazy"
          onError={(e) => handleImageError(e, show.TITLE, show.THUMBNAIL)}
        />
        <div className="card-overlay">
          <button 
            className="view-button"
            onClick={() => navigate(`/show/${show.SHOW_ID}`)}
          >
            View Details
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{show.TITLE}</h3>
        <div className="card-rating">
          <span className="rating-star">⭐</span>
          <span className="rating-value">{show.RATING}</span>
        </div>
        <p className="card-description">
          {show.DESCRIPTION && show.DESCRIPTION.length > 120 
            ? show.DESCRIPTION.substring(0, 120) + '...' 
            : show.DESCRIPTION || 'No description available'
          }
        </p>
        <div className="card-genres">
          {show.GENRES || 'No genres available'}
        </div>
      </div>
    </div>
  ), [navigate]);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-wrapper">
        {trendingShows.length > 0 && (
          <section className="hero-section">
            <div className="hero-content">
              <h2 className="hero-title">
                {trending.TITLE}
              </h2>
              <p className="hero-description">
                {trending.DESCRIPTION}
              </p>
              <div className="hero-actions">
                <span className="hero-rating">
                  ⭐ {trending.RATING}
                </span>
                <button
                  onClick={() => navigate(`/show/${trending.SHOW_ID}`)}
                  className="hero-button"
                >
                  Watch Now
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img
                src={getImagePath(trending.THUMBNAIL)}
                alt={trending.TITLE}
                className="hero-img"
                loading="lazy"
                onError={(e) => handleImageError(e, trending.TITLE, trending.THUMBNAIL)}
              />
            </div>
          </section>
        )}
      </div>

      {/* Trending Now Section */}
      <section id="trending" className="shows-section">
        <h2 className="section-title trending-title">
          Trending Now
        </h2>
        <div className="shows-grid">
          {trendingShows.map(renderShowBox)}
        </div>
        {trendingShows.length === 0 && (
          <p className="empty-message">
            No trending shows available at the moment.
          </p>
        )}
      </section>

      {/* Recommended Shows Section */}
      {recommendedShows.length > 0 && (
        <section id="recommended" className="shows-section">
          <h2 className="section-title recommended-title">
            Recommended for You
          </h2>
          <div className="shows-grid">
            {recommendedShows.map(renderShowBox)}
          </div>
        </section>
      )}

      {/* Watch Again Section */}
      <section id="watchagain" className="shows-section">
        <h2 className="section-title watch-again-title">
          Watch Again
        </h2>
        <div className="shows-grid">
          {watchAgainShows.map(renderShowBox)}
        </div>
        {watchAgainShows.length === 0 && (
          <p className="empty-message">
            No shows to watch again yet. Start watching some content!
          </p>
        )}
      </section>

      <style>{`

        .hero-wrapper {
  position: relative;
  width: calc(100vw - 120px); /* leave space on both sides (e.g., 60px left + 60px right) */
  margin-left: calc(-50vw + 50% + 60px); /* offset to center with left margin preserved */
  margin-top: -20px;
  overflow: hidden;
}


        .hero-section {
  display: flex;
  width: 100vw;
  height: 380px; /* increase height slightly */
  background: rgba(255, 255, 255, 0.02);
  border: none;
  border-radius: 0;
  margin: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

        .hero-content {
          flex: 0 0 40%;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #ddd;
          background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7));
        }

        .hero-title {
          font-size: 2.2rem;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-description {
          flex-grow: 1;
          font-size: 1rem;
          line-height: 1.6;
          overflow-y: auto;
          max-height: 140px;
          margin-bottom: 15px;
          color: #ccc;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .hero-rating {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: bold;
          color: white;
        }

        .hero-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .hero-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .hero-image {
          flex: 1 1 60%;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.85);
        }

        .shows-section {
          margin-bottom: 60px;
        }

        .section-title {
          color: #fff;
          margin-bottom: 30px;
          font-size: 1.8rem;
          font-weight: bold;
          padding-bottom: 10px;
          display: inline-block;
        }

        .trending-title {
          border-bottom: 3px solid #667eea;
        }

        .recommended-title {
          border-bottom: 3px solid #f093fb;
        }

        .watch-again-title {
          border-bottom: 3px solid #764ba2;
        }

        .shows-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
        }

        .show-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          cursor: pointer;
        }

        .show-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .card-image-container {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .show-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.8) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .show-card:hover .card-overlay {
          opacity: 1;
        }

        .view-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .view-button:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: scale(1.05);
        }

        .card-content {
          padding: 25px;
        }

        .card-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #e0e0e0;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 15px;
        }

        .rating-star {
          font-size: 1.1rem;
        }

        .rating-value {
          font-weight: 600;
          color: #ffd700;
          font-size: 1rem;
        }

        .card-description {
          color: #b0b0b0;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0 0 15px 0;
        }

        .card-genres {
          color: #9a9a9a;
          font-size: 0.9rem;
          font-style: italic;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 12px;
        }

        .empty-message {
          color: #888;
          text-align: center;
          font-size: 1.1rem;
          margin-top: 40px;
        }

        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
            height: auto;
          }

          .hero-content {
            flex: none;
            padding: 20px;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-image {
            flex: none;
            height: 200px;
          }

          .shows-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .card-image-container {
            height: 300px;
          }

          .card-content {
            padding: 20px;
          }

          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </Layout>
  );
}

export default FrontPage;