import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiEye, FiEdit3, FiPlus, FiAward, FiUsers } from 'react-icons/fi';
import axios from 'axios';

function AwardsManagement() {
  const navigate = useNavigate();
  const [awards, setAwards] = useState([]);
  const [filteredAwards, setFilteredAwards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    fetchAwards();
  }, []);

  useEffect(() => {
    filterAwards();
  }, [searchTerm, awards]);

  const fetchAwards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/awards`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const awardsData = response.data.map(award => ({
        id: award.AWARD_ID,
        name: award.AWARD_NAME,
        awardingBody: award.AWARDING_BODY,
        description: award.DESCRIPTION || 'No description available.',
        image: award.IMG,
        recipientCount: award.RECIPIENT_COUNT || 0
      }));
      
      setAwards(awardsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching awards:', error);
      setError('Failed to fetch awards');
      setLoading(false);
    }
  };

  const filterAwards = () => {
    if (!searchTerm) {
      setFilteredAwards(awards);
      return;
    }

    const filtered = awards.filter(award =>
      award.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.awardingBody.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAwards(filtered);
  };

  const handleBack = () => {
    navigate('/content-admin-frontpage');
  };

  const handleAwardClick = (awardId) => {
    navigate(`/admin-award-details/${awardId}`);
  };

  const handleEditClick = (e, awardId) => {
    e.stopPropagation();
    navigate(`/edit-award/${awardId}`);
  };

  const handleAddAward = () => {
    navigate('/add-award');
  };

  const getImagePath = (image) => {
    if (!image) return `${BASE_URL}/placeholder-award.jpg`;
    return `${BASE_URL}/awards/${image}`;
  };

  const handleImageError = (e, awardName, image) => {
    console.error(`Image error for ${awardName}`, image);
    e.target.src = '/placeholder-award.jpg';
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
          <div>Loading awards...</div>
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

  const totalRecipients = awards.reduce((sum, award) => sum + award.recipientCount, 0);

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
            <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '700' }}>Awards Management</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Manage and review all awards</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddAward}
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
          Add Award
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
            placeholder="Search awards..."
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
              {awards.length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Awards</p>
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
              {totalRecipients}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Recipients</p>
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
              {filteredAwards.length}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Search Results</p>
          </div>
        </motion.div>

        {/* Awards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredAwards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => handleAwardClick(award.id)}
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
              {/* Award Image */}
              <div style={{
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={getImagePath(award.image)}
                  alt={award.name}
                  onError={(e) => handleImageError(e, award.name, award.image)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
                
                {/* Recipients Count Badge */}
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
                  <FiUsers size={12} style={{ color: '#2ed573' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>{award.recipientCount}</span>
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

              {/* Award Info */}
              <div style={{ padding: '16px' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '1.1rem', 
                  fontWeight: '700',
                  color: '#e0e0e0',
                  lineHeight: '1.2'
                }}>
                  {award.name}
                </h3>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '8px',
                  opacity: 0.8 
                }}>
                  <FiAward size={12} style={{ color: '#ffd700' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>
                    {award.awardingBody}
                  </span>
                </div>

                <p style={{ 
                  opacity: 0.7, 
                  margin: '0 0 12px 0', 
                  fontSize: '12px',
                  lineHeight: '1.3',
                  height: '36px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {award.description}
                </p>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAwardClick(award.id);
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(45deg, #2ed573, #00b894)',
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
                      gap: '4px'
                    }}
                  >
                    <FiEye size={14} />
                    View
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleEditClick(e, award.id)}
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

        {filteredAwards.length === 0 && (
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
            <h3 style={{ margin: '0 0 10px 0', opacity: 0.8 }}>No awards found</h3>
            <p style={{ margin: 0, opacity: 0.6 }}>Try adjusting your search criteria</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default AwardsManagement;
