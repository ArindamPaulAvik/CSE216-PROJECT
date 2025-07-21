import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiCamera, FiSave, FiArrowLeft, FiHeart, FiGrid, FiInfo, FiX, FiTrash2 } from 'react-icons/fi';
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
  const [originalInfo, setOriginalInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [favoritesError, setFavoritesError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [removingFavorite, setRemovingFavorite] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToDelete, setShowToDelete] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState('');

  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        console.log('Fetching user profile...'); // Debug log
        const response = await fetch('http://localhost:5000/user/profile', {
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
            navigate('/login');
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
        setOriginalInfo(data);

        // Set image preview if profile picture exists
        if (data.profilePicture) {
          setImagePreview(`http://localhost:5000/images/user/${data.profilePicture}`);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(`Failed to load user profile: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [activeTab, setActiveTab] = useState('details');

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      setLoadingFavorites(true);
      setFavoritesError('');
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/favorites', {
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
      
      const response = await axios.get('http://localhost:5000/user/comments', {
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
      
      await axios.post(`http://localhost:5000/favorite/${showId}`, {}, {
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

  // Handle tab switching
  const handleTabSwitch = (tab) => {
    if (isEditing) return;
    
    setActiveTab(tab);
    
    // Clear errors and modals based on which tab we're switching to
    if (tab === 'details') {
      setError('');
      setSuccess('');
      setFavoritesError('');
      setCommentsError('');
    } else if (tab === 'favourites') {
      setError('');
      setSuccess('');
      setFavoritesError('');
      setCommentsError('');
      fetchFavorites();
    } else if (tab === 'posts') {
      setError('');
      setSuccess('');
      setFavoritesError('');
      setCommentsError('');
      fetchUserComments();
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

  // Handle profile picture selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setError('');
    }
  };

  // Handle form submission
  const hasUnsavedChanges = () => {
    // Format birthdates for comparison
    let currentFormattedBirthdate = userInfo.birthdate;
    let originalFormattedBirthdate = originalInfo.birthdate;

    if (currentFormattedBirthdate) {
      if (currentFormattedBirthdate.includes('T')) {
        currentFormattedBirthdate = currentFormattedBirthdate.split('T')[0];
      }
      else if (currentFormattedBirthdate instanceof Date) {
        currentFormattedBirthdate = currentFormattedBirthdate.toISOString().split('T')[0];
      }
    }

    if (originalFormattedBirthdate) {
      if (originalFormattedBirthdate.includes('T')) {
        originalFormattedBirthdate = originalFormattedBirthdate.split('T')[0];
      }
      else if (originalFormattedBirthdate instanceof Date) {
        originalFormattedBirthdate = originalFormattedBirthdate.toISOString().split('T')[0];
      }
    }

    return (
      userInfo.firstName !== originalInfo.firstName ||
      userInfo.lastName !== originalInfo.lastName ||
      userInfo.email !== originalInfo.email ||
      currentFormattedBirthdate !== originalFormattedBirthdate ||
      userInfo.phone !== originalInfo.phone ||
      userInfo.country !== originalInfo.country ||
      selectedFile !== null
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Format birthdate to YYYY-MM-DD format before sending
      let formattedBirthdate = userInfo.birthdate;
      if (formattedBirthdate) {
        // If it's a full ISO string, extract just the date part
        if (formattedBirthdate.includes('T')) {
          formattedBirthdate = formattedBirthdate.split('T')[0];
        }
        // If it's already a date object, format it
        else if (formattedBirthdate instanceof Date) {
          formattedBirthdate = formattedBirthdate.toISOString().split('T')[0];
        }
      }

      // Format original birthdate for comparison
      let originalFormattedBirthdate = originalInfo.birthdate;
      if (originalFormattedBirthdate) {
        if (originalFormattedBirthdate.includes('T')) {
          originalFormattedBirthdate = originalFormattedBirthdate.split('T')[0];
        }
        else if (originalFormattedBirthdate instanceof Date) {
          originalFormattedBirthdate = originalFormattedBirthdate.toISOString().split('T')[0];
        }
      }

      // Check if any changes were made
      const hasChanges =
        userInfo.firstName !== originalInfo.firstName ||
        userInfo.lastName !== originalInfo.lastName ||
        userInfo.email !== originalInfo.email ||
        formattedBirthdate !== originalFormattedBirthdate ||
        userInfo.phone !== originalInfo.phone ||
        userInfo.country !== originalInfo.country ||
        selectedFile !== null;

      if (!hasChanges) {
        setError('No changes were made to your profile.');
        setIsSaving(false);
        return;
      }

      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Append user data with properly formatted date
      formData.append('USER_FIRSTNAME', userInfo.firstName);
      formData.append('USER_LASTNAME', userInfo.lastName);
      formData.append('EMAIL', userInfo.email);
      formData.append('BIRTH_DATE', formattedBirthdate); // Use formatted date
      formData.append('PHONE_NO', userInfo.phone);
      formData.append('COUNTRY_NAME', userInfo.country);

      // Append profile picture if selected
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      console.log('Submitting form data with formatted birthdate:', formattedBirthdate);

      const response = await fetch('http://localhost:5000/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type when using FormData - let the browser set it
        },
        body: formData
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to update profile`);
        } else {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          throw new Error(`HTTP ${response.status}: Server returned non-JSON response`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('Non-JSON response:', responseText);
        throw new Error('Server returned non-JSON response');
      }

      const updatedData = await response.json();
      console.log('Updated data received:', updatedData);

      setUserInfo(updatedData.user || updatedData);
      setOriginalInfo(updatedData.user || updatedData);
      setIsEditing(false);
      setSelectedFile(null);
      setSuccess('Profile updated successfully!');

      // Update image preview with new path
      const userData = updatedData.user || updatedData;
      if (userData.profilePicture) {
        setImagePreview(`http://localhost:5000/images/user/${userData.profilePicture}`);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setUserInfo(originalInfo);
    setIsEditing(false);
    setSelectedFile(null);
    setError('');
    setSuccess('');

    // Reset image preview
    if (originalInfo.profilePicture) {
      setImagePreview(`http://localhost:5000/images/user/${originalInfo.profilePicture}`);
    } else {
      setImagePreview('');
    }
  };

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Handle the timestamp format from your backend
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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

        {/* Alert Messages - Only show for details tab */}
        {activeTab === 'details' && error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        {activeTab === 'details' && success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Profile Form */}
        <div className="profile-card">
          <form onSubmit={handleSubmit}>
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

                {isEditing && (
                  <label className="profile-picture-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-overlay">
                      <FiCamera size={20} />
                    </div>
                  </label>
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
                className={`nav-tab ${activeTab === 'favourites' ? 'active' : ''} ${isEditing ? 'disabled' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isEditing) {
                    handleTabSwitch('favourites');
                  }
                }}
                type="button"
                disabled={isEditing}
              >
                <FiHeart size={16} />
                <span>Favourites</span>
              </button>
              <button
                className={`nav-tab ${activeTab === 'posts' ? 'active' : ''} ${isEditing ? 'disabled' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isEditing) {
                    handleTabSwitch('posts');
                  }
                }}
                type="button"
                disabled={isEditing}
              >
                <FiGrid size={16} />
                <span>Posts</span>
              </button>
            </div>

            {/* Conditional Tab Content */}
{activeTab === 'details' && (
  <div className="form-grid">
    {/* First Name */}
    <div className="form-group">
      <label htmlFor="firstName">
        <FiUser size={16} />
        First Name
      </label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={userInfo.firstName}
        onChange={handleInputChange}
        disabled={!isEditing}
        required
      />
    </div>

    {/* Last Name */}
    <div className="form-group">
      <label htmlFor="lastName">
        <FiUser size={16} />
        Last Name
      </label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={userInfo.lastName}
        onChange={handleInputChange}
        disabled={!isEditing}
        required
      />
    </div>

    {/* Email */}
    <div className="form-group form-group-full">
      <label htmlFor="email">
        <FiMail size={16} />
        Email Address
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={userInfo.email}
        onChange={handleInputChange}
        disabled={!isEditing}
        required
      />
    </div>

    {/* Birth Date */}
    <div className="form-group">
      <label htmlFor="birthdate">
        <FiCalendar size={16} />
        Date of Birth
      </label>
      <input
        type="date"
        id="birthdate"
        name="birthdate"
        value={formatDateForInput(userInfo.birthdate)}
        onChange={handleInputChange}
        disabled={!isEditing}
        required
      />
    </div>

    {/* Phone */}
    <div className="form-group">
      <label htmlFor="phone">
        <FiUser size={16} />
        Phone
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={userInfo.phone}
        onChange={handleInputChange}
        disabled={!isEditing}
      />
    </div>

    {/* Country */}
    <div className="form-group form-group-full">
      <label htmlFor="country">
        <FiUser size={16} />
        Country
      </label>
      <input
        type="text"
        id="country"
        name="country"
        value={userInfo.country}
        onChange={handleInputChange}
        disabled={!isEditing}
      />
    </div>
  </div>
)}

{activeTab === 'details' && (
  <div className="form-actions">
    {!isEditing ? (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="btn btn-primary"
      >
        Edit Profile
      </button>
    ) : (
      <div className="edit-actions">
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-secondary"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-success"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="btn-spinner"></div>
              Saving...
            </>
          ) : (
            <>
              <FiSave size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    )}
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
                  src={`/shows/${show.THUMBNAIL}`} 
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
                  <span className="rating-star">⭐</span>
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
                        src={`/shows/${comment.SHOW_THUMBNAIL}`} 
                        alt={comment.SHOW_TITLE}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="show-details">
                      <h4 className="show-title">{comment.SHOW_TITLE}</h4>
                      {comment.EPISODE_TITLE && (
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
                  <p className="comment-text">{comment.TEXT}</p>
                  {comment.IMG_LINK && (
                    <div className="comment-image">
                      <img src={`http://localhost:5000${comment.IMG_LINK}`} alt="Comment attachment" />
                    </div>
                  )}
                  {comment.EDITED === 1 && (
                    <span className="edited-indicator">(edited)</span>
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

          </form>
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
                    src={`/shows/${showToDelete.THUMBNAIL}`} 
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
      `}</style>
    </Layout>
  );
}

export default UserProfile;