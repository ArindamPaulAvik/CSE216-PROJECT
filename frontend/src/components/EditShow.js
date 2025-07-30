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
  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [allActors, setAllActors] = useState([]);
  const [selectedCast, setSelectedCast] = useState([]);
  const [showActorDropdown, setShowActorDropdown] = useState(false);
  const [allDirectors, setAllDirectors] = useState([]);
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [showDirectorDropdown, setShowDirectorDropdown] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isMovie, setIsMovie] = useState(false);
  const BASE_URL = 'https://cse216-project.onrender.com';
  
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
    fetchGenres();
    fetchActors();
    fetchCast();
    fetchDirectors();
    fetchSelectedDirectors();
  }, [id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActorDropdown && !event.target.closest('.actor-dropdown-container')) {
        setShowActorDropdown(false);
      }
      if (showDirectorDropdown && !event.target.closest('.director-dropdown-container')) {
        setShowDirectorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActorDropdown, showDirectorDropdown]);

  const fetchShowDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/show/${id}`, {
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
      
      // Fetch categories, publishers, statuses, age restrictions, and genres
      const [categoriesRes, publishersRes, statusesRes, ageRestrictionsRes, genresRes] = await Promise.all([
        axios.get(`${BASE_URL}/admin/categories`, { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/admin/publishers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/admin/statuses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/admin/age-restrictions`, { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/admin/genres`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      setCategories(categoriesRes.data || []);
      setPublishers(publishersRes.data || []);
      setStatuses(statusesRes.data || []);
      setAgeRestrictions(ageRestrictionsRes.data || []);
      setAllGenres(genresRes.data || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      // Continue without dropdown data - they'll be empty selects
    }
  };

  const fetchEpisodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/show/${id}/episodes`, {
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

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/admin/shows/${id}/genres`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setSelectedGenres(response.data || []);
    } catch (error) {
      console.error('Error fetching show genres:', error);
      setSelectedGenres([]);
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
      
      // Save the basic show data
      await axios.put(`${BASE_URL}/admin/shows/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Save the genres
      await saveGenres();

      // Save the cast
      await saveCast();

      // Save the directors
      await saveDirectors();

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
      const response = await axios.post(`${BASE_URL}/admin/shows/${id}/upload-${type}`, formData, {
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

  // Genre management functions
  const handleAddGenre = (genreId) => {
    const genre = allGenres.find(g => g.GENRE_ID === parseInt(genreId));
    if (genre && !selectedGenres.some(sg => sg.GENRE_ID === genre.GENRE_ID)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleRemoveGenre = (genreId) => {
    setSelectedGenres(selectedGenres.filter(g => g.GENRE_ID !== genreId));
  };

  const saveGenres = async () => {
    try {
      const token = localStorage.getItem('token');
      const genreIds = selectedGenres.map(g => g.GENRE_ID);
      
      await axios.put(`${BASE_URL}/admin/shows/${id}/genres`, {
        genreIds: genreIds
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Genres saved successfully');
    } catch (error) {
      console.error('Error saving genres:', error);
      throw error;
    }
  };

  const fetchActors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/actors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const transformedActors = response.data.map(actor => ({
        id: actor.ACTOR_ID,
        name: `${actor.ACTOR_FIRSTNAME} ${actor.ACTOR_LASTNAME}`,
        picture: actor.PICTURE
      }));
      
      setAllActors(transformedActors);
    } catch (error) {
      console.error('Error fetching actors:', error);
      setAllActors([]);
    }
  };

  const fetchCast = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/admin/shows/${id}/cast`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setSelectedCast(response.data || []);
    } catch (error) {
      console.error('Error fetching show cast:', error);
      setSelectedCast([]);
    }
  };

  const handleAddCast = (actorId) => {
    const actor = allActors.find(a => a.id === parseInt(actorId));
    if (actor && !selectedCast.find(c => c.ACTOR_ID === actor.id)) {
      const newCastMember = {
        ACTOR_ID: actor.id,
        NAME: actor.name,
        PICTURE: actor.picture,
        ROLE_NAME: '',
        ROLE_DESCRIPTION: ''
      };
      setSelectedCast([...selectedCast, newCastMember]);
    }
  };

  const handleRemoveCast = (actorId) => {
    setSelectedCast(selectedCast.filter(c => c.ACTOR_ID !== actorId));
  };

  const handleCastRoleChange = (actorId, field, value) => {
    setSelectedCast(selectedCast.map(c => 
      c.ACTOR_ID === actorId ? { ...c, [field]: value } : c
    ));
  };

  const saveCast = async () => {
    try {
      const token = localStorage.getItem('token');
      const castData = selectedCast.map(c => ({
        actorId: c.ACTOR_ID,
        roleName: c.ROLE_NAME,
        description: c.ROLE_DESCRIPTION
      }));
      
      await axios.put(`${BASE_URL}/admin/shows/${id}/cast`, {
        cast: castData
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Cast saved successfully');
    } catch (error) {
      console.error('Error saving cast:', error);
      throw error;
    }
  };

  // Director management functions
  const fetchDirectors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/directors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const transformedDirectors = response.data.map(director => ({
        id: director.DIRECTOR_ID,
        name: `${director.DIRECTOR_FIRSTNAME} ${director.DIRECTOR_LASTNAME}`,
        picture: director.PICTURE
      }));
      
      setAllDirectors(transformedDirectors);
    } catch (error) {
      console.error('Error fetching directors:', error);
      setAllDirectors([]);
    }
  };

  const fetchSelectedDirectors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/admin/shows/${id}/directors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Transform the data to match the expected format
      const transformedDirectors = response.data.map(director => ({
        DIRECTOR_ID: director.DIRECTOR_ID,
        NAME: `${director.DIRECTOR_FIRSTNAME} ${director.DIRECTOR_LASTNAME}`,
        PICTURE: director.PICTURE
      }));
      
      setSelectedDirectors(transformedDirectors);
    } catch (error) {
      console.error('Error fetching show directors:', error);
      setSelectedDirectors([]);
    }
  };

  const handleAddDirector = (directorId) => {
    const director = allDirectors.find(d => d.id === parseInt(directorId));
    if (director && !selectedDirectors.find(d => d.DIRECTOR_ID === director.id)) {
      const newDirectorMember = {
        DIRECTOR_ID: director.id,
        NAME: director.name,
        PICTURE: director.picture
      };
      setSelectedDirectors([...selectedDirectors, newDirectorMember]);
    }
  };

  const handleRemoveDirector = (directorId) => {
    setSelectedDirectors(selectedDirectors.filter(d => d.DIRECTOR_ID !== directorId));
  };

  const saveDirectors = async () => {
    try {
      const token = localStorage.getItem('token');
      const directorsData = selectedDirectors.map(d => ({
        directorId: d.DIRECTOR_ID
      }));
      
      await axios.put(`${BASE_URL}/admin/shows/${id}/directors`, {
        directors: directorsData
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Directors saved successfully');
    } catch (error) {
      console.error('Error saving directors:', error);
      throw error;
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
      
      await axios.put(`${BASE_URL}/episode/${selectedEpisode.SHOW_EPISODE_ID}`, {
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

              {/* Genres Section */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Genres</label>
                
                {/* Genre Dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddGenre(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    outline: 'none',
                    marginBottom: '15px'
                  }}
                >
                  <option value="" style={{ background: '#333', color: 'white' }}>Add Genre</option>
                  {allGenres
                    .filter(genre => !selectedGenres.some(sg => sg.GENRE_ID === genre.GENRE_ID))
                    .map(genre => (
                    <option key={genre.GENRE_ID} value={genre.GENRE_ID} style={{ background: '#333', color: 'white' }}>
                      {genre.GENRE_NAME}
                    </option>
                  ))}
                </select>

                {/* Selected Genres */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '10px',
                  minHeight: '50px',
                  padding: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)'
                }}>
                  {selectedGenres.length === 0 ? (
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', alignSelf: 'center' }}>
                      No genres selected
                    </span>
                  ) : (
                    selectedGenres.map(genre => (
                      <span
                        key={genre.GENRE_ID}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(74, 144, 226, 0.8)',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {genre.GENRE_NAME}
                        <FiX
                          style={{ 
                            cursor: 'pointer', 
                            fontSize: '16px',
                            opacity: 0.8
                          }}
                          onClick={() => handleRemoveGenre(genre.GENRE_ID)}
                          onMouseEnter={(e) => e.target.style.opacity = 1}
                          onMouseLeave={(e) => e.target.style.opacity = 0.8}
                        />
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cast Management Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Cast Management</h2>
            
            {/* Actor Dropdown */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Add Actor</label>
              
              {/* Custom Dropdown */}
              <div style={{ position: 'relative' }} className="actor-dropdown-container">
                <button
                  type="button"
                  onClick={() => setShowActorDropdown(!showActorDropdown)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    outline: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  Select Actor to Add
                  <span style={{ transform: showActorDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </button>

                {showActorDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: 'rgba(51, 51, 51, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginTop: '5px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    {allActors
                      .filter(actor => !selectedCast.some(c => c.ACTOR_ID === actor.id))
                      .map(actor => (
                      <div
                        key={actor.id}
                        onClick={() => {
                          handleAddCast(actor.id);
                          setShowActorDropdown(false);
                        }}
                        style={{
                          padding: '12px 15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.1)',
                          flexShrink: 0
                        }}>
                          <img
                            src={actor.picture ? `${BASE_URL}/actors/${actor.picture}` : `${BASE_URL}/actors/placeholder.jpg`}
                            alt={actor.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = `${BASE_URL}/actors/placeholder.jpg`;
                            }}
                          />
                        </div>
                        <span style={{ color: 'white', fontSize: '14px' }}>
                          {actor.name}
                        </span>
                      </div>
                    ))}
                    
                    {allActors.filter(actor => !selectedCast.some(c => c.ACTOR_ID === actor.id)).length === 0 && (
                      <div style={{
                        padding: '15px',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px'
                      }}>
                        No actors available to add
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cast List */}
            <div style={{ 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              minHeight: '100px'
            }}>
              {selectedCast.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  padding: '40px 0' 
                }}>
                  No cast members added yet
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {selectedCast.map(castMember => (
                    <div
                      key={castMember.ACTOR_ID}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 200px 1fr 1fr 40px',
                        gap: '15px',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Actor Photo */}
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.1)'
                      }}>
                        <img
                          src={castMember.PICTURE ? `${BASE_URL}/actors/${castMember.PICTURE}` : `${BASE_URL}/actors/placeholder.jpg`}
                          alt={castMember.NAME}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.src = `${BASE_URL}/actors/placeholder.jpg`;
                          }}
                        />
                      </div>

                      {/* Actor Name */}
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {castMember.NAME}
                      </div>

                      {/* Role Name Input */}
                      <input
                        type="text"
                        placeholder="Role/Character name"
                        value={castMember.ROLE_NAME}
                        onChange={(e) => handleCastRoleChange(castMember.ACTOR_ID, 'ROLE_NAME', e.target.value)}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />

                      {/* Role Description Input */}
                      <input
                        type="text"
                        placeholder="Role description (optional)"
                        value={castMember.ROLE_DESCRIPTION}
                        onChange={(e) => handleCastRoleChange(castMember.ACTOR_ID, 'ROLE_DESCRIPTION', e.target.value)}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveCast(castMember.ACTOR_ID)}
                        style={{
                          background: 'rgba(255, 71, 87, 0.8)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 71, 87, 1)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 71, 87, 0.8)'}
                      >
                        <FiX size={16} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.form>

        {/* Director Management Section */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            marginTop: '40px'
          }}
        >
          {/* Director Management Section */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'white' }}>Director Management</h2>
            
            {/* Director Dropdown */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'white' }}>Add Director</label>
              
              {/* Custom Dropdown */}
              <div style={{ position: 'relative' }} className="director-dropdown-container">
                <button
                  type="button"
                  onClick={() => setShowDirectorDropdown(!showDirectorDropdown)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    outline: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  Select Director to Add
                  <span style={{ transform: showDirectorDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </button>

                {showDirectorDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: 'rgba(51, 51, 51, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginTop: '5px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    {allDirectors
                      .filter(director => !selectedDirectors.some(d => d.DIRECTOR_ID === director.id))
                      .map(director => (
                      <div
                        key={director.id}
                        onClick={() => {
                          handleAddDirector(director.id);
                          setShowDirectorDropdown(false);
                        }}
                        style={{
                          padding: '12px 15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.1)',
                          flexShrink: 0
                        }}>
                          <img
                            src={director.picture ? `${BASE_URL}/directors/${director.picture}` : `${BASE_URL}/directors/placeholder.jpg`}
                            alt={director.name}
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
                        <span style={{ color: 'white', fontSize: '14px' }}>
                          {director.name}
                        </span>
                      </div>
                    ))}
                    
                    {allDirectors.filter(director => !selectedDirectors.some(d => d.DIRECTOR_ID === director.id)).length === 0 && (
                      <div style={{
                        padding: '15px',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px'
                      }}>
                        No directors available to add
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Directors List */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '1.1rem' }}>Selected Directors</h3>
              
              {selectedDirectors.length === 0 ? (
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  No directors selected. Add directors using the dropdown above.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {selectedDirectors.map((directorMember, index) => (
                    <div
                      key={`${directorMember.DIRECTOR_ID}-${index}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr auto',
                        gap: '15px',
                        alignItems: 'center',
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Director Image */}
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.1)'
                      }}>
                        <img
                          src={directorMember.PICTURE ? `${BASE_URL}/directors/${directorMember.PICTURE}` : '/directors/placeholder.jpg'}
                          alt={directorMember.NAME}
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

                      {/* Director Name */}
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {directorMember.NAME}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveDirector(directorMember.DIRECTOR_ID)}
                        style={{
                          background: 'rgba(255, 71, 87, 0.8)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 71, 87, 1)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 71, 87, 0.8)'}
                      >
                        <FiX size={16} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
