import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiEye, FiEdit3, FiPlus, FiUsers, FiFilm } from 'react-icons/fi';
import axios from 'axios';

function ActorsManagement() {
  const navigate = useNavigate();
  const [actors, setActors] = useState([]);
  const [filteredActors, setFilteredActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = 'https://cse216-project.onrender.com';


  useEffect(() => {
    fetchActors();
  }, []);

  useEffect(() => {
    const filtered = actors.filter(actor =>
      (actor.name && actor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actor.biography && actor.biography.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredActors(filtered);
  }, [searchTerm, actors]);

  // Helper function to get image path
  const getImagePath = (picture) => {
    if (!picture) return `${BASE_URL}/actors/placeholder.jpg`;
    return `${BASE_URL}/actors/${picture}`;
  };

  const handleImageError = (e, actorName, picture) => {
    console.error(`Image error for ${actorName}`, picture);
    e.target.src = '${BASE_URL}/actors/placeholder.jpg';
  };

  const fetchActors = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching actors with token:', token ? 'Present' : 'Missing');
      
      const response = await axios.get(`${BASE_URL}/actors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API response received:', response.status);
      console.log('Raw response data:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }
      
      // Transform the data to match the expected format
      const transformedActors = response.data.map(actor => {
        console.log('Processing actor:', actor);
        const name = actor.NAME || `${actor.ACTOR_FIRSTNAME || ''} ${actor.ACTOR_LASTNAME || ''}`.trim() || 'Unknown Actor';
        return {
          id: actor.ACTOR_ID,
          name: name,
          picture: actor.PICTURE,
          biography: actor.BIOGRAPHY || 'No biography available.',
          showCount: actor.SHOW_COUNT || 0
        };
      });
      
      console.log(`Successfully processed ${transformedActors.length} actors`);
      console.log('First actor sample:', transformedActors[0]);
      
      setActors(transformedActors);
      setFilteredActors(transformedActors);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching actors:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(`Failed to load actors: ${error.response?.data?.error || error.message}`);
      setActors([]);
      setFilteredActors([]);
      setLoading(false);
    }
  };

  const handleActorClick = (actorId) => {
    navigate(`/admin-actor-details/${actorId}`);
  };

  const handleBack = () => {
    navigate('/content-admin-frontpage');
  };

  const handleAddActor = () => {
    navigate('/add-actor');
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
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>👥</div>
          <div>Loading actors from database...</div>
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
              fetchActors();
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
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Actors Management</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Manage cast and crew members</p>
          </div>
        </div>

        {/* Search Bar and Add Button */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddActor}
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
            Add Actor
          </motion.button>

          <div style={{ position: 'relative', width: '280px', marginRight: '60px' }}>
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
              placeholder="Search actors..."
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
                outline: 'none'
              }}
            />
          </div>
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
            <FiUsers size={24} style={{ marginBottom: '10px', color: 'white' }} />
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
              {actors.length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Actors</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <FiFilm size={24} style={{ marginBottom: '10px', color: '#4caf50' }} />
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#4caf50' }}>
              {actors.reduce((total, actor) => total + (actor.showCount || 0), 0)}
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
              {filteredActors.length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Search Results</p>
          </div>
        </motion.div>

        {/* Actors Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredActors.map((actor, index) => (
            <motion.div
              key={actor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => handleActorClick(actor.id)}
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
              {/* Profile Section */}
              <div style={{
                height: '200px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid rgba(255, 255, 255, 0.2)',
                  background: 'white'
                }}>
                  <img
                    src={getImagePath(actor.picture)}
                    alt={actor.name}
                    onError={(e) => handleImageError(e, actor.name, actor.picture)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>

              {/* Content Section */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '1.2rem', 
                  fontWeight: '700',
                  color: '#e0e0e0',
                  textAlign: 'center'
                }}>
                  {actor.name || 'Unknown Actor'}
                </h3>

                <p style={{ 
                  opacity: 0.7, 
                  margin: '0 0 15px 0', 
                  fontSize: '14px',
                  lineHeight: '1.4',
                  height: '42px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  textAlign: 'center'
                }}>
                  {actor.biography}
                </p>

                <div style={{ 
                  textAlign: 'center',
                  marginBottom: '15px',
                  opacity: 0.8
                }}>
                  <span style={{ fontSize: '12px' }}>
                    {actor.showCount || 0} show{(actor.showCount || 0) !== 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActorClick(actor.id);
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      border: 'none',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FiEye size={14} />
                    View Details
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-actor/${actor.id}`);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiEdit3 size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredActors.length === 0 && (
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
            <h3 style={{ margin: '0 0 10px 0', opacity: 0.8 }}>No actors found</h3>
            <p style={{ margin: 0, opacity: 0.6 }}>Try adjusting your search criteria</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default ActorsManagement;
