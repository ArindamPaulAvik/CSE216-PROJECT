import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { FiHeart, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingFavorite, setRemovingFavorite] = useState(null);
  const navigate = useNavigate();

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFavorites(response.data.favorites);
      setError(null);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Remove from favorites
  const handleRemoveFavorite = async (showId) => {
    try {
      setRemovingFavorite(showId);
      const token = localStorage.getItem('token');
      
      await axios.post(`http://localhost:5000/favorite/${showId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from local state
      setFavorites(prev => prev.filter(show => show.SHOW_ID !== showId));
      
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove from favorites');
    } finally {
      setRemovingFavorite(null);
    }
  };

  // Navigate to show details
  const handleShowClick = (showId) => {
    navigate(`/show/${showId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your favorites...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchFavorites} className="retry-button">
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="favorites-container">
        <div className="favorites-header">
          <div className="header-content">
            <FiHeart size={32} className="heart-icon" />
            <div>
              <h1>Your Favorites</h1>
              <p className="subtitle">
                {favorites.length === 0 
                  ? "No favorites added yet" 
                  : `${favorites.length} show${favorites.length !== 1 ? 's' : ''} in your collection`
                }
              </p>
            </div>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h2>No favorites yet</h2>
            <p>Start exploring and add shows to your favorites to see them here!</p>
            <button 
              onClick={() => navigate('/frontpage')} 
              className="browse-button"
            >
              Browse Shows
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map(show => (
              <div key={show.SHOW_ID} className="favorite-card">
                <div className="card-image-container">
                  <img 
                    src={`/shows/${show.THUMBNAIL}`} 
                    alt={show.TITLE}
                    className="card-image"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="card-overlay">
                    <button 
                      className="view-button"
                      onClick={() => handleShowClick(show.SHOW_ID)}
                    >
                      View Details
                    </button>
                  </div>
                  <button 
                    className="remove-favorite-btn"
                    onClick={() => handleRemoveFavorite(show.SHOW_ID)}
                    disabled={removingFavorite === show.SHOW_ID}
                    title="Remove from favorites"
                  >
                    {removingFavorite === show.SHOW_ID ? (
                      <div className="mini-spinner"></div>
                    ) : (
                      <FiX size={18} />
                    )}
                  </button>
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
            ))}
          </div>
        )}
      </div>

      <style>{`
        .favorites-container {
          min-height: 100vh;
          padding: 0;
        }

        .favorites-header {
          background: linear-gradient(135deg, rgba(255, 76, 76, 0.15), rgba(255, 76, 76, 0.05));
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px 0;
          margin-bottom: 40px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .heart-icon {
          color: #ff4c4c;
          filter: drop-shadow(0 0 10px rgba(255, 76, 76, 0.3));
        }

        .favorites-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #e0e0e0;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .subtitle {
          color: #9a9a9a;
          font-size: 1.1rem;
          margin: 8px 0 0 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top: 4px solid #ff4c4c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 20px;
          text-align: center;
        }

        .error-icon {
          font-size: 4rem;
        }

        .error-container h2 {
          color: #e0e0e0;
          margin: 0;
        }

        .retry-button {
          background: #ff4c4c;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          background: #e53e3e;
          transform: translateY(-2px);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
          gap: 20px;
        }

        .empty-icon {
          font-size: 5rem;
          opacity: 0.5;
        }

        .empty-state h2 {
          color: #e0e0e0;
          font-size: 2rem;
          margin: 0;
        }

        .empty-state p {
          color: #9a9a9a;
          font-size: 1.1rem;
          margin: 0;
        }

        .browse-button {
          background: linear-gradient(135deg, #ff4c4c, #e53e3e);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 76, 76, 0.3);
        }

        .browse-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 76, 76, 0.4);
        }

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 40px;
        }

        .favorite-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .favorite-card:hover {
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

        .favorite-card:hover .card-image {
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

        .favorite-card:hover .card-overlay {
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

        .remove-favorite-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 76, 76, 0.9);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .remove-favorite-btn:hover {
          background: rgba(255, 76, 76, 1);
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(255, 76, 76, 0.4);
        }

        .remove-favorite-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .mini-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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

        @media (max-width: 768px) {
          .favorites-header {
            padding: 30px 0;
          }

          .header-content {
            padding: 0 15px;
          }

          .favorites-header h1 {
            font-size: 2rem;
          }

          .favorites-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 15px 30px;
          }

          .card-image-container {
            height: 300px;
          }

          .card-content {
            padding: 20px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default FavoritesPage;