import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiStar, 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiEdit3, 
  FiTrash2,
  FiPlay,
  FiAward,
  FiEye,
  FiHeart
} from 'react-icons/fi';
import axios from 'axios';

function AdminShowDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const BASE_URL = 'https://cse216-project.onrender.com';

  useEffect(() => {
    fetchShowDetails();
  }, [id]);

  // Helper function to get image path like in user frontpage
  const getImagePath = (thumbnail) => {
    if (!thumbnail) return `${BASE_URL}/shows/placeholder.jpg`;
    return `${BASE_URL}/shows/${thumbnail}`;
  };

  const handleImageError = (e, showTitle, thumbnail) => {
    console.error(`Image error for ${showTitle}`, thumbnail);
    e.target.src = '/placeholder.jpg';
  };

  const fetchShowDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/show/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const showData = response.data;
      
      // Calculate actual seasons and episodes from episodes data
      let seasons = 1;
      let episodes = 1;
      let seasonsData = [];
      
      if (showData.EPISODES && showData.EPISODES.length > 0) {
        episodes = showData.EPISODES.length;
        const uniqueSeasons = [...new Set(showData.EPISODES.map(ep => ep.SEASON_NUMBER || 1))];
        seasons = uniqueSeasons.length;
        
        // Create seasons data from actual episodes
        seasonsData = uniqueSeasons.map(seasonNum => {
          const seasonEpisodes = showData.EPISODES.filter(ep => (ep.SEASON_NUMBER || 1) === seasonNum);
          return {
            season: seasonNum,
            episodes: seasonEpisodes.length,
            year: showData.RELEASE_DATE ? new Date(showData.RELEASE_DATE).getFullYear() : 2020,
            rating: parseFloat(showData.RATING) || 0
          };
        });
      } else {
        seasonsData = [{
          season: 1,
          episodes: 1,
          year: showData.RELEASE_DATE ? new Date(showData.RELEASE_DATE).getFullYear() : 2020,
          rating: parseFloat(showData.RATING) || 0
        }];
      }
      
      // Format statistics with real data
      const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
      };
      
      // Transform the data to match the expected format
      const transformedShow = {
        id: showData.SHOW_ID,
        title: showData.TITLE,
        genre: showData.GENRES || 'Unknown',
        year: showData.RELEASE_DATE ? new Date(showData.RELEASE_DATE).getFullYear() : 2020,
        rating: parseFloat(showData.RATING) || 0,
        status: showData.STATUS_NAME || 'Unknown',
        seasons: seasons,
        episodes: episodes,
        runtime: showData.DURATION || 45,
        poster: showData.THUMBNAIL,
        banner: showData.BANNER,
        description: showData.DESCRIPTION || 'No description available.',
        longDescription: showData.DESCRIPTION || 'No description available.',
        category: showData.CATEGORY_NAME || 'Unknown Category',
        creator: showData.PUBLISHER_NAME || 'Unknown',
        awards: showData.AWARDS || [], // Use real awards if available
        cast: showData.CAST || [], // Keep original cast structure with all fields
        seasons_data: seasonsData,
        statistics: {
          views: formatNumber(showData.TOTAL_VIEWS || 0),
          favorites: formatNumber(showData.FAVORITES_COUNT || 0),
          reviews: formatNumber(showData.COMMENTS_COUNT || 0), // Assuming comments are reviews
          averageRating: parseFloat(showData.RATING) || 0
        }
      };
      
      setShow(transformedShow);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching show details:', error);
      setShow(null);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/shows-management');
  };

  const handleEdit = () => {
    navigate(`/edit-show/${show.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      // Handle delete functionality
      console.log('Delete show:', show.id);
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
        Loading show details...
      </div>
    );
  }

  if (!show) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        Show not found
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
            Back to Shows
          </motion.button>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>{show.title}</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Show Details & Management</p>
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
            Edit Show
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
            {/* Poster */}
            <div style={{
              width: '200px',
              height: '280px',
              borderRadius: '15px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img
                src={getImagePath(show.poster)}
                alt={show.title}
                onError={(e) => handleImageError(e, show.title, show.poster)}
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
                  {show.title}
                </h1>
                <span style={{
                  background: show.status === 'Completed' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                  color: show.status === 'Completed' ? '#4caf50' : '#ff9800',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {show.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '30px', marginBottom: '20px', opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiCalendar size={18} />
                  <span style={{ fontSize: '16px' }}>{show.year}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiStar size={18} style={{ color: '#ffd700' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>{show.rating}/10</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiClock size={18} />
                  <span style={{ fontSize: '16px' }}>{show.runtime} min</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {show.genre.split(', ').map((g, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>

              <p style={{ 
                fontSize: '16px', 
                lineHeight: '1.6', 
                opacity: 0.9,
                margin: '0 0 25px 0'
              }}>
                {show.description}
              </p>

              <div style={{ display: 'flex', gap: '15px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
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
                  <FiPlay size={18} />
                  Watch Trailer
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
            <FiEye size={24} style={{ marginBottom: '10px', color: 'white' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
              {show.statistics.views}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Views</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <FiHeart size={24} style={{ marginBottom: '10px', color: '#ff4757' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#ff4757' }}>
              {show.statistics.favorites}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Favorites</p>
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
              {show.statistics.reviews}
            </p>
            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Reviews</p>
          </div>

          {show.category && show.category.toLowerCase() !== 'movie' && (
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
                {show.seasons}
              </p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Seasons</p>
            </div>
          )}
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
            {['overview', 'cast', ...(show.seasons > 1 ? ['seasons'] : []), 'awards'].map((tab) => (
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
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Overview</h3>
                <p style={{ lineHeight: '1.6', opacity: 0.9, marginBottom: '20px' }}>
                  {show.longDescription}
                </p>
                
                {/* Genres Section */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ marginBottom: '10px', color: 'white' }}>Genres</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {show.genre && show.genre.split(', ').map((genre, index) => (
                      <span
                        key={index}
                        style={{
                          background: 'rgba(102, 126, 234, 0.2)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: '1px solid rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        {genre.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <h4 style={{ marginBottom: '10px', color: 'white' }}>Category</h4>
                    <p style={{ margin: 0, opacity: 0.8 }}>{show.category}</p>
                  </div>
                  {show.category && show.category.toLowerCase() !== 'movie' && (
                    <div>
                      <h4 style={{ marginBottom: '10px', color: 'white' }}>Total Episodes</h4>
                      <p style={{ margin: 0, opacity: 0.8 }}>{show.episodes}</p>
                    </div>
                  )}
                  <div>
                    <h4 style={{ marginBottom: '10px', color: 'white' }}>Runtime</h4>
                    <p style={{ margin: 0, opacity: 0.8 }}>{show.runtime} minutes</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cast' && (
              <div>
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Main Cast</h3>
                {show.cast && show.cast.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {show.cast.map((actor, index) => (
                      <div
                        key={actor.ACTOR_ID || index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          padding: '20px',
                          textAlign: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          margin: '0 auto 15px',
                          overflow: 'hidden',
                          position: 'relative',
                          border: '2px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          {actor.PICTURE ? (
                            <img 
                              src={`${BASE_URL}/actors/${actor.PICTURE}`}
                              alt={`${actor.ACTOR_FIRSTNAME} ${actor.ACTOR_LASTNAME}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                // Fallback to initials if image fails
                                e.target.style.display = 'none';
                                e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                e.target.parentElement.style.display = 'flex';
                                e.target.parentElement.style.alignItems = 'center';
                                e.target.parentElement.style.justifyContent = 'center';
                                e.target.parentElement.style.fontSize = '1.5rem';
                                e.target.parentElement.style.fontWeight = 'bold';
                                e.target.parentElement.style.color = 'white';
                                e.target.parentElement.textContent = `${actor.ACTOR_FIRSTNAME?.[0] || ''}${actor.ACTOR_LASTNAME?.[0] || ''}`;
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              color: 'white'
                            }}>
                              {`${actor.ACTOR_FIRSTNAME?.[0] || ''}${actor.ACTOR_LASTNAME?.[0] || ''}`}
                            </div>
                          )}
                        </div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'white' }}>
                          {actor.ACTOR_FIRSTNAME} {actor.ACTOR_LASTNAME}
                        </h4>
                        {actor.ROLE_NAME && (
                          <p style={{ margin: '0 0 8px 0', opacity: 0.8, fontSize: '14px', color: '#e0e0e0' }}>
                            as {actor.ROLE_NAME}
                          </p>
                        )}
                        {actor.ROLE_DESCRIPTION && (
                          <p style={{ margin: 0, opacity: 0.6, fontSize: '12px', lineHeight: '1.4' }}>
                            {actor.ROLE_DESCRIPTION.length > 50 
                              ? `${actor.ROLE_DESCRIPTION.substring(0, 50)}...` 
                              : actor.ROLE_DESCRIPTION}
                          </p>
                        )}
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
                    <p style={{ margin: 0, fontSize: '16px' }}>No cast information available for this show.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seasons' && (
              <div>
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Seasons</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  {show.seasons_data.map((season, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{ margin: '0 0 5px 0' }}>Season {season.season}</h4>
                        <p style={{ margin: 0, opacity: 0.7 }}>{season.episodes} episodes • {season.year}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FiStar size={16} style={{ color: '#ffd700' }} />
                        <span style={{ fontWeight: '600' }}>{season.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'awards' && (
              <div>
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Awards & Recognition</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  {show.awards.map((award, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                      }}
                    >
                      <FiAward size={24} style={{ color: '#ffd700' }} />
                      <span style={{ fontSize: '16px' }}>{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default AdminShowDetails;
