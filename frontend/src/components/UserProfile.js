import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiCamera, FiSave, FiArrowLeft, FiHeart, FiGrid, FiInfo } from 'react-icons/fi';
import Layout from './Layout';

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
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

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
        setError('No changes were made');
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

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        {success && (
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
                  setActiveTab('details');
                  setError('');
                  setSuccess('');
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
                  setActiveTab('favourites');
                  setError('');
                  setSuccess('');
                  setIsEditing(false);
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
                  setActiveTab('posts');
                  setError('');
                  setSuccess('');
                  setIsEditing(false);
                }}
                type="button"
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
    <p>Your favourite items will appear here.</p>
  </div>
)}

{activeTab === 'posts' && (
  <div className="tab-content">
    <p>Your posts will appear here.</p>
  </div>
)}

          </form>
        </div>
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
        }
      `}</style>
    </Layout>
  );
}

export default UserProfile;