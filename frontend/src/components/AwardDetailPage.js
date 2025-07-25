import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';

function AwardDetailPage() {
  const { id } = useParams();
  const [award, setAward] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/auth';
      return;
    }

    axios.get(`http://localhost:5000/awards/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAward(res.data))
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/auth';
        } else {
          console.error('Error fetching award:', err);
        }
      });
  }, [id]);

  if (!award) {
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

  // Award info fields
  const awardingBody = award.AWARDING_BODY || 'N/A';
  const description = award.DESCRIPTION || 'No description available';

  return (
    <Layout>
      <div style={{ padding: '0 0 40px 0' }}>
        {/* Top award info section */}
        <div style={{
          display: 'flex',
          gap: 40,
          marginBottom: 40,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}>
          <img
            src={`/awards/${award.IMG}`}
            alt={award.AWARD_NAME}
            style={{
              width: 250,
              borderRadius: 12,
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
              border: '2px solid rgba(255, 215, 0, 0.3)'
            }}
            onError={(e) => {
              e.target.src = '/images/default-award.png';
            }}
          />
          <div style={{ flex: 1, minWidth: 300 }}>
            <h2 style={{ 
              color: '#ffd700', 
              marginBottom: 10, 
              fontSize: '2.2rem',
              textShadow: '0 2px 4px rgba(255, 215, 0, 0.3)'
            }}>
              🏆 {award.AWARD_NAME}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 18,
              marginBottom: 25,
              background: 'rgba(30,30,40,0.7)',
              borderRadius: 10,
              padding: 18,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              border: '1px solid rgba(255, 215, 0, 0.1)'
            }}>
              <div>
                <span style={{ color: '#aaa', fontSize: 13 }}>Awarding Body</span>
                <div style={{ color: '#ffd700', fontWeight: 600 }}>{awardingBody}</div>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: 13 }}>Category</span>
                <div style={{ color: '#fff', fontWeight: 500 }}>Prestigious Award</div>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: 13 }}>Recognition</span>
                <div style={{ color: '#fff', fontWeight: 500 }}>Excellence in Entertainment</div>
              </div>
            </div>
            <h3 style={{ 
              color: '#ddd', 
              marginBottom: 15, 
              fontSize: '1.3rem',
              borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
              paddingBottom: 8,
              display: 'inline-block'
            }}>
              About This Award
            </h3>
            <p style={{
              color: '#ccc',
              lineHeight: 1.6,
              fontSize: '1rem',
              maxWidth: '800px',
              background: 'rgba(0, 0, 0, 0.2)',
              padding: 20,
              borderRadius: 8,
              border: '1px solid rgba(255, 215, 0, 0.1)'
            }}>
              {description}
            </p>
          </div>
        </div>

        {/* Shows Section */}
        {award.SHOWS && award.SHOWS.length > 0 && (
          <>
            <h3 style={{
              color: '#ffd700',
              marginBottom: 30,
              fontSize: '1.8rem',
              borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
              paddingBottom: 10,
              textShadow: '0 2px 4px rgba(255, 215, 0, 0.3)'
            }}>
              🎬 Award-Winning Shows
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 25,
              marginBottom: 40
            }}>
              {award.SHOWS.map(show => (
                <div
                  key={show.SHOW_ID}
                  onClick={() => navigate(`/show/${show.SHOW_ID}`)}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    borderRadius: 10,
                    overflow: 'hidden',
                    backgroundColor: '#1c1c1c',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.2)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(255, 215, 0, 0.9)',
                    color: '#000',
                    fontSize: '20px',
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}>
                    🏆
                  </div>
                  <img
                    src={`/shows/${show.THUMBNAIL}`}
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
                      color: '#ffd700',
                      textAlign: 'center',
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {show.TITLE}
                    </p>
                    {show.YEAR && (
                      <p style={{
                        color: '#ccc',
                        textAlign: 'center',
                        margin: '5px 0 0 0',
                        fontSize: '0.8rem'
                      }}>
                        Won in {show.YEAR}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actors Section */}
        {award.ACTORS && award.ACTORS.length > 0 && (
          <>
            <h3 style={{
              color: '#ffd700',
              marginBottom: 30,
              fontSize: '1.8rem',
              borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
              paddingBottom: 10,
              textShadow: '0 2px 4px rgba(255, 215, 0, 0.3)'
            }}>
              🎭 Award-Winning Actors
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 25,
              marginBottom: 40
            }}>
              {award.ACTORS.map(actor => (
                <div
                  key={`${actor.ACTOR_ID}-${actor.YEAR}`}
                  onClick={() => navigate(`/actor/${actor.ACTOR_ID}`)}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    borderRadius: 10,
                    overflow: 'hidden',
                    backgroundColor: '#1c1c1c',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.2)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(255, 215, 0, 0.9)',
                    color: '#000',
                    fontSize: '20px',
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}>
                    🏆
                  </div>
                  <img
                    src={`/actors/${actor.PICTURE}`}
                    alt={actor.NAME}
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
                      color: '#ffd700',
                      textAlign: 'center',
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {actor.NAME}
                    </p>
                    <p style={{
                      color: '#ccc',
                      textAlign: 'center',
                      margin: '5px 0 0 0',
                      fontSize: '0.8rem'
                    }}>
                      Won in {actor.YEAR}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Directors Section */}
        {award.DIRECTORS && award.DIRECTORS.length > 0 && (
          <>
            <h3 style={{
              color: '#ffd700',
              marginBottom: 30,
              fontSize: '1.8rem',
              borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
              paddingBottom: 10,
              textShadow: '0 2px 4px rgba(255, 215, 0, 0.3)'
            }}>
              🎬 Award-Winning Directors
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 25,
              marginBottom: 40
            }}>
              {award.DIRECTORS.map(director => (
                <div
                  key={`${director.DIRECTOR_ID}-${director.YEAR}`}
                  onClick={() => navigate(`/director/${director.DIRECTOR_ID}`)}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    borderRadius: 10,
                    overflow: 'hidden',
                    backgroundColor: '#1c1c1c',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.2)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(255, 215, 0, 0.9)',
                    color: '#000',
                    fontSize: '20px',
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}>
                    🏆
                  </div>
                  <img
                    src={`/directors/${director.PICTURE}`}
                    alt={director.NAME}
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
                      color: '#ffd700',
                      textAlign: 'center',
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {director.NAME}
                    </p>
                    <p style={{
                      color: '#ccc',
                      textAlign: 'center',
                      margin: '5px 0 0 0',
                      fontSize: '0.8rem'
                    }}>
                      Won in {director.YEAR}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* No Winners Message */}
        {(!award.SHOWS || award.SHOWS.length === 0) && 
         (!award.ACTORS || award.ACTORS.length === 0) && 
         (!award.DIRECTORS || award.DIRECTORS.length === 0) && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 12,
            border: '2px dashed rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: 20 }}>🏆</div>
            <p style={{
              color: '#ffd700',
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: 10
            }}>
              No Winners Yet
            </p>
            <p style={{
              color: '#888',
              fontStyle: 'italic',
              fontSize: '1rem'
            }}>
              This prestigious award is waiting for its first recipients.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AwardDetailPage;
