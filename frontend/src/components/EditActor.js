import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiImage, FiUser, FiFileText } from 'react-icons/fi';
import axios from 'axios';

function EditActor() {
  const navigate = useNavigate();
  const { id } = useParams(); // If id exists, we're editing; otherwise, we're adding
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    biography: ''
  });
  const [currentPicture, setCurrentPicture] = useState(null);
  const [newPicture, setNewPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchActorDetails();
    }
  }, [id, isEditing]);

  const fetchActorDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/actors/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const actorData = response.data;
      const nameParts = actorData.NAME.split(' ');
      
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        biography: actorData.BIOGRAPHY || ''
      });
      setCurrentPicture(actorData.PICTURE);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching actor details:', error);
      alert('Failed to load actor details');
      navigate('/actors-management');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('Please fill in both first name and last name');
      return;
    }

    try {
      setSubmitLoading(true);
      const token = localStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName.trim());
      submitData.append('lastName', formData.lastName.trim());
      submitData.append('biography', formData.biography.trim());
      
      if (newPicture) {
        submitData.append('picture', newPicture);
      }

      if (isEditing) {
        // Update existing actor
        await axios.put(`http://localhost:5000/admin/actors/${id}`, submitData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Actor updated successfully!');
        navigate(`/admin-actor-details/${id}`);
      } else {
        // Create new actor
        const response = await axios.post('http://localhost:5000/admin/actors', submitData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Actor created successfully!');
        navigate(`/admin-actor-details/${response.data.actorId}`);
      }
    } catch (error) {
      console.error('Error saving actor:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} actor. Please try again.`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBack = () => {
    if (isEditing) {
      navigate(`/admin-actor-details/${id}`);
    } else {
      navigate('/actors-management');
    }
  };

  const getImagePath = (picture) => {
    if (!picture) return '/actors/placeholder.jpg';
    return `/actors/${picture}`;
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
        Loading actor data...
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
              {isEditing ? 'Edit Actor' : 'Add New Actor'}
            </h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
              {isEditing ? 'Update actor information' : 'Create a new actor profile'}
            </p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Profile Picture Section */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Profile Picture</h3>
              
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
                  alt="Actor profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = '/actors/placeholder.jpg';
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

            {/* Form Fields */}
            <div style={{ display: 'grid', gap: '30px' }}>
              {/* Name Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '16px'
                  }}>
                    <FiUser size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
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
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '16px'
                  }}>
                    <FiUser size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
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
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Biography Section */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '12px',
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '16px'
                }}>
                  <FiFileText size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleInputChange}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter actor biography..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <motion.button
                type="submit"
                disabled={submitLoading}
                whileHover={{ scale: submitLoading ? 1 : 1.05 }}
                whileTap={{ scale: submitLoading ? 1 : 0.95 }}
                style={{
                  background: submitLoading ? 
                    'rgba(102, 126, 234, 0.5)' : 
                    'linear-gradient(45deg, #667eea, #764ba2)',
                  border: 'none',
                  color: 'white',
                  padding: '15px 40px',
                  borderRadius: '10px',
                  cursor: submitLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '0 auto'
                }}
              >
                <FiSave size={18} />
                {submitLoading ? 
                  (isEditing ? 'Updating...' : 'Creating...') : 
                  (isEditing ? 'Update Actor' : 'Create Actor')
                }
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default EditActor;
