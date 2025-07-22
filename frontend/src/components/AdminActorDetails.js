import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiTrash2,
  FiFilm,
  FiUser,
  FiCalendar,
  FiAward
} from 'react-icons/fi';
import axios from 'axios';

function AdminActorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchActorDetails();
  }, [id]);

  // Helper function to get image path
  const getImagePath = (picture) => {
    if (!picture) return '/actors/placeholder.jpg';
    return `/actors/${picture}`;
  };

  const handleImageError = (e, actorName, picture) => {
    console.error(`Image error for ${actorName}`, picture);
    e.target.src = '/actors/placeholder.jpg';
  };

  const fetchActorDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/actors/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const actorData = response.data;
      
      // Transform the data to match the expected format
      const transformedActor = {
        id: id,
        name: actorData.NAME,
        biography: actorData.BIOGRAPHY || 'No biography available.',
        picture: actorData.PICTURE,
        shows: actorData.SHOWS || [],
        statistics: {
          totalShows: actorData.SHOWS?.length || 0,
          totalRoles: actorData.SHOWS?.length || 0, // Assuming one role per show for now
          averageRating: actorData.SHOWS?.length > 0 ? 
            (actorData.SHOWS.reduce((sum, show) => sum + (show.rating || 0), 0) / actorData.SHOWS.length).toFixed(1) : 0,
          yearsActive: actorData.YEARS_ACTIVE || 'N/A'
        }
      };
      
      setActor(transformedActor);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching actor details:', error);
      setActor(null);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/actors-management');
  };

  const handleEdit = () => {
    navigate(`/edit-actor/${actor.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${actor.name}? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/admin/actors/${actor.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        alert('Actor deleted successfully');
        navigate('/actors-management');
      } catch (error) {
        console.error('Error deleting actor:', error);
        alert('Failed to delete actor. Please try again.');
      }
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
        Loading actor details...
      </div>
    );
  }

  if (!actor) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        Actor not found
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
            Back to Actors
          </motion.button>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>{actor.name}</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Actor Details & Management</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEdit}
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              border: 'none',
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
            <FiEdit3 size={16} />
            Edit Actor
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            style={{
              background: 'rgba(255, 71, 87, 0.2)',
              border: '1px solid rgba(255, 71, 87, 0.5)',
              color: '#ff4757',
              padding: '10px 20px',
              borderRadius: '8px',
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
      <main style={{ padding: '40px' }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '50%',
            transform: 'translate(100px, -100px)'
          }} />
          
          <div style={{ display: 'flex', gap: '40px', position: 'relative', zIndex: 2 }}>
            {/* Profile Picture */}
            <div style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              position: 'relative',
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

            {/* Details */}
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '3rem', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #e0e0e0 0%, #b0b0b0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {actor.name}
              </h1>

              <div style={{ display: 'flex', gap: '30px', marginBottom: '25px', opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiFilm size={18} />
                  <span style={{ fontSize: '16px' }}>{actor.statistics.totalShows} Shows</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiUser size={18} />
                  <span style={{ fontSize: '16px' }}>{actor.statistics.totalRoles} Roles</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiCalendar size={18} />
                  <span style={{ fontSize: '16px' }}>Active {actor.statistics.yearsActive}</span>
                </div>
              </div>

              <p style={{ 
                fontSize: '16px', 
                lineHeight: '1.6', 
                opacity: 0.9,
                margin: '0 0 25px 0'
              }}>
                {actor.biography}
              </p>
            </div>
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
            {['overview', 'filmography'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  background: activeTab === tab ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                  border: 'none',
                  color: activeTab === tab ? 'white' : 'white',
                  padding: '20px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  fontSize: '16px'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '30px' }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Biography</h3>
                <p style={{ lineHeight: '1.6', opacity: 0.9, marginBottom: '20px' }}>
                  {actor.biography}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <h4 style={{ marginBottom: '10px', color: 'white' }}>Full Name</h4>
                    <p style={{ margin: 0, opacity: 0.8 }}>{actor.name}</p>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '10px', color: 'white' }}>Total Shows</h4>
                    <p style={{ margin: 0, opacity: 0.8 }}>{actor.statistics.totalShows}</p>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '10px', color: 'white' }}>Years Active</h4>
                    <p style={{ margin: 0, opacity: 0.8 }}>{actor.statistics.yearsActive}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'filmography' && (
              <div>
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Shows & Movies</h3>
                {actor.shows && actor.shows.length > 0 ? (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {actor.shows.map((show, index) => (
                      <div
                        key={show.SHOW_ID || index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(`/admin-show-details/${show.SHOW_ID}`)}
                      >
                        <div style={{
                          width: '60px',
                          height: '80px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(255, 255, 255, 0.1)'
                        }}>
                          <img
                            src={`/shows/${show.THUMBNAIL}`}
                            alt={show.TITLE}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = '/shows/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{show.TITLE}</h4>
                          <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
                            Click to view show details
                          </p>
                        </div>
                        <FiFilm size={20} style={{ opacity: 0.5 }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '40px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    opacity: 0.7
                  }}>
                    <p style={{ margin: 0, fontSize: '16px' }}>No shows available for this actor.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default AdminActorDetails;
