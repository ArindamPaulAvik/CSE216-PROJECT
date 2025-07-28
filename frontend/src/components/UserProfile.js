import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiCamera, FiSave, FiArrowLeft, FiHeart, FiGrid, FiInfo, FiX, FiTrash2, FiStar, FiEdit3 } from 'react-icons/fi';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import Layout from './Layout';
import axios from 'axios';

function UserProfile() {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    phone: '',
    country: '',
    profilePicture: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [removingFavorite, setRemovingFavorite] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToDelete, setShowToDelete] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [ratingsError, setRatingsError] = useState('');
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';

  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/auth');
          return;
        }

        console.log('Fetching user profile...'); // Debug log
        const response = await fetch(`${BASE_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status); // Debug log
        console.log('Response headers:', response.headers); // Debug log

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, redirecting to login');
            localStorage.removeItem('token');
            navigate('/auth');
            return;
          }

          // Log the response text for debugging
          const errorText = await response.text();
          console.log('Error response:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.log('Non-JSON response:', responseText);
          throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();
        console.log('User data received:', data); // Debug log

        setUserInfo(data);

        // Set image preview if profile picture exists
        if (data.profilePicture) {
          setImagePreview(`${BASE_URL}/images/user/${data.profilePicture}`);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // Remove error display since we're only showing data now
        console.log(`Failed to load user profile: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const [activeTab, setActiveTab] = useState('details');

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      setLoadingFavorites(true);
      setFavoritesError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFavorites(response.data.favorites);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setFavoritesError('Failed to load favorites');
    } finally {
      setLoadingFavorites(false);
    }
  };

  // Fetch user comments
  const fetchUserComments = async () => {
    try {
      setLoadingComments(true);
      setCommentsError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/user/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComments(response.data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setCommentsError('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  // Remove from favorites
  const handleRemoveFavorite = async (showId) => {
    try {
      setRemovingFavorite(showId);
      setFavoritesError('');
      const token = localStorage.getItem('token');
      
      await axios.post(`${BASE_URL}/favorite/${showId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from local state
      setFavorites(prev => prev.filter(show => show.SHOW_ID !== showId));
      
      // Close modal - don't trigger success/no changes modals for favorites
      setShowDeleteModal(false);
      setShowToDelete(null);
      
    } catch (err) {
      console.error('Error removing favorite:', err);
      setFavoritesError('Failed to remove from favorites');
    } finally {
      setRemovingFavorite(null);
    }
  };

  // Show delete confirmation modal
  const handleDeleteClick = (show) => {
    setShowToDelete(show);
    setShowDeleteModal(true);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setShowToDelete(null);
  };

  // Fetch user ratings
  const fetchUserRatings = async () => {
    try {
      setLoadingRatings(true);
      setRatingsError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/ratings/user/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRatings(response.data.ratings);
    } catch (err) {
      console.error('Error fetching user ratings:', err);
      setRatingsError('Failed to load ratings');
    } finally {
      setLoadingRatings(false);
    }
  };
  // Handle tab switching
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    
    // Clear errors and modals based on which tab we're switching to
    if (tab === 'details') {
      setFavoritesError('');
      setCommentsError('');
      setRatingsError('');
    } else if (tab === 'favourites') {
      setFavoritesError('');
      setCommentsError('');
      setRatingsError('');
      fetchFavorites();
    } else if (tab === 'posts') {
      setFavoritesError('');
      setCommentsError('');
      setRatingsError('');
      fetchUserComments();
    } else if (tab === 'ratings') {
      setFavoritesError('');
      setCommentsError('');
      setRatingsError('');
      fetchUserRatings();
    }
  };

  // Handle comment click to navigate to show with comment
  const handleCommentClick = (comment) => {
    if (comment.EPISODE_TITLE) {
      // Navigate to show with specific episode and comment
      navigate(`/show/${comment.SHOW_ID}?episode=${comment.SHOW_EPISODE_ID}&comment=${comment.COMMENT_ID}`);
    } else {
      // Navigate to show without specific episode but with comment
      navigate(`/show/${comment.SHOW_ID}?comment=${comment.COMMENT_ID}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format comment time for display
  const formatCommentTime = (timeString) => {
    if (!timeString) return 'Unknown time';
    const date = new Date(timeString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <button
            onClick={() => navigate('/frontpage')}
            className="back-button"
          >
            <FiArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1>My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div>
            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <div className="profile-picture-container">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="profile-picture"
                    onError={(e) => {
                      console.log('Image load error:', e);
                      e.target.src = '/images/user/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="profile-picture-placeholder">
                    <FiUser size={40} />
                  </div>
                )}
              </div>
              <div className="profile-picture-info">
                <h3>{userInfo.firstName} {userInfo.lastName}</h3>
                <p>Member since 2024</p>
              </div>
            </div>

            <div className="profile-nav">
              <button
                className={`nav-tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabSwitch('details');
                }}
                type="button"
              >
                <FiInfo size={16} />
                <span>Details</span>
              </button>
              <button
                className={`nav-tab ${activeTab === 'favourites' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabSwitch('favourites');
                }}
                type="button"
              >
                <FiHeart size={16} />
                <span>Favourites</span>
              </button>
              <button
                className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabSwitch('posts');
                }}
                type="button"
              >
                <FiGrid size={16} />
                <span>Posts</span>
              </button>
              <button
                className={`nav-tab ${activeTab === 'ratings' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabSwitch('ratings');
                }}
                type="button"
              >
                <FiStar size={16} />
                <span>Ratings</span>
              </button>
            </div>

            {/* Conditional Tab Content */}
{activeTab === 'details' && (
  <div className="user-details-display">
    <div className="details-header">
      <h3>Profile Information</h3>
      <button
        type="button"
        onClick={() => navigate('/settings?section=personal')}
        className="edit-icon-button"
        title="Edit Profile"
      >
        <FiEdit3 size={18} />
      </button>
    </div>
    <div className="details-grid">
      <div className="detail-item">
        <div className="detail-label">First Name</div>
        <div className="detail-value">{userInfo.firstName}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Last Name</div>
        <div className="detail-value">{userInfo.lastName}</div>
      </div>
      <div className="detail-item detail-item-full">
        <div className="detail-label">Email</div>
        <div className="detail-value">{userInfo.email}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Birthdate</div>
        <div className="detail-value">{userInfo.birthdate ? formatDate(userInfo.birthdate) : 'Not specified'}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Phone Number</div>
        <div className="detail-value">{userInfo.phone || 'Not specified'}</div>
      </div>
      <div className="detail-item detail-item-full">
        <div className="detail-label">Country</div>
        <div className="detail-value">{userInfo.country || 'Not specified'}</div>
      </div>
    </div>
  </div>
)}

{activeTab === 'favourites' && (
  <div className="tab-content">
    {favoritesError && (
      <div className="alert alert-error">
        {favoritesError}
      </div>
    )}
    {loadingFavorites ? (
      <div className="favorites-loading">
        <div className="loading-spinner"></div>
        <p>Loading your favorites...</p>
      </div>
    ) : favorites.length === 0 ? (
      <div className="favorites-empty">
        <FiHeart size={48} className="empty-icon" />
        <h3>No favorites yet</h3>
        <p>Shows you add to favorites will appear here</p>
      </div>
    ) : (
      <div className="favorites-list">
        <div className="favorites-header">
          <h3>Your Favorites ({favorites.length})</h3>
        </div>
        <div className="favorites-items">
          {favorites.map(show => (
            <div key={show.SHOW_ID} className="favorite-item">
              <div 
                className="favorite-thumbnail"
                onClick={() => navigate(`/show/${show.SHOW_ID}`)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={`${BASE_URL}/shows/${show.THUMBNAIL}`} 
                  alt={show.TITLE}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              </div>
              
              <div 
                className="favorite-details"
                onClick={() => navigate(`/show/${show.SHOW_ID}`)}
                style={{ cursor: 'pointer' }}
              >
                <h4 className="favorite-title">{show.TITLE}</h4>
                <div className="favorite-rating">
                  <AiFillStar style={{ color: '#ffd700', fontSize: '1.2rem' }} />
                  <span className="rating-value">{show.RATING}</span>
                </div>
                <p className="favorite-description">
                  {show.DESCRIPTION && show.DESCRIPTION.length > 150 
                    ? show.DESCRIPTION.substring(0, 150) + '...' 
                    : show.DESCRIPTION || 'No description available'
                  }
                </p>
                <div className="favorite-genres">
                  {show.GENRES || 'No genres available'}
                </div>
              </div>
              
              <div className="favorite-meta">
                <div className="favorite-date">
                  Added {formatDate(show.ADDED_DATE)}
                </div>
                <button 
                  className="remove-favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(show);
                  }}
                  disabled={removingFavorite === show.SHOW_ID}
                  title="Remove from favorites"
                >
                  {removingFavorite === show.SHOW_ID ? (
                    <div className="mini-spinner"></div>
                  ) : (
                    <FiTrash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}

{activeTab === 'posts' && (
  <div className="tab-content">
    {commentsError && (
      <div className="alert alert-error">
        {commentsError}
      </div>
    )}
    {loadingComments ? (
      <div className="comments-loading">
        <div className="loading-spinner"></div>
        <p>Loading your comments...</p>
      </div>
    ) : comments.length === 0 ? (
      <div className="comments-empty">
        <FiGrid size={48} className="empty-icon" />
        <h3>No comments yet</h3>
        <p>Comments you make on shows will appear here</p>
      </div>
    ) : (
      <div className="comments-list">
        <div className="comments-header">
          <h3>Your Comments ({comments.length})</h3>
        </div>
        <div className="comments-items">
          {comments.map(comment => (
            <div 
              key={comment.COMMENT_ID} 
              className={`comment-item ${comment.PARENT_ID ? 'is-reply' : ''}`}
              onClick={() => handleCommentClick(comment)}
              style={{ cursor: 'pointer' }}
            >
              {comment.PARENT_ID && (
                <div className="reply-line"></div>
              )}
              
              <div className="comment-content">
                <div className="comment-header">
                  <div className="show-info">
                    <div className="show-thumbnail">
                      <img 
                        src={`${BASE_URL}/shows/${comment.SHOW_THUMBNAIL}`} 
                        alt={comment.SHOW_TITLE}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="show-details">
                      <h4 className="show-title">{comment.SHOW_TITLE}</h4>
                      {comment.CATEGORY_ID !== 1 && comment.EPISODE_TITLE && (
                        <p className="episode-title">Episode: {comment.EPISODE_TITLE}</p>
                      )}
                    </div>
                  </div>
                  <div className="comment-meta">
                    <span className="comment-time">
                      {formatCommentTime(comment.TIME)}
                    </span>
                  </div>
                </div>
                
                <div className="comment-body">
                  <p className="comment-text">
                    {comment.TEXT}
                    {comment.EDITED === 1 && (
                      <span className="edited-indicator"> (edited)</span>
                    )}
                  </p>
                  {comment.IMG_LINK && (
                    <div className="comment-image">
                      <img src={`${BASE_URL}${comment.IMG_LINK}`} alt="Comment attachment" />
                    </div>
                  )}
                </div>
                
                <div className="comment-stats">
                  <div className="stat-item">
                    <span className="stat-icon">👍</span>
                    <span className="stat-count">{comment.LIKE_COUNT || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">👎</span>
                    <span className="stat-count">{comment.DISLIKE_COUNT || 0}</span>
                  </div>
                  {comment.PINNED && (
                    <div className="stat-item pinned">
                      <span className="stat-icon">📌</span>
                      <span>Pinned</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}

{activeTab === 'ratings' && (
  <div className="tab-content">
    {ratingsError && (
      <div className="alert alert-error">
        {ratingsError}
      </div>
    )}
    {loadingRatings ? (
      <div className="ratings-loading">
        <div className="loading-spinner"></div>
        <p>Loading your ratings...</p>
      </div>
    ) : ratings.length === 0 ? (
      <div className="ratings-empty">
        <FiStar size={48} className="empty-icon" />
        <h3>No ratings yet</h3>
        <p>Episodes you rate will appear here</p>
      </div>
    ) : (
      <div className="ratings-list">
        <div className="ratings-header">
          <h3>Your Ratings ({ratings.length})</h3>
        </div>
        <div className="ratings-items">
          {ratings.map(rating => (
            <div key={`${rating.SHOW_ID}-${rating.SHOW_EPISODE_ID}`} className="rating-item">
              <div className="show-thumbnail">
                <img 
                  src={`${BASE_URL}/shows/${rating.THUMBNAIL}`} 
                  alt={rating.SHOW_TITLE}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              </div>
              
              <div className="rating-content">
                <div className="rating-header">
                  <h4 className="show-title">{rating.SHOW_TITLE}</h4>
                  <div className="episode-info">
                    {rating.CATEGORY_NAME !== 'Movie' && rating.SEASON && (
                      <span className="season">Season {rating.SEASON}</span>
                    )}
                    <span className="episode">Episode {rating.EPISODE_NUMBER}</span>
                    {rating.EPISODE_TITLE && (
                      <span className="episode-title">• {rating.EPISODE_TITLE}</span>
                    )}
                  </div>
                </div>
                
                <div className="rating-display">
                  <div className="rating-stars">
                    {[...Array(10)].map((_, i) => {
                      const StarIcon = i < rating.RATING_VALUE ? AiFillStar : AiOutlineStar;
                      return (
                        <StarIcon
                          key={i}
                          style={{
                            color: i < rating.RATING_VALUE ? '#ffd700' : '#666',
                            fontSize: '1.2rem',
                            marginRight: '2px'
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="rating-text">
                    <span className="rating-value">{rating.RATING_VALUE}/10</span>
                    <span className="rating-date">
                      • Rated on {new Date(rating.RATING_DATE).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                className="view-episode-btn"
                onClick={() => {
                  // Navigate without scrolling by using replace and handling episode selection
                  navigate(`/show/${rating.SHOW_ID}`, { 
                    replace: false,
                    state: { 
                      selectedEpisodeId: rating.SHOW_EPISODE_ID,
                      preventScroll: true 
                    }
                  });
                }}
              >
                View Episode
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}

          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && showToDelete && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Remove from Favorites</h3>
                <button 
                  className="modal-close"
                  onClick={handleCancelDelete}
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-show-info">
                  <img 
                    src={`${BASE_URL}/shows/${showToDelete.THUMBNAIL}`} 
                    alt={showToDelete.TITLE}
                    className="modal-thumbnail"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="modal-details">
                    <h4>{showToDelete.TITLE}</h4>
                    <p>Are you sure you want to remove this show from your favorites?</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancelDelete}
                  disabled={removingFavorite === showToDelete.SHOW_ID}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleRemoveFavorite(showToDelete.SHOW_ID)}
                  disabled={removingFavorite === showToDelete.SHOW_ID}
                >
                  {removingFavorite === showToDelete.SHOW_ID ? (
                    <>
                      <div className="btn-spinner"></div>
                      Removing...
                    </>
                  ) : (
                    <>
                      <FiTrash2 size={16} />
                      Remove
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
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
          text-decoration: none;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .profile-header h1 {
          color: #e0e0e0;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .alert-error {
          background: rgba(229, 62, 62, 0.1);
          border: 1px solid rgba(229, 62, 62, 0.3);
          color: #ff6b6b;
        }

        .alert-success {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #81c784;
        }

        .profile-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 30px;
          backdrop-filter: blur(10px);
        }

        .profile-picture-section {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .profile-picture-container {
          position: relative;
        }

        .profile-picture {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .profile-picture-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .profile-picture-upload {
          position: absolute;
          bottom: 0;
          right: 0;
          cursor: pointer;
        }

        .upload-overlay {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 2px solid #1a1a2e;
          transition: all 0.2s ease;
        }

        .upload-overlay:hover {
          background: #5a67d8;
          transform: scale(1.05);
        }

        .profile-nav {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #999;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 12px 0;
  position: relative;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-tab:hover {
  color: #e0e0e0;
}

.nav-tab.active {
  color: #e0e0e0;
}

.nav-tab::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 1px;
  background: #667eea;
  transition: width 0.3s ease;
}

.nav-tab:hover::after {
  width: 100%;
}

.nav-tab.active::after {
  width: 100%;
}

.nav-tab.disabled {
  color: #555 !important;
  cursor: not-allowed !important;
  opacity: 0.5;
}

.nav-tab.disabled:hover {
  color: #555 !important;
}

.nav-tab.disabled::after {
  display: none;
}

.tab-content {
  padding: 40px 0;
  text-align: center;
  color: #999;
  font-size: 16px;
}

@media (max-width: 768px) {
  .profile-nav {
    gap: 40px;
  }
  
  .nav-tab {
    font-size: 12px;
  }
}

        .profile-picture-info h3 {
          color: #e0e0e0;
          margin: 0 0 5px 0;
          font-size: 24px;
          font-weight: 600;
        }

        .profile-picture-info p {
          color: #999;
          margin: 0;
          font-size: 14px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .user-details-display {
          margin-bottom: 30px;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .details-header h3 {
          color: #e0e0e0;
          font-size: 18px;
          margin: 0;
          font-weight: 600;
        }

        .edit-icon-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          padding: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-icon-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .detail-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .detail-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .detail-item-full {
          grid-column: 1 / -1;
        }

        .detail-value {
          color: #e0e0e0;
          font-size: 16px;
          font-weight: 500;
          min-height: 20px;
        }

        .form-group-full {
          grid-column: 1 / -1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #b0b0b0;
          font-size: 14px;
          font-weight: 500;
        }

        .form-group input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px 16px;
          color: #e0e0e0;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-group input:disabled {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.05);
          color: #999;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
        }

        .edit-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #e0e0e0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-success {
          background: #48bb78;
          color: white;
        }

        .btn-success:hover {
          background: #38a169;
          transform: translateY(-1px);
        }

        .btn-danger {
          background: #e53e3e;
          color: white;
        }

        .btn-danger:hover {
          background: #c53030;
          transform: translateY(-1px);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 15px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .profile-picture-section {
            flex-direction: column;
            text-align: center;
          }

          .edit-actions {
            width: 100%;
          }

          .btn {
            flex: 1;
            justify-content: center;
          }

          .favorite-item {
            flex-direction: column;
            gap: 15px;
          }

          .favorite-thumbnail {
            width: 100px;
            height: 150px;
            margin-right: 0;
            align-self: center;
          }

          .favorite-details {
            padding-right: 0;
            text-align: center;
          }

          .favorite-meta {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        /* Favorites specific styles */
        .favorites-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          gap: 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(78, 205, 196, 0.2);
          border-top: 3px solid #4ecdc4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .favorites-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          gap: 15px;
          color: rgba(255, 255, 255, 0.7);
        }

        .empty-icon {
          color: rgba(78, 205, 196, 0.5);
        }

        .favorites-list {
          width: 100%;
        }

        .favorites-header {
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 15px;
        }

        .favorites-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #4ecdc4;
        }

        .favorites-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .favorite-item {
          display: flex;
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 20px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .favorite-item:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .favorite-thumbnail {
          flex-shrink: 0;
          width: 120px;
          height: 180px;
          margin-right: 20px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .favorite-thumbnail:hover {
          transform: scale(1.05);
        }

        .favorite-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .favorite-item:hover .favorite-thumbnail img {
          transform: scale(1.05);
        }

        .favorite-details {
          flex: 1;
          padding-right: 20px;
          text-align: left;
          transition: color 0.3s ease;
        }

        .favorite-details:hover {
          color: #4ecdc4;
        }

        .favorite-title {
          margin: 0 0 10px 0;
          font-size: 1.4rem;
          color: white;
          font-weight: 600;
          line-height: 1.3;
        }

        .favorite-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .rating-star {
          font-size: 1.2rem;
        }

        .rating-value {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .favorite-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }

        .favorite-genres {
          color: #4ecdc4;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .favorite-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 15px;
          padding-top: 10px;
        }

        .favorite-date {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .remove-favorite-btn {
          background: rgba(255, 107, 107, 0.2);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 8px;
          color: #ff6b6b;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-favorite-btn:hover:not(:disabled) {
          background: rgba(255, 107, 107, 0.3);
          border-color: #ff6b6b;
          transform: scale(1.1);
        }

        .remove-favorite-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mini-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 107, 107, 0.2);
          border-top: 2px solid #ff6b6b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header h3 {
          margin: 0;
          color: #e0e0e0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          color: #e0e0e0;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-body {
          padding: 24px;
        }

        .modal-show-info {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .modal-thumbnail {
          width: 60px;
          height: 90px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .modal-details h4 {
          margin: 0 0 8px 0;
          color: #e0e0e0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .modal-details p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
        }

        .modal-footer .btn {
          min-width: 100px;
        }

        /* Comments specific styles */
        .comments-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          gap: 20px;
        }

        .comments-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          gap: 15px;
          color: rgba(255, 255, 255, 0.7);
        }

        .comments-list {
          width: 100%;
        }

        .comments-header {
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 15px;
        }

        .comments-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #667eea;
        }

        .comments-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .comment-item {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .comment-item:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .comment-item.is-reply {
          margin-left: 40px;
          border-left: 3px solid #667eea;
          padding-left: 20px;
        }

        .reply-line {
          position: absolute;
          left: -40px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #667eea;
          opacity: 0.6;
        }

        .comment-content {
          width: 100%;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .show-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 200px;
        }

        .show-thumbnail {
          width: 50px;
          height: 75px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
        }

        .show-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .show-details {
          flex: 1;
          min-width: 0;
          text-align: left;
        }

        .show-title {
          margin: 0 0 4px 0;
          font-size: 1.1rem;
          color: #e0e0e0;
          font-weight: 600;
          line-height: 1.2;
          text-align: left;
        }

        .episode-title {
          margin: 0;
          font-size: 0.9rem;
          color: #999;
          line-height: 1.2;
          text-align: left;
        }

        .comment-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          flex-shrink: 0;
        }

        .comment-time {
          font-size: 0.85rem;
          color: #999;
          text-align: left;
        }

        .comment-body {
          margin-bottom: 15px;
        }

        .comment-text {
          margin: 0 0 10px 0;
          color: #e0e0e0;
          line-height: 1.6;
          font-size: 0.95rem;
          word-wrap: break-word;
          text-align: left;
        }

        .comment-image {
          margin-top: 10px;
          border-radius: 8px;
          overflow: hidden;
          max-width: 300px;
        }

        .comment-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .edited-indicator {
          font-size: 0.8rem;
          color: #999;
          font-style: italic;
        }

        .comment-stats {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: flex-start;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: #999;
        }

        .stat-item.pinned {
          color: #f39c12;
        }

        .stat-icon {
          font-size: 1rem;
        }

        .stat-count {
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .comment-item.is-reply {
            margin-left: 20px;
          }

          .comment-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .comment-meta {
            align-items: flex-start;
            flex-direction: row;
            gap: 10px;
          }

          .show-info {
            min-width: 100%;
          }

          .comment-stats {
            flex-wrap: wrap;
            gap: 15px;
            justify-content: flex-start;
          }
        }

        /* Ratings Styles */
        .ratings-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          color: #888;
        }

        .ratings-empty {
          text-align: center;
          padding: 60px 20px;
          color: #888;
        }

        .ratings-empty .empty-icon {
          color: #555;
          margin-bottom: 20px;
        }

        .ratings-empty h3 {
          color: #ccc;
          margin: 20px 0 10px;
        }

        .ratings-list {
          max-width: 100%;
        }

        .ratings-header {
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #333;
        }

        .ratings-header h3 {
          color: #fff;
          margin: 0;
          font-size: 1.3rem;
        }

        .ratings-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .rating-item {
          display: flex;
          align-items: center;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          gap: 20px;
        }

        .rating-item:hover {
          border-color: #555;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .rating-item .show-thumbnail {
          flex-shrink: 0;
          width: 80px;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
        }

        .rating-item .show-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .rating-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rating-header .show-title {
          color: #fff;
          margin: 0 0 5px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .episode-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .episode-info .season,
        .episode-info .episode {
          background: #333;
          color: #fff;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .episode-info .episode-title {
          color: #ccc;
          font-size: 0.9rem;
        }

        .rating-display {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rating-stars {
          display: flex;
          gap: 2px;
        }

        .rating-stars .star {
          font-size: 1rem;
          color: #444;
        }

        .rating-stars .star.filled {
          color: #ffd700;
        }

        .rating-text {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .rating-value {
          color: #ffd700;
          font-weight: 600;
          font-size: 1rem;
        }

        .rating-date {
          color: #999;
          font-size: 0.8rem;
        }

        .view-episode-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .view-episode-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .rating-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .rating-item .show-thumbnail {
            width: 60px;
            height: 90px;
          }

          .rating-content {
            width: 100%;
          }

          .view-episode-btn {
            width: 100%;
            text-align: center;
          }

          .episode-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
        .detail-label {
          color: #b0b0b0;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 4px;
        }
      `}</style>
    </Layout>
  );
}

export default UserProfile;