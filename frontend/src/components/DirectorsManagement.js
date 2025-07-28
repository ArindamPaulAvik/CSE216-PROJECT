import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiEye, FiEdit3, FiPlus, FiUsers, FiFilm } from 'react-icons/fi';
import axios from 'axios';

function DirectorsManagement() {
  const navigate = useNavigate();
  const [directors, setDirectors] = useState([]);
  const [filteredDirectors, setFilteredDirectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';

  useEffect(() => {
    fetchDirectors();
  }, []);

  useEffect(() => {
    filterDirectors();
  }, [searchTerm, directors]);

  const fetchDirectors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/directors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const directorsData = response.data.map(director => ({
        id: director.DIRECTOR_ID,
        firstName: director.DIRECTOR_FIRSTNAME,
        lastName: director.DIRECTOR_LASTNAME,
        name: `${director.DIRECTOR_FIRSTNAME} ${director.DIRECTOR_LASTNAME}`,
        biography: director.DIRECTOR_BIOGRAPHY || 'No biography available.',
        picture: director.PICTURE,
        showCount: director.SHOW_COUNT || 0
      }));
      
      setDirectors(directorsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching directors:', error);
      setError('Failed to fetch directors');
      setLoading(false);
    }
  };

  const filterDirectors = () => {
    if (!searchTerm) {
      setFilteredDirectors(directors);
      return;
    }

    const filtered = directors.filter(director =>
      director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      director.biography.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDirectors(filtered);
  };

  const handleBack = () => {
    navigate('/content-admin-frontpage');
  };

  const handleDirectorClick = (directorId) => {
    navigate(`/admin-director-details/${directorId}`);
  };

  const handleEditClick = (e, directorId) => {
    e.stopPropagation();
    navigate(`/edit-director/${directorId}`);
  };

  const handleAddDirector = () => {
    navigate('/edit-director/new');
  };

  const getImagePath = (picture) => {
    if (!picture) return `${BASE_URL}/placeholder-director.jpg`;
    return `${BASE_URL}/directors/${picture}`;
  };

  const handleImageError = (e, directorName, picture) => {
    console.error(`Image error for ${directorName}`, picture);
    e.target.src = '/placeholder-director.jpg';
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
          <div>Loading directors...</div>
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
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⚠️</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  const totalCredits = directors.reduce((sum, director) => sum + director.showCount, 0);

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
            <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '700' }}>Directors Management</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Manage and review all directors</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddDirector}
          style={{
            background: 'linear-gradient(45deg, #2ed573, #00b894)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <FiPlus size={18} />
          Add Director
        </motion.button>

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
            placeholder="Search directors..."
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
        {/* Statistics */}
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
              {directors.length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Directors</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#2ed573' }}>
              {totalCredits}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Credits</p>
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
              {filteredDirectors.length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Search Results</p>
          </div>
        </motion.div>

        {/* Directors Grid */}
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
          {filteredDirectors.map((director, index) => (
            <motion.div
              key={director.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => handleDirectorClick(director.id)}
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
              {/* Director Image */}
              <div style={{
                height: '280px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={getImagePath(director.picture)}
                  alt={director.name}
                  onError={(e) => handleImageError(e, director.name, director.picture)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
                
                {/* Shows Count Badge */}
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
                  <FiFilm size={12} style={{ color: '#2ed573' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>{director.showCount}</span>
                </div>
                
                {/* Gradient Overlay */}
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

              {/* Director Info */}
              <div style={{ padding: '12px' }}>
                <h3 style={{ 
                  margin: '0 0 6px 0', 
                  fontSize: '1rem', 
                  fontWeight: '700',
                  color: '#e0e0e0',
                  lineHeight: '1.2'
                }}>
                  {director.name}
                </h3>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', opacity: 0.8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <FiFilm size={10} />
                    <span style={{ fontSize: '10px' }}>{director.showCount} Shows</span>
                  </div>
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
                  {director.biography}
                </p>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectorClick(director.id);
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(45deg, #2ed573, #00b894)',
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
                    onClick={(e) => handleEditClick(e, director.id)}
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

        {filteredDirectors.length === 0 && (
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
            <h3 style={{ margin: '0 0 10px 0', opacity: 0.8 }}>No directors found</h3>
            <p style={{ margin: 0, opacity: 0.6 }}>Try adjusting your search criteria</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default DirectorsManagement;
