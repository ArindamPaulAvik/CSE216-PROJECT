import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Layout from './Layout';

// Award Card Component
const AwardCard = ({ award }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        rotateX: 5,
        transition: { duration: 0.3 }
      }}
      style={{
        background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Golden accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #d4af37, #f4d03f, #d4af37)',
      }} />
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '8px', 
          overflow: 'hidden',
          border: '2px solid rgba(212, 175, 55, 0.5)',
          flexShrink: 0
        }}>
          {!imageError ? (
            <img
              src={`/awards/${award.IMG}`}
              alt={award.NAME}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
              onError={handleImageError}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d4af37'
            }}>
              🏆
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            color: '#d4af37', 
            fontSize: '18px', 
            margin: '0 0 8px 0',
            fontWeight: '600',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            {award.NAME}
          </h3>
          {award.YEAR && (
            <div style={{
              color: '#b8860b',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '5px'
            }}>
              {award.YEAR}
            </div>
          )}
        </div>
      </div>
      
      {award.DESCRIPTION && (
        <p style={{ 
          color: '#ccc', 
          fontSize: '14px', 
          lineHeight: '1.5',
          margin: 0,
          flex: 1
        }}>
          {award.DESCRIPTION}
        </p>
      )}
    </motion.div>
  );
};

function DirectorDetailPage() {
  const { id } = useParams();
  const [director, setDirector] = useState(null);
  const [awards, setAwards] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/auth';
      return;
    }

    axios.get(`${BASE_URL}/directors/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setDirector(res.data))
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/auth';
        } else {
          console.error('Error fetching director:', err);
        }
      });

    // Fetch awards for this director
    axios.get(`${BASE_URL}/awards/director/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAwards(res.data))
      .catch(err => {
        console.error('Failed to fetch director awards:', err);
        setAwards([]);
      });
  }, [id, BASE_URL]);

  if (!director) {
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
            src={`${BASE_URL}/directors/${director.PICTURE}`}
            alt={director.DIRECTOR_NAME}
            style={{
              width: 250,
              borderRadius: 12,
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}
          />
          <div style={{ flex: 1, minWidth: 300 }}>
            <h2 style={{ color: '#fff', marginBottom: 10, fontSize: '2.2rem' }}>{director.DIRECTOR_NAME}</h2>
            
            {/* Awards Section */}
            {awards && awards.length > 0 && (
              <div style={{ marginBottom: 25 }}>
                <h3 style={{ 
                  color: '#d4af37', 
                  marginBottom: 15, 
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>
                  Awards & Recognition
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  {awards.slice(0, 4).map((award, index) => (
                    <motion.div
                      key={award.AWARD_ID}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <AwardCard award={award} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            <h3 style={{ color: '#ddd', marginBottom: 15, fontSize: '1.3rem' }}>Biography</h3>
            <p style={{
              color: '#ccc',
              lineHeight: 1.6,
              fontSize: '1rem',
              maxWidth: '800px'
            }}>
              {director.BIO || 'N/A'}
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
          {director.SHOWS && director.SHOWS.map(show => (
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
        {(!director.SHOWS || director.SHOWS.length === 0) && (
          <p style={{
            color: '#888',
            textAlign: 'center',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            marginTop: 40
          }}>
            No shows found for this director.
          </p>
        )}
      </div>
    </Layout>
  );
}

export default DirectorDetailPage;
