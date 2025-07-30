import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiUser, FiImage } from 'react-icons/fi';
import axios from 'axios';

function EditDirector() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewDirector = id === 'new';
  const [loading, setLoading] = useState(!isNewDirector);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    biography: ''
  });
  const [currentPicture, setCurrentPicture] = useState(null);
  const [newPicture, setNewPicture] = useState(null);
  const BASE_URL = 'https://cse216-project.onrender.com';

  // File input ref
  const pictureInputRef = useRef();

  useEffect(() => {
    if (!isNewDirector) {
      fetchDirectorDetails();
    }
  }, [id, isNewDirector]);

  const fetchDirectorDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/directors/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const director = response.data;
      setFormData({
        firstName: director.DIRECTOR_FIRSTNAME || '',
        lastName: director.DIRECTOR_LASTNAME || '',
        biography: director.BIOGRAPHY || ''
      });
      setCurrentPicture(director.PICTURE);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching director details:', error);
      setError('Failed to load director details');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPicture(file);
    }
  };

  const getImagePath = (picture) => {
    if (!picture) return '/directors/placeholder.jpg';
    return `/directors/${picture}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please fill in both first name and last name');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName.trim());
      submitData.append('lastName', formData.lastName.trim());
      submitData.append('biography', formData.biography.trim());
      
      if (newPicture) {
        submitData.append('picture', newPicture);
      }
      
      if (isNewDirector) {
        // Create new director
        const response = await axios.post(`${BASE_URL}/directors`, submitData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        navigate(`/admin-director-details/${response.data.director.DIRECTOR_ID}`);
      } else {
        // Update existing director
        await axios.put(`${BASE_URL}/directors/${id}`, submitData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        navigate(`/admin-director-details/${id}`);
      }
    } catch (error) {
      console.error('Error saving director:', error);
      setError(isNewDirector ? 'Failed to create director. Please try again.' : 'Failed to update director. Please try again.');
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (isNewDirector) {
      navigate('/directors-management');
    } else {
      navigate(`/admin-director-details/${id}`);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🎬</div>
          <div>Loading director details...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiArrowLeft size={20} />
            Back
          </motion.button>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>
              {isNewDirector ? 'Add New Director' : 'Edit Director'}
            </h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
              {isNewDirector ? 'Create a new director profile' : 'Update director information'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiX size={16} />
            Cancel
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: saving ? 'rgba(46, 213, 115, 0.5)' : 'linear-gradient(45deg, #2ed573, #00b894)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiSave size={16} />
            {saving ? 'Saving...' : (isNewDirector ? 'Create Director' : 'Save Changes')}
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255, 71, 87, 0.2)',
              border: '1px solid rgba(255, 71, 87, 0.3)',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              color: '#ff4757'
            }}
          >
            {error}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Profile Picture Section */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Profile Picture</h2>
            
            {/* Profile Picture Preview */}
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              margin: '0 auto 20px',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              position: 'relative',
              background: 'white'
            }}>
              <img
                src={newPicture ? URL.createObjectURL(newPicture) : getImagePath(currentPicture)}
                alt="Director profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = '/directors/placeholder.jpg';
                }}
              />
            </div>

            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FiImage size={18} />
              Choose Picture
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                style={{ display: 'none' }}
              />
            </motion.label>
          </div>

          {/* Basic Information */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Basic Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Biography */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Biography</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>
                Biography
              </label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                rows="6"
                placeholder="Enter director's biography, career highlights, and achievements..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FiX size={18} />
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={saving}
              style={{
                background: saving ? 'rgba(46, 213, 115, 0.5)' : 'linear-gradient(45deg, #2ed573, #00b894)',
                border: 'none',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '10px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FiSave size={18} />
              {saving ? 'Saving...' : (isNewDirector ? 'Create Director' : 'Save Changes')}
            </motion.button>
          </div>
        </motion.form>
      </main>
    </div>
  );
}

export default EditDirector;
