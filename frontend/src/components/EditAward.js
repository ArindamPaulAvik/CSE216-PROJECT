import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiSave, 
  FiUpload,
  FiCheck,
  FiAward,
  FiType,
  FiFileText,
  FiImage,
  FiX
} from 'react-icons/fi';
import axios from 'axios';

function EditAward() {
  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_URL = 'https://cse216-project.onrender.com';

  const [formData, setFormData] = useState({
    name: '',
    awardingBody: '',
    description: '',
    image: null
  });

  const [currentImage, setCurrentImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageLoaded, setImageLoaded] = useState(true); // Start as true to prevent initial flickering
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAwardData();
  }, [id]);

  const fetchAwardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/awards/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const awardData = response.data;
      setFormData({
        name: awardData.AWARD_NAME || '',
        awardingBody: awardData.AWARDING_BODY || '',
        description: awardData.DESCRIPTION || '',
        image: null
      });
      setCurrentImage(awardData.IMG || '');
      setImageLoaded(true); // Reset to true when new data loads
      setLoading(false);
    } catch (error) {
      console.error('Error fetching award data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Award name is required';
    }

    if (!formData.awardingBody.trim()) {
      newErrors.awardingBody = 'Awarding body is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('awardingBody', formData.awardingBody);
      submitData.append('description', formData.description);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await axios.put(`${BASE_URL}/awards/${id}`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Award saved successfully:', response.data);
      navigate('/awards-management');
    } catch (error) {
      console.error('Error saving award:', error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Failed to save award. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/awards-management');
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview('');
    setImageLoaded(true); // Keep as loaded to prevent flickering
    const input = document.getElementById('image-input');
    if (input) {
      input.value = '';
    }
  };

  const getImageSrc = () => {
    if (imagePreview) return imagePreview;
    if (currentImage) return `/awards/${currentImage}`;
    return null; // Don't load any placeholder until image is selected
  };

  const shouldShowImage = () => {
    return imagePreview || currentImage;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    e.target.src = '/placeholder-award.jpg';
    setImageLoaded(true);
  };

  const hasCustomImage = () => {
    return imagePreview || formData.image;
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
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🏆</div>
          <div>Loading award data...</div>
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
            Back to Awards
          </motion.button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>
              Edit Award
            </h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
              Update award information
            </p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '30px' }}>
            {/* Award Image Section */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white'
              }}>
                <FiImage style={{ marginRight: '8px' }} />
                Award Image
              </label>
              
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* Image Preview */}
                <div style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {shouldShowImage() ? (
                    <>
                      <img
                        src={getImageSrc()}
                        alt="Award preview"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      {hasCustomImage() && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={removeImage}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: '#e74c3c',
                            border: 'none',
                            borderRadius: '50%',
                            width: '25px',
                            height: '25px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            zIndex: 10
                          }}
                        >
                          <FiX size={14} />
                        </motion.button>
                      )}
                    </>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '14px'
                    }}>
                      <FiImage size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <div>No image selected</div>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div style={{ flex: 1 }}>
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    htmlFor="image-input"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '120px',
                      border: '2px dashed rgba(255, 255, 255, 0.3)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FiUpload size={24} style={{ marginBottom: '8px', opacity: 0.7 }} />
                    <span style={{ fontSize: '14px', opacity: 0.7 }}>
                      Click to upload new image
                    </span>
                    <span style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>
                      JPEG, PNG (max 5MB)
                    </span>
                  </motion.label>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  {errors.image && (
                    <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {/* Award Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  <FiAward style={{ marginRight: '8px' }} />
                  Award Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter award name (e.g., Academy Award for Best Picture)"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${errors.name ? '#e74c3c' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.name && (
                  <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Awarding Body */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  <FiType style={{ marginRight: '8px' }} />
                  Awarding Body *
                </label>
                <input
                  type="text"
                  name="awardingBody"
                  value={formData.awardingBody}
                  onChange={handleInputChange}
                  placeholder="Enter awarding organization (e.g., Academy of Motion Picture Arts and Sciences)"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${errors.awardingBody ? '#e74c3c' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.awardingBody && (
                  <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {errors.awardingBody}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  <FiFileText style={{ marginRight: '8px' }} />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter award description, criteria, and significance..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${errors.description ? '#e74c3c' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.description && (
                  <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 30px',
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleBack}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={saving}
              style={{
                background: saving 
                  ? 'rgba(46, 213, 115, 0.5)' 
                  : 'linear-gradient(45deg, #2ed573, #00b894)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Update Award
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default EditAward;
