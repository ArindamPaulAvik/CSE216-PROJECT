import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';

function ActorDetailPage() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/login';
      return;
    }

    axios.get(`http://localhost:5000/actor/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setActor(res.data))
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error('Error fetching actor:', err);
        }
      });
  }, [id]);

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
      <div style={{ padding: '0 0 40px 0' }}>
        <h2 style={{ color: '#fff', marginBottom: 30, fontSize: '2.2rem' }}>{actor.NAME}</h2>
        
        <div style={{ 
          display: 'flex', 
          gap: 40, 
          marginBottom: 40,
          flexWrap: 'wrap'
        }}>
          <img
            src={`/actors/${actor.PICTURE}`}
            alt={actor.NAME}
            style={{ 
              width: 250, 
              borderRadius: 12, 
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}
          />
          <div style={{ flex: 1, minWidth: 300 }}>
            <h3 style={{ color: '#ddd', marginBottom: 15, fontSize: '1.3rem' }}>Biography</h3>
            <p style={{ 
              color: '#ccc', 
              lineHeight: 1.6,
              fontSize: '1rem',
              maxWidth: '800px'
            }}>
              {actor.BIOGRAPHY}
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
                src={`/showS/${show.THUMBNAIL}`}
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
      </div>
    </Layout>
  );
}

export default ActorDetailPage;