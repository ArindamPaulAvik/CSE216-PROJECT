import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Layout from './Layout';

// Award Card Component - Copied from ShowDetails/AwardsPage for better design
const AwardCard = ({ award, index }) => {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.08,
        rotateY: 5,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      className="award-card"
      style={{
        cursor: 'pointer'
      }}
    >
      <div className="award-card-inner" style={{
        background: 'linear-gradient(145deg, #2a2a1e, #3a3a2a)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 215, 0, 0.1)',
        transition: 'all 0.4s ease'
      }}>
        <div className="award-image-container" style={{
          position: 'relative',
          height: '280px',
          overflow: 'hidden'
        }}>
          <motion.img
            src={`https://cse216-project.onrender.com/awards/${award.IMG}`}
            alt={award.NAME}
            className="award-image"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            onError={(e) => {
              e.target.src = `https://cse216-project.onrender.com/placeholder-award.jpg`;
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
          />
          <div className="award-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '20px',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
          >
            <motion.div
              className="award-info"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: '600',
                margin: '0 0 5px 0'
              }}>
                {award.NAME}
              </h3>
              <p style={{
                color: '#ffd700',
                fontSize: '0.9rem',
                margin: '0 0 5px 0',
                fontWeight: '500'
              }}>
                {award.AWARDING_BODY}
              </p>
              {award.YEAR && (
                <p style={{
                  color: '#b0b0b0',
                  fontSize: '0.9rem',
                  margin: '0'
                }}>
                  {award.YEAR}
                </p>
              )}
            </motion.div>
          </div>
        </div>
        <motion.div
          className="award-details"
          whileHover={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
          transition={{ duration: 0.3 }}
          style={{
            padding: '20px',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 215, 0, 0.1)'
          }}
        >
          <p style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#f5f5f5',
            margin: '0 0 10px 0'
          }}>
            {award.NAME}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <span style={{
              fontSize: '0.85rem',
              color: '#ffd700',
              background: 'rgba(255, 215, 0, 0.1)',
              padding: '4px 8px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              🏆 {award.AWARDING_BODY}
            </span>
            {award.YEAR && (
              <span style={{
                fontSize: '0.85rem',
                color: '#ffd700',
                background: 'rgba(255, 215, 0, 0.1)',
                padding: '4px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}>
                📅 {award.YEAR}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

function ActorDetailPage() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [awards, setAwards] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = 'https://cse216-project.onrender.com';


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/auth';
      return;
    }

    axios.get(`${BASE_URL}/actors/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setActor(res.data))
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/auth';
        } else {
          console.error('Error fetching actor:', err);
        }
      });

    // Fetch awards for this actor
    axios.get(`${BASE_URL}/awards/actor/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAwards(res.data))
      .catch(err => {
        console.error('Failed to fetch actor awards:', err);
        setAwards([]);
      });
  }, [id, BASE_URL]);

  if (!actor) {
    return (
      <Layout>
        <div style={{ 
          padding: 40, 
          color: '#ccc',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ 
        padding: '0 0 40px 0',
        marginLeft: '55px',
        marginTop: '70px',
        marginRight: '20px', // Ensure right side isn't cropped
        maxWidth: 'calc(100vw - 75px)' // Account for left margin + right margin
      }}>
        {/* Top IMDb-style info section */}
        <div style={{
          display: 'flex',
          gap: 40,
          marginBottom: 40,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}>
          <img
            src={`${BASE_URL}/actors/${actor.PICTURE}`}
            alt={actor.NAME}
            style={{
              width: 250,
              borderRadius: 12,
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}
          />
          <div style={{ flex: 1, minWidth: 300 }}>
            <h2 style={{ color: '#fff', marginBottom: 10, fontSize: '2.2rem' }}>{actor.NAME}</h2>
            
            <h3 style={{ color: '#ddd', marginBottom: 15, fontSize: '1.3rem' }}>Biography</h3>
            <p style={{
              color: '#ccc',
              lineHeight: 1.6,
              fontSize: '1rem',
              maxWidth: '800px'
            }}>
              {actor.BIOGRAPHY || 'N/A'}
            </p>
          </div>
        </div>

        <h3 style={{
          color: '#ddd',
          marginBottom: 30,
          fontSize: '1.8rem',
          borderBottom: '2px solid #333',
          paddingBottom: 10
        }}>
          Filmography
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 25
        }}>
          {actor.SHOWS && actor.SHOWS.map(show => (
            <div
              key={show.SHOW_ID}
              onClick={() => navigate(`/show/${show.SHOW_ID}`)}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: '#1c1c1c'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src={`${BASE_URL}/shows/${show.THUMBNAIL}`}
                alt={show.TITLE}
                style={{
                  width: '100%',
                  height: 280,
                  objectFit: 'cover'
                }}
                loading="lazy"
              />
              <div style={{
                padding: 15,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7))'
              }}>
                <p style={{
                  color: '#fff',
                  textAlign: 'center',
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {show.TITLE}
                </p>
                {show.RATING && (
                  <p style={{
                    color: '#ccc',
                    textAlign: 'center',
                    margin: '5px 0 0 0',
                    fontSize: '0.8rem'
                  }}>
                    ⭐ {show.RATING}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {(!actor.SHOWS || actor.SHOWS.length === 0) && (
          <p style={{
            color: '#888',
            textAlign: 'center',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            marginTop: 40
          }}>
            No shows found for this actor.
          </p>
        )}

        {/* Awards Section - Moved below filmography */}
        {awards && awards.length > 0 && (
          <div style={{ marginTop: 50 }}>
            <h3 style={{
              color: '#d4af37',
              marginBottom: 30,
              fontSize: '1.8rem',
              borderBottom: '2px solid #333',
              paddingBottom: 10,
              textAlign: 'center'
            }}>
              🏆 Awards & Recognition
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '25px',
              padding: '0 0 20px 0',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {awards.map((award, index) => (
                <AwardCard key={award.AWARD_ID} award={award} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ActorDetailPage;
