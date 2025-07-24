import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import axios from 'axios';
import { FiUser, FiStar, FiPlay, FiHeart, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

const UserProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('watchHistory');

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.response?.data?.error || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleShowClick = (showId) => {
    navigate(`/show/${showId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="error-message">
            <h2>Profile Not Found</h2>
            <p>{error}</p>
            <button onClick={() => navigate(-1)} className="back-button">
              <FiArrowLeft /> Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { profile, watchHistory, favorites, ratings, canViewRatings, isOwnProfile } = profileData;

  return (
    <Layout>
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FiArrowLeft size={20} />
            Back
          </button>
          
          <div className="profile-info">
            <div className="profile-picture-section">
              {profile.profilePicture ? (
                <img
                  src={`http://localhost:5000/images/user/${profile.profilePicture}`}
                  alt={profile.fullName}
                  className="profile-picture"
                  onError={(e) => {
                    e.target.src = '/images/user/default-avatar.png';
                  }}
                />
              ) : (
                <div className="profile-picture-placeholder">
                  <FiUser size={40} />
                </div>
              )}
            </div>
            
            <div className="profile-details">
              <h1>{profile.fullName}</h1>
              <div className="profile-stats">
                <div className="stat">
                  <FiPlay size={16} />
                  <span>{watchHistory.length} shows watched</span>
                </div>
                <div className="stat">
                  <FiHeart size={16} />
                  <span>{favorites.length} favorites</span>
                </div>
                {canViewRatings && (
                  <div className="stat">
                    <FiStar size={16} />
                    <span>{ratings.length} ratings</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'watchHistory' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchHistory')}
          >
            <FiPlay size={16} />
            Watch History
          </button>
          <button
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <FiHeart size={16} />
            Favorites
          </button>
          {canViewRatings && (
            <button
              className={`tab ${activeTab === 'ratings' ? 'active' : ''}`}
              onClick={() => setActiveTab('ratings')}
            >
              <FiStar size={16} />
              Ratings
            </button>
          )}
        </div>

        {/* Content */}
        <div className="profile-content">
          {activeTab === 'watchHistory' && (
            <div className="content-section">
              <h2>Watch History</h2>
              {watchHistory.length === 0 ? (
                <div className="empty-state">
                  <FiPlay size={24} />
                  <p>No shows watched yet</p>
                </div>
              ) : (
                <div className="shows-grid">
                  {watchHistory.map((show) => (
                    <div
                      key={show.SHOW_ID}
                      className="show-card"
                      onClick={() => handleShowClick(show.SHOW_ID)}
                    >
                      <img
                        src={`http://localhost:5000/shows/${show.THUMBNAIL}`}
                        alt={show.TITLE}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="show-info">
                        <h3>{show.TITLE}</h3>
                        <div className="show-meta">
                          {show.RATING && (
                            <div className="rating">
                              <FiStar size={12} />
                              <span>{show.RATING}</span>
                            </div>
                          )}
                          <span className="episodes-watched">
                            {show.episodes_watched} episodes watched
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="content-section">
              <h2>Favorite Shows</h2>
              {favorites.length === 0 ? (
                <div className="empty-state">
                  <FiHeart size={24} />
                  <p>No favorite shows yet</p>
                </div>
              ) : (
                <div className="shows-grid">
                  {favorites.map((show) => (
                    <div
                      key={show.SHOW_ID}
                      className="show-card"
                      onClick={() => handleShowClick(show.SHOW_ID)}
                    >
                      <img
                        src={`http://localhost:5000/shows/${show.THUMBNAIL}`}
                        alt={show.TITLE}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="show-info">
                        <h3>{show.TITLE}</h3>
                        {show.RATING && (
                          <div className="rating">
                            <FiStar size={12} />
                            <span>{show.RATING}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ratings' && canViewRatings && (
            <div className="content-section">
              <h2>User Ratings</h2>
              {ratings.length === 0 ? (
                <div className="empty-state">
                  <FiStar size={24} />
                  <p>No ratings yet</p>
                </div>
              ) : (
                <div className="ratings-list">
                  {ratings.map((rating) => (
                    <div
                      key={rating.SHOW_ID}
                      className="rating-card"
                      onClick={() => handleShowClick(rating.SHOW_ID)}
                    >
                      <img
                        src={`http://localhost:5000/shows/${rating.THUMBNAIL}`}
                        alt={rating.TITLE}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="rating-info">
                        <h3>{rating.TITLE}</h3>
                        <div className="user-rating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={16}
                                className={i < rating.RATING ? 'filled' : 'empty'}
                              />
                            ))}
                          </div>
                          <span className="rating-value">{rating.RATING}/5</span>
                        </div>
                        {rating.REVIEW && (
                          <p className="rating-review">{rating.REVIEW}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ratings' && !canViewRatings && (
            <div className="content-section">
              <div className="privacy-notice">
                <FiEyeOff size={24} />
                <h2>Ratings Private</h2>
                <p>This user has chosen to keep their ratings private.</p>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .profile-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #e0e0e0;
          }

          .profile-header {
            margin-bottom: 30px;
          }

          .back-button {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #e0e0e0;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 20px;
          }

          .back-button:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
          }

          .profile-info {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .profile-picture-section {
            flex-shrink: 0;
          }

          .profile-picture,
          .profile-picture-placeholder {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 3px solid rgba(255, 255, 255, 0.2);
          }

          .profile-picture {
            object-fit: cover;
          }

          .profile-picture-placeholder {
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
          }

          .profile-details h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: 600;
          }

          .profile-stats {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
          }

          .stat {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #b0b0b0;
            font-size: 14px;
          }

          .profile-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .tab {
            display: flex;
            align-items: center;
            gap: 8px;
            background: none;
            border: none;
            color: #b0b0b0;
            padding: 12px 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom: 2px solid transparent;
          }

          .tab:hover {
            color: #e0e0e0;
          }

          .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
          }

          .content-section h2 {
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 600;
          }

          .empty-state {
            text-align: center;
            padding: 40px;
            color: #888;
          }

          .empty-state svg {
            margin-bottom: 10px;
            opacity: 0.5;
          }

          .shows-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }

          .show-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .show-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            border-color: rgba(102, 126, 234, 0.3);
          }

          .show-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .show-info {
            padding: 15px;
          }

          .show-info h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            color: #e0e0e0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .show-meta {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            color: #888;
          }

          .rating {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #ffd700;
          }

          .ratings-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .rating-card {
            display: flex;
            gap: 15px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .rating-card:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(102, 126, 234, 0.3);
          }

          .rating-card img {
            width: 80px;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            flex-shrink: 0;
          }

          .rating-info {
            flex: 1;
          }

          .rating-info h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
            font-weight: 600;
          }

          .user-rating {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }

          .stars {
            display: flex;
            gap: 2px;
          }

          .stars .filled {
            color: #ffd700;
            fill: #ffd700;
          }

          .stars .empty {
            color: #444;
          }

          .rating-value {
            font-weight: 600;
            color: #ffd700;
          }

          .rating-review {
            color: #b0b0b0;
            line-height: 1.5;
            margin: 0;
          }

          .privacy-notice {
            text-align: center;
            padding: 40px;
            color: #888;
          }

          .privacy-notice svg {
            margin-bottom: 15px;
            opacity: 0.5;
          }

          .privacy-notice h2 {
            color: #e0e0e0;
            margin-bottom: 10px;
          }

          .loading-spinner {
            text-align: center;
            padding: 40px;
            color: #888;
          }

          .error-message {
            text-align: center;
            padding: 40px;
          }

          .error-message h2 {
            color: #ff6b6b;
            margin-bottom: 10px;
          }

          .error-message p {
            color: #888;
            margin-bottom: 20px;
          }

          @media (max-width: 768px) {
            .profile-container {
              padding: 15px;
            }

            .profile-info {
              flex-direction: column;
              text-align: center;
              gap: 15px;
            }

            .profile-stats {
              justify-content: center;
            }

            .profile-tabs {
              overflow-x: auto;
              padding-bottom: 10px;
            }

            .shows-grid {
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 15px;
            }

            .rating-card {
              flex-direction: column;
            }

            .rating-card img {
              width: 100%;
              height: 200px;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default UserProfileView;
