import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';

function DirectorDetailPage() {
  const { id } = useParams();
  const [director, setDirector] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

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
  }, [id]);

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

  // IMDb-style info fields (use N/A if missing)
  const born = director.BORN || 'N/A';
  const birthplace = director.BIRTHPLACE || 'N/A';
  const awards = director.AWARDS || 'N/A';
  const knownFor = director.KNOWN_FOR || (director.SHOWS && director.SHOWS.length > 0 ? director.SHOWS[0].TITLE : 'N/A');
  const gender = director.GENDER || 'N/A';
  const notableWorks = director.NOTABLE_WORKS || 'N/A';

  return (
    <Layout>
      <div style={{ padding: '0 0 40px 0' }}>
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
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 18,
              marginBottom: 25,
              background: 'rgba(30,30,40,0.7)',
              borderRadius: 10,
              padding: 18,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <div>
                <span style={{ color: '#aaa', fontSize: 13 }}>Born</span>
                <div style={{ color: '#fff', fontWeight: 500 }}>{born}</div>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: 13 }}>Birthplace</span>
                <div style={{ color: '#fff', fontWeight: 500 }}>{birthplace}</div>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: 13 }}>Gender</span>
                <div style={{ color: '#fff', fontWeight: 500 }}>{gender}</div>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: 13 }}>Awards</span>
                <div style={{ color: '#fff', fontWeight: 500 }}>{awards}</div>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: 13 }}>Known For</span>
                <div style={{ color: '#fff', fontWeight: 500 }}>{knownFor}</div>
              </div>
              <div>
                <span style={{ color: '#aaa', fontSize: 13 }}>Notable Works</span>
                <div style={{ color: '#fff', fontWeight: 500 }}>{notableWorks}</div>
              </div>
            </div>
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
