import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiCalendar, FiStar, FiClock, FiImage } from 'react-icons/fi';
import { FaImage } from 'react-icons/fa';
import axios from 'axios';

function EditShow() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ thumbnail: false, banner: false });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    rating: '',
    duration: '',
    season: '',
    thumbnail: '',
    banner: '',
    categoryId: '',
    publisherId: '',
    statusId: '',
    ageRestrictionId: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [ageRestrictions, setAgeRestrictions] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isMovie, setIsMovie] = useState(false);
  
  // Episode form data
  const [episodeFormData, setEpisodeFormData] = useState({
    title: '',
    description: '',
    duration: '',
    videoUrl: ''
  });

  // File input refs
  const thumbnailInputRef = useRef();
  const bannerInputRef = useRef();

  useEffect(() => {
    fetchShowDetails();
    fetchDropdownData();
    fetchEpisodes();
  }, [id]);

  const fetchShowDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/show/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const show = response.data;
      setFormData({
        title: show.TITLE || '',
        description: show.DESCRIPTION || '',
        releaseDate: show.RELEASE_DATE ? show.RELEASE_DATE.split('T')[0] : '',
        rating: show.RATING || '',
        duration: show.DURATION || '',
        season: show.SEASON || '',
        thumbnail: show.THUMBNAIL || '',
        banner: show.BANNER || '',
        categoryId: show.CATEGORY_ID || '',
        publisherId: show.PUBLISHER_ID || '',
        statusId: show.STATUS_ID || '',
        ageRestrictionId: show.AGE_RESTRICTION_ID || ''
      });
      
      // Check if it's a movie (category ID 1)
      setIsMovie(show.CATEGORY_ID === 1);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching show details:', error);
      setError('Failed to load show details');
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch categories, publishers, statuses, and age restrictions
      const [categoriesRes, publishersRes, statusesRes, ageRestrictionsRes] = await Promise.all([
        axios.get('http://localhost:5000/admin/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('http://localhost:5000/admin/publishers', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('http://localhost:5000/admin/statuses', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('http://localhost:5000/admin/age-restrictions', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      setCategories(categoriesRes.data || []);
      setPublishers(publishersRes.data || []);
      setStatuses(statusesRes.data || []);
      setAgeRestrictions(ageRestrictionsRes.data || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      // Continue without dropdown data - they'll be empty selects
    }
  };

  const fetchEpisodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/show/${id}/episodes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Get episodes from the response
      const episodesData = response.data || [];
      setEpisodes(episodesData);
      
      // Auto-select first episode if available and none is currently selected
      if (episodesData.length > 0) {
        const firstEpisode = episodesData[0];
        setSelectedEpisodeId(firstEpisode.SHOW_EPISODE_ID.toString());
        setSelectedEpisode(firstEpisode);
        
        // Set episode form data
        setEpisodeFormData({
          title: firstEpisode.SHOW_EPISODE_TITLE || '',
          description: firstEpisode.SHOW_EPISODE_DESCRIPTION || '',
          duration: firstEpisode.SHOW_EPISODE_DURATION || '',
          videoUrl: firstEpisode.VIDEO_URL || ''
        });
      } else {
        setSelectedEpisodeId('');
        setSelectedEpisode(null);
        setEpisodeFormData({
          title: '',
          description: '',
          duration: '',
          videoUrl: ''
        });
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
      setEpisodes([]);
      setSelectedEpisodeId('');
      setSelectedEpisode(null);
      setEpisodeFormData({
        title: '',
        description: '',
        duration: '',
        videoUrl: ''
      });
    }
  };

  const handleEpisodeSelect = (episodeId) => {
    setSelectedEpisodeId(episodeId);
    const episode = episodes.find(ep => ep.SHOW_EPISODE_ID.toString() === episodeId);
    setSelectedEpisode(episode);
    
    // Update episode form data immediately
    if (episode) {
      setEpisodeFormData({
        title: episode.SHOW_EPISODE_TITLE || '',
        description: episode.SHOW_EPISODE_DESCRIPTION || '',
        duration: episode.SHOW_EPISODE_DURATION || '',
        videoUrl: episode.VIDEO_URL || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEpisodeFormChange = (e) => {
    const { name, value } = e.target;
    setEpisodeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/admin/shows/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Navigate back to show details
      navigate(`/admin-show-details/${id}`);
    } catch (error) {
      console.error('Error updating show:', error);
      setError('Failed to update show. Please try again.');
      setSaving(false);
    }
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);

    setUploading(prev => ({ ...prev, [type]: true }));
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/admin/shows/${id}/upload-${type}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update form data with new filename
      setFormData(prev => ({
        ...prev,
        [type]: response.data.filename
      }));

      setUploading(prev => ({ ...prev, [type]: false }));
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setError(`Failed to upload ${type}. Please try again.`);
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file, type);
    }
  };

  // Episode management functions
  const handleSaveEpisode = async (episodeData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!selectedEpisode) {
        alert('Please select an episode to update');
        return;
      }
      
      await axios.put(`http://localhost:5000/episode/${selectedEpisode.SHOW_EPISODE_ID}`, {
        title: episodeData.title,
        description: episodeData.description,
        duration: parseInt(episodeData.duration),
        videoUrl: episodeData.videoUrl
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Refresh episodes list
      const currentEpisodeId = selectedEpisodeId;
      await fetchEpisodes();
      
      // Restore selection if possible
      if (currentEpisodeId) {
        const updatedEpisode = episodes.find(ep => ep.SHOW_EPISODE_ID.toString() === currentEpisodeId);
        if (updatedEpisode) {
          setSelectedEpisodeId(currentEpisodeId);
          setSelectedEpisode(updatedEpisode);
          setEpisodeFormData({
            title: updatedEpisode.SHOW_EPISODE_TITLE || '',
            description: updatedEpisode.SHOW_EPISODE_DESCRIPTION || '',
            duration: updatedEpisode.SHOW_EPISODE_DURATION || '',
            videoUrl: updatedEpisode.VIDEO_URL || ''
          });
        }
      }
      
      alert('Episode updated successfully!');
    } catch (error) {
      console.error('Error saving episode:', error);
      alert('Failed to save episode');
    }
  };

  const handleBack = () => {
    navigate(`/admin-show-details/${id}`);
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
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>📝</div>
          <div>Loading show details...</div>
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
            Back to Details
          </motion.button>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Edit Show</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Update show information</p>
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
              background: saving ? 'rgba(102, 126, 234, 0.5)' : 'linear-gradient(45deg, #667eea, #764ba2)',
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
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
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
          {/* Basic Information */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Basic Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Season</label>
                <input
                  type="number"
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Descriptions</h2>
            <div style={{ display: 'grid', gap: '25px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Short Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Dates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Release Date</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Images</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', fontSize: '16px', color: 'white' }}>Thumbnail</label>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '14px', opacity: 0.7, margin: '0 0 10px 0' }}>
                    Current: {formData.thumbnail || 'No thumbnail'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current && thumbnailInputRef.current.click()}
                      disabled={uploading.thumbnail}
                      style={{
                        background: uploading.thumbnail ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        color: uploading.thumbnail ? '#999' : 'white',
                        cursor: uploading.thumbnail ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <FaImage size={18} />
                      {uploading.thumbnail ? 'Uploading...' : 'Choose Thumbnail'}
                    </button>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={thumbnailInputRef}
                    onChange={(e) => handleFileChange(e, 'thumbnail')}
                    disabled={uploading.thumbnail}
                    style={{ display: 'none' }}
                  />
                  {uploading.thumbnail && (
                    <p style={{ fontSize: '12px', color: 'white', margin: '8px 0 0 0', opacity: 0.8 }}>
                      Uploading thumbnail...
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', fontSize: '16px', color: 'white' }}>Banner</label>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '14px', opacity: 0.7, margin: '0 0 10px 0' }}>
                    Current: {formData.banner || 'No banner'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current && bannerInputRef.current.click()}
                      disabled={uploading.banner}
                      style={{
                        background: uploading.banner ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        color: uploading.banner ? '#999' : 'white',
                        cursor: uploading.banner ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <FaImage size={18} />
                      {uploading.banner ? 'Uploading...' : 'Choose Banner'}
                    </button>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={bannerInputRef}
                    onChange={(e) => handleFileChange(e, 'banner')}
                    disabled={uploading.banner}
                    style={{ display: 'none' }}
                  />
                  {uploading.banner && (
                    <p style={{ fontSize: '12px', color: 'white', margin: '8px 0 0 0', opacity: 0.8 }}>
                      Uploading banner...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Categories & Status */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Categories & Status</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="" style={{ background: '#333', color: 'white' }}>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.CATEGORY_ID} value={cat.CATEGORY_ID} style={{ background: '#333', color: 'white' }}>
                      {cat.CATEGORY_NAME}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Publisher</label>
                <select
                  name="publisherId"
                  value={formData.publisherId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="" style={{ background: '#333', color: 'white' }}>Select Publisher</option>
                  {publishers.map(pub => (
                    <option key={pub.PUBLISHER_ID} value={pub.PUBLISHER_ID} style={{ background: '#333', color: 'white' }}>
                      {pub.PUBLISHER_NAME}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Status</label>
                <select
                  name="statusId"
                  value={formData.statusId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="" style={{ background: '#333', color: 'white' }}>Select Status</option>
                  {statuses.map(status => (
                    <option key={status.STATUS_ID} value={status.STATUS_ID} style={{ background: '#333', color: 'white' }}>
                      {status.STATUS_NAME}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Age Restriction</label>
                <select
                  name="ageRestrictionId"
                  value={formData.ageRestrictionId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="" style={{ background: '#333', color: 'white' }}>Select Age Restriction</option>
                  {ageRestrictions.map(age => (
                    <option key={age.AGE_RESTRICTION_ID} value={age.AGE_RESTRICTION_ID} style={{ background: '#333', color: 'white' }}>
                      {age.AGE_RESTRICTION_NAME}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.form>

        {/* Episodes/Movie Management Section */}
        {episodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              marginTop: '40px'
            }}
          >
            <h2 style={{ margin: '0 0 30px 0', fontSize: '1.5rem', color: 'white' }}>
              {isMovie ? 'Movie Management' : 'Episodes Management'}
            </h2>

            {/* Episode Selection Dropdown */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '16px', color: 'white' }}>
                {isMovie ? 'Select Movie Content' : 'Select Episode to Edit'}
              </label>
              <select
                value={selectedEpisodeId}
                onChange={(e) => handleEpisodeSelect(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                {episodes.map((episode) => (
                  <option 
                    key={episode.SHOW_EPISODE_ID} 
                    value={episode.SHOW_EPISODE_ID.toString()}
                    style={{ background: '#333', color: 'white' }}
                  >
                    {isMovie 
                      ? `${episode.SHOW_EPISODE_TITLE || 'Movie Content'}`
                      : `Episode ${episode.EPISODE_NUMBER}: ${episode.SHOW_EPISODE_TITLE}`
                    }
                  </option>
                ))}
              </select>
            </div>

            {/* Episode Edit Form */}
            {selectedEpisode && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const episodeData = {
                    title: episodeFormData.title,
                    description: episodeFormData.description,
                    duration: episodeFormData.duration,
                    videoUrl: episodeFormData.videoUrl
                  };
                  handleSaveEpisode(episodeData);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '15px',
                  padding: '30px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '1.2rem' }}>
                  {isMovie ? 'Edit Movie Details' : `Edit Episode ${selectedEpisode.EPISODE_NUMBER}`}
                </h3>

                <div style={{ display: 'grid', gap: '25px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>
                      {isMovie ? 'Movie Title' : 'Episode Title'}
                    </label>
                    <input
                      name="title"
                      type="text"
                      value={episodeFormData.title}
                      onChange={handleEpisodeFormChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>
                      {isMovie ? 'Movie Description' : 'Episode Description'}
                    </label>
                    <textarea
                      name="description"
                      value={episodeFormData.description}
                      onChange={handleEpisodeFormChange}
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>
                        Duration (minutes)
                      </label>
                      <input
                        name="duration"
                        type="number"
                        value={episodeFormData.duration}
                        onChange={handleEpisodeFormChange}
                        min="1"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '16px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>
                        {isMovie ? 'Movie Link' : 'Episode Link'}
                      </label>
                      <input
                        name="videoUrl"
                        type="url"
                        value={episodeFormData.videoUrl}
                        onChange={handleEpisodeFormChange}
                        placeholder="https://..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '16px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: 'linear-gradient(45deg, #4caf50, #45a049)',
                        border: 'none',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <FiSave size={16} />
                      {isMovie ? 'Update Movie' : 'Update Episode'}
                    </motion.button>
                  </div>
                </div>
              </motion.form>
            )}
          </motion.div>
        )}

        {episodes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              marginTop: '40px',
              textAlign: 'center'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', color: 'white' }}>
              {isMovie ? 'Movie Management' : 'Episodes Management'}
            </h2>
            <p style={{ margin: 0, opacity: 0.6 }}>
              {isMovie ? 'No movie content found.' : 'No episodes found for this show.'}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default EditShow;
