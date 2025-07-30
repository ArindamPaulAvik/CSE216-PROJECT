import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiEye, FiEdit3, FiStar, FiCalendar, FiClock } from 'react-icons/fi';
import axios from 'axios';

function ShowsManagement() {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = 'https://cse216-project.onrender.com';

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    const filtered = shows.filter(show =>
      show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.year.toString().includes(searchTerm) ||
      show.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (show.category && show.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (show.publisher && show.publisher.toLowerCase().includes(searchTerm.toLowerCase())) ||
      show.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredShows(filtered);
  }, [searchTerm, shows]);

  // Helper function to get image path like in user frontpage
  const getImagePath = (thumbnail) => {
    if (!thumbnail) return `${BASE_URL}/shows/placeholder.jpg`;
    return `${BASE_URL}/shows/${thumbnail}`;
  };

  const handleImageError = (e, showTitle, thumbnail) => {
    console.error(`Image error for ${showTitle}`, thumbnail);
    e.target.src = '/placeholder.jpg';
  };

  const fetchShows = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/admin/shows`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Transform the data to match the expected format
      const transformedShows = response.data.map(show => ({
        id: show.id,
        title: show.title,
        genre: show.genre || 'Unknown',
        year: show.year,
        rating: parseFloat(show.rating) || 0,
        status: show.status || 'Unknown',
        seasons: parseInt(show.seasons) || 0,
        episodes: parseInt(show.episodes) || 0,
        poster: show.poster,
        description: show.description || 'No description available.',
        category: show.category,
        publisher: show.publisher,
        age_restriction: show.age_restriction
      }));
      
      setShows(transformedShows);
      setFilteredShows(transformedShows);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching shows:', error);
      setError('Failed to load shows. Please check your connection and try again.');
      // Fallback to empty array on error
      setShows([]);
      setFilteredShows([]);
      setLoading(false);
    }
  };

  const handleShowClick = (showId) => {
    navigate(`/admin-show-details/${showId}`);
  };

  const handleBack = () => {
    navigate('/content-admin-frontpage');
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
          <div>Loading shows from database...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⚠️</div>
          <div style={{ marginBottom: '20px' }}>{error}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchShows();
            }}
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Retry
          </motion.button>
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
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          gap: '20px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1', minWidth: '300px' }}>
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
              gap: '8px',
              flexShrink: 0
            }}
          >
            <FiArrowLeft size={20} />
            Back
          </motion.button>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '700' }}>Shows Management</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Manage and review all shows</p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px', minWidth: '200px' }}>
          <FiSearch
            size={20}
            style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.7
            }}
          />
          <input
            type="text"
            placeholder="Search shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px 12px 45px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={{ padding: '20px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
              {shows.length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Shows</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#4caf50' }}>
              {shows.filter(s => s.status === 'Completed').length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Completed</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ff9800' }}>
              {shows.filter(s => s.status === 'Ongoing').length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Ongoing</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#f093fb' }}>
              {filteredShows.length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Search Results</p>
          </div>
        </motion.div>

        {/* Shows Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredShows.map((show, index) => (
            <motion.div
              key={show.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => handleShowClick(show.id)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {/* Poster Section */}
              <div style={{
                height: '280px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={getImagePath(show.poster)}
                  alt={show.title}
                  onError={(e) => handleImageError(e, show.title, show.poster)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
                
                {/* Rating Badge */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: '12px',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  zIndex: 2
                }}>
                  <FiStar size={12} style={{ color: '#ffd700' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>{show.rating}</span>
                </div>
                
                {/* Gradient overlay for better text readability */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50px',
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                  zIndex: 1
                }} />
              </div>

              {/* Content Section */}
              <div style={{ padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '0.9rem', 
                    fontWeight: '700',
                    color: '#e0e0e0',
                    lineHeight: '1.2'
                  }}>
                    {show.title}
                  </h3>
                  <span style={{
                    background: show.status === 'Completed' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                    color: show.status === 'Completed' ? '#4caf50' : '#ff9800',
                    padding: '2px 4px',
                    borderRadius: '6px',
                    fontSize: '9px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>
                    {show.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', opacity: 0.8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <FiCalendar size={10} />
                    <span style={{ fontSize: '10px' }}>{show.year}</span>
                  </div>
                  {show.category && show.category.toLowerCase() !== 'movie' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <FiClock size={10} />
                      <span style={{ fontSize: '10px' }}>{show.seasons}S • {show.episodes}E</span>
                    </div>
                  )}
                </div>

                <p style={{ 
                  opacity: 0.7, 
                  margin: '0 0 8px 0', 
                  fontSize: '10px',
                  lineHeight: '1.2',
                  height: '24px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {show.description}
                </p>

                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {show.genre.split(', ').slice(0, 2).map((g, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '2px 4px',
                        borderRadius: '8px',
                        fontSize: '8px',
                        fontWeight: '500'
                      }}
                    >
                      {g}
                    </span>
                  ))}
                  {show.genre.split(', ').length > 2 && (
                    <span style={{
                      color: 'white',
                      fontSize: '8px',
                      opacity: 0.7
                    }}>
                      +{show.genre.split(', ').length - 2}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowClick(show.id);
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      border: 'none',
                      color: 'white',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <FiEye size={12} />
                    View
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit functionality
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '6px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiEdit3 size={12} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredShows.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '60px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', opacity: 0.8 }}>No shows found</h3>
            <p style={{ margin: 0, opacity: 0.6 }}>Try adjusting your search criteria</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default ShowsManagement;
