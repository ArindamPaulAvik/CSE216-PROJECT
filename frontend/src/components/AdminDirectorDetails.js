import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiTrash2,
  FiFilm,
  FiStar,
  FiUsers,
  FiCalendar,
  FiAward,
  FiEye,
  FiHeart
} from 'react-icons/fi';
import axios from 'axios';

function AdminDirectorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const BASE_URL = 'https://cse216-project.onrender.com';


  useEffect(() => {
    fetchDirectorDetails();
  }, [id]);

  const getImagePath = (picture) => {
    if (!picture) return `${BASE_URL}/placeholder-director.jpg`;
    return `${BASE_URL}/directors/${picture}`;
  };

  const handleImageError = (e, directorName, picture) => {
    console.error(`Image error for ${directorName}`, picture);
    e.target.src = '/placeholder-director.jpg';
  };

  const fetchDirectorDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/directors/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const directorData = response.data;
      console.log('Director data from backend:', directorData); // Debug log
      
      // Format statistics with real data
      const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
      };

      // Transform the data to match the expected format
      const transformedDirector = {
        id: directorData.DIRECTOR_ID,
        firstName: directorData.DIRECTOR_FIRSTNAME,
        lastName: directorData.DIRECTOR_LASTNAME, 
        name: directorData.DIRECTOR_NAME,
        biography: directorData.BIO || 'No biography available.',
        picture: directorData.PICTURE,
        filmography: directorData.SHOWS || [],
        statistics: {
          totalShows: directorData.SHOWS ? directorData.SHOWS.length : 0,
          totalEpisodes: directorData.SHOWS ? directorData.SHOWS.length : 0, // Using show count as episode count
          averageRating: directorData.SHOWS && directorData.SHOWS.length > 0 
            ? (directorData.SHOWS.reduce((sum, show) => sum + (parseFloat(show.RATING) || 0), 0) / directorData.SHOWS.length).toFixed(1)
            : '0.0',
          genres: directorData.SHOWS ? 
            [...new Set(
              directorData.SHOWS
                .filter(show => show.GENRES)
                .flatMap(show => show.GENRES.split(', '))
                .map(genre => genre.trim())
            )].length : 0,
          careerSpan: directorData.SHOWS && directorData.SHOWS.length > 0 ? 
            (() => {
              const years = directorData.SHOWS
                .map(show => show.RELEASE_DATE ? new Date(show.RELEASE_DATE).getFullYear() : null)
                .filter(year => year);
              if (years.length === 0) return 'Unknown';
              const minYear = Math.min(...years);
              const maxYear = Math.max(...years);
              return minYear === maxYear ? minYear.toString() : `${minYear} - ${maxYear}`;
            })() : 'Unknown'
        }
      };
      
      console.log('Transformed director:', transformedDirector); // Debug log
      setDirector(transformedDirector);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching director details:', error);
      setDirector(null);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/directors-management');
  };

  const handleEdit = () => {
    navigate(`/edit-director/${director.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this director? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_URL}/directors/${director.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        navigate('/directors-management');
      } catch (error) {
        console.error('Error deleting director:', error);
        alert('Failed to delete director. Please try again.');
      }
    }
  };

  const handleShowClick = (showId) => {
    navigate(`/admin-show-details/${showId}`);
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
          <div>Loading director details...</div>
        </div>
      </div>
    );
  }

  if (!director) {
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
          <div>Director not found</div>
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
            Back to Directors
          </motion.button>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>{director.name}</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Director Details & Management</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEdit}
            style={{
              background: 'linear-gradient(45deg, #2ed573, #00b894)',
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
            Edit Director
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
            background: 'linear-gradient(135deg, rgba(46, 213, 115, 0.1) 0%, rgba(0, 184, 148, 0.1) 100%)',
            borderRadius: '50%',
            transform: 'translate(100px, -100px)'
          }} />
          
          <div style={{ display: 'flex', gap: '40px', position: 'relative', zIndex: 2 }}>
            {/* Profile Picture */}
            <div style={{
              width: '200px',
              height: '280px',
              borderRadius: '15px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img
                src={getImagePath(director.picture)}
                alt={director.name}
                onError={(e) => handleImageError(e, director.name, director.picture)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '13px'
                }}
              />
            </div>

            {/* Details */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: '3rem', 
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #e0e0e0 0%, #b0b0b0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {director.name}
                </h1>
                <span style={{
                  background: 'rgba(46, 213, 115, 0.2)',
                  color: '#2ed573',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Director
                </span>
              </div>

              <div style={{ display: 'flex', gap: '30px', marginBottom: '20px', opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiFilm size={18} />
                  <span style={{ fontSize: '16px' }}>{director.statistics.totalShows} Shows</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiStar size={18} style={{ color: '#ffd700' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>{director.statistics.averageRating}/10</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiUsers size={18} />
                  <span style={{ fontSize: '16px' }}>{director.statistics.genres} Genres</span>
                </div>
              </div>

              <p style={{ 
                fontSize: '16px', 
                lineHeight: '1.6', 
                opacity: 0.9,
                margin: '0 0 25px 0'
              }}>
                {director.biography}
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
                  <FiEdit3 size={18} />
                  Edit Profile
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
            <FiFilm size={24} style={{ marginBottom: '10px', color: '#2ed573' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#2ed573' }}>
              {director.statistics.totalShows}
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
            <FiUsers size={24} style={{ marginBottom: '10px', color: '#4facfe' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#4facfe' }}>
              {director.statistics.totalEpisodes}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Episodes</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <FiStar size={24} style={{ marginBottom: '10px', color: '#ffd700' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#ffd700' }}>
              {director.statistics.averageRating}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Average Rating</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <FiAward size={24} style={{ marginBottom: '10px', color: '#f093fb' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#f093fb' }}>
              {director.statistics.genres}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Genres Directed</p>
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
                  background: activeTab === tab ? 'rgba(46, 213, 115, 0.2)' : 'transparent',
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
                  {director.biography}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <h4 style={{ marginBottom: '10px', color: 'white' }}>Career Statistics</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.8 }}>Total Shows:</span>
                        <span style={{ fontWeight: '600' }}>{director.statistics.totalShows}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.8 }}>Total Episodes:</span>
                        <span style={{ fontWeight: '600' }}>{director.statistics.totalEpisodes}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ opacity: 0.8 }}>Average Rating:</span>
                        <span style={{ fontWeight: '600' }}>{director.statistics.averageRating}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'filmography' && (
              <div>
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Filmography</h3>
                {director.filmography && director.filmography.length > 0 ? (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {director.filmography.map((show, index) => (
                      <motion.div
                        key={show.SHOW_ID || index}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => handleShowClick(show.SHOW_ID)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px'
                        }}
                      >
                        <div style={{
                          width: '60px',
                          height: '80px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img
                            src={`${BASE_URL}/shows/${show.THUMBNAIL}`}
                            alt={show.TITLE}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.style.background = 'linear-gradient(135deg, #2ed573 0%, #00b894 100%)';
                              e.target.parentElement.style.display = 'flex';
                              e.target.parentElement.style.alignItems = 'center';
                              e.target.parentElement.style.justifyContent = 'center';
                              e.target.parentElement.style.fontSize = '1.2rem';
                              e.target.parentElement.style.fontWeight = 'bold';
                              e.target.parentElement.style.color = 'white';
                              e.target.parentElement.textContent = show.TITLE?.[0] || '?';
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'white' }}>
                            {show.TITLE}
                          </h4>
                          <p style={{ margin: '0 0 8px 0', opacity: 0.7, fontSize: '14px' }}>
                            {show.RELEASE_DATE ? new Date(show.RELEASE_DATE).getFullYear() : 'N/A'} • {show.CATEGORY_NAME || 'Unknown Category'}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FiStar size={14} style={{ color: '#ffd700' }} />
                              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                {parseFloat(show.RATING || 0).toFixed(1)}
                              </span>
                            </div>
                            <span style={{ fontSize: '12px', opacity: 0.6 }}>
                              {show.GENRES || 'No genres listed'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
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
                    <FiFilm size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '16px' }}>No filmography available for this director.</p>
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

export default AdminDirectorDetails;
