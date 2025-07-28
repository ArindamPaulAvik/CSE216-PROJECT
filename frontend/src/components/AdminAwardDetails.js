import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiTrash2,
  FiAward,
  FiUsers,
  FiCalendar,
  FiStar,
  FiEye
} from 'react-icons/fi';
import axios from 'axios';

function AdminAwardDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [award, setAward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';


  useEffect(() => {
    fetchAwardDetails();
  }, [id]);

  const getImagePath = (image) => {
    if (!image) return '/placeholder-award.jpg';
    return `${BASE_URL}/awards/${image}`;
  };

  const handleImageError = (e, awardName, image) => {
    console.error(`Image error for ${awardName}`, image);
    e.target.src = '/placeholder-award.jpg';
  };

  const fetchAwardDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/awards/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const awardData = response.data;
      console.log('Award data from backend:', awardData);
      
      // Transform the data to match the expected format
      const transformedAward = {
        id: awardData.AWARD_ID,
        name: awardData.AWARD_NAME,
        awardingBody: awardData.AWARDING_BODY,
        description: awardData.DESCRIPTION || 'No description available.',
        image: awardData.IMG,
        recipients: {
          actors: awardData.ACTORS || [],
          directors: awardData.DIRECTORS || [],
          shows: awardData.SHOWS || []
        },
        statistics: {
          totalRecipients: (awardData.ACTORS ? awardData.ACTORS.length : 0) + 
                          (awardData.DIRECTORS ? awardData.DIRECTORS.length : 0) + 
                          (awardData.SHOWS ? awardData.SHOWS.length : 0),
          actorRecipients: awardData.ACTORS ? awardData.ACTORS.length : 0,
          directorRecipients: awardData.DIRECTORS ? awardData.DIRECTORS.length : 0,
          showRecipients: awardData.SHOWS ? awardData.SHOWS.length : 0
        }
      };
      
      console.log('Transformed award:', transformedAward);
      setAward(transformedAward);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching award details:', error);
      setAward(null);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/awards-management');
  };

  const handleEdit = () => {
    navigate(`/edit-award/${award.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this award? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_URL}/awards/${award.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        navigate('/awards-management');
      } catch (error) {
        console.error('Error deleting award:', error);
        alert('Failed to delete award. Please try again.');
      }
    }
  };

  const handleRecipientClick = (type, id) => {
    if (type === 'actor') {
      navigate(`/admin-actor-details/${id}`);
    } else if (type === 'director') {
      navigate(`/admin-director-details/${id}`);
    } else if (type === 'show') {
      navigate(`/admin-show-details/${id}`);
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
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🏆</div>
          <div>Loading award details...</div>
        </div>
      </div>
    );
  }

  if (!award) {
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
          <div>Award not found</div>
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
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>Award Details</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>View and manage award information</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEdit}
            style={{
              background: 'linear-gradient(45deg, #2ed573, #00b894)',
              border: 'none',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiEdit3 size={16} />
            Edit
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            style={{
              background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
              border: 'none',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiTrash2 size={16} />
            Delete
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
            marginBottom: '30px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', minHeight: '300px' }}>
            {/* Award Image */}
            <div style={{ 
              width: '300px', 
              position: 'relative',
              flexShrink: 0
            }}>
              <img
                src={getImagePath(award.image)}
                alt={award.name}
                onError={(e) => handleImageError(e, award.name, award.image)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Award Info */}
            <div style={{ 
              flex: 1, 
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{
                  margin: '0 0 10px 0',
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #e0e0e0 0%, #b0b0b0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {award.name}
                </h1>
                <span style={{
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: '#ffd700',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {award.awardingBody}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '30px', marginBottom: '20px', opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiUsers size={18} />
                  <span style={{ fontSize: '16px' }}>{award.statistics.totalRecipients} Recipients</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiAward size={18} style={{ color: '#ffd700' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>Prestigious Award</span>
                </div>
              </div>

              <p style={{ 
                fontSize: '16px', 
                lineHeight: '1.6', 
                opacity: 0.9,
                margin: '0 0 25px 0'
              }}>
                {award.description}
              </p>

              <div style={{ display: 'flex', gap: '15px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
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
                    gap: '8px'
                  }}
                >
                  <FiEdit3 size={16} />
                  Edit Award
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
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
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#2ed573' }}>
              {award.statistics.totalRecipients}
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
              {award.statistics.actorRecipients}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Actor Recipients</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ffd700' }}>
              {award.statistics.directorRecipients}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Director Recipients</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ff6b6b' }}>
              {award.statistics.showRecipients}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Show Recipients</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          }}
        >
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {[
              { id: 'overview', label: 'Overview', icon: FiEye },
              { id: 'recipients', label: 'Recipients', icon: FiUsers }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '15px 20px',
                    background: activeTab === tab.id ? 'rgba(46, 213, 115, 0.2)' : 'transparent',
                    border: 'none',
                    color: activeTab === tab.id ? '#2ed573' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderBottom: activeTab === tab.id ? '2px solid #2ed573' : '2px solid transparent'
                  }}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '30px' }}>
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  <div>
                    <h4 style={{ marginBottom: '15px', color: 'white' }}>Award Information</h4>
                    <div style={{ space: '10px' }}>
                      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.8 }}>Award Name:</span>
                        <span style={{ fontWeight: '600' }}>{award.name}</span>
                      </div>
                      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.8 }}>Awarding Body:</span>
                        <span style={{ fontWeight: '600' }}>{award.awardingBody}</span>
                      </div>
                      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.8 }}>Total Recipients:</span>
                        <span style={{ fontWeight: '600' }}>{award.statistics.totalRecipients}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ marginBottom: '15px', color: 'white' }}>Description</h4>
                    <p style={{ opacity: 0.8, lineHeight: '1.6', margin: 0 }}>
                      {award.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'recipients' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Actors Section */}
                {award.recipients.actors.length > 0 && (
                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ marginBottom: '15px', color: 'white' }}>Actor Recipients</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                      {award.recipients.actors.map((actor) => (
                        <motion.div
                          key={actor.ACTOR_ID}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleRecipientClick('actor', actor.ACTOR_ID)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px',
                            padding: '15px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer'
                          }}
                        >
                          <h5 style={{ margin: '0 0 5px 0', color: 'white' }}>
                            {actor.NAME}
                          </h5>
                          <p style={{ margin: 0, opacity: 0.7, fontSize: '12px' }}>
                            Actor
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Directors Section */}
                {award.recipients.directors.length > 0 && (
                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ marginBottom: '15px', color: 'white' }}>Director Recipients</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                      {award.recipients.directors.map((director) => (
                        <motion.div
                          key={director.DIRECTOR_ID}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleRecipientClick('director', director.DIRECTOR_ID)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px',
                            padding: '15px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer'
                          }}
                        >
                          <h5 style={{ margin: '0 0 5px 0', color: 'white' }}>
                            {director.NAME}
                          </h5>
                          <p style={{ margin: 0, opacity: 0.7, fontSize: '12px' }}>
                            Director
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shows Section */}
                {award.recipients.shows.length > 0 && (
                  <div>
                    <h4 style={{ marginBottom: '15px', color: 'white' }}>Show Recipients</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                      {award.recipients.shows.map((show) => (
                        <motion.div
                          key={show.SHOW_ID}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleRecipientClick('show', show.SHOW_ID)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px',
                            padding: '15px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer'
                          }}
                        >
                          <h5 style={{ margin: '0 0 5px 0', color: 'white' }}>
                            {show.TITLE}
                          </h5>
                          <p style={{ margin: 0, opacity: 0.7, fontSize: '12px' }}>
                            Show • {show.RATING}/10
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {award.statistics.totalRecipients === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
                    <FiUsers size={48} style={{ marginBottom: '15px' }} />
                    <p>No recipients found for this award</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default AdminAwardDetails;
