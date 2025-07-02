import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout'; // Adjust path as needed

function ActorsPage() {
  const [actors, setActors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/actors', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setActors(res.data))
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <div>
        <h2 style={{ 
          fontSize: 32, 
          fontWeight: 'bold', 
          marginBottom: 30, 
          color: '#f0f0f0' 
        }}>
          🎬 Actors
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 25
        }}>
          {actors.map(actor => (
            <div
              key={actor.ACTOR_ID}
              style={{
                backgroundColor: '#1e1e1e',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/actor/${actor.ACTOR_ID}`)}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={`/actors/${actor.PICTURE}`}
                alt={actor.NAME}
                style={{ width: '100%', height: 250, objectFit: 'cover' }}
              />
              <div style={{ 
                padding: '12px 10px', 
                textAlign: 'center', 
                backgroundColor: 'rgba(0,0,0,0.7)' 
              }}>
                <p style={{ 
                  fontSize: 16, 
                  fontWeight: '500', 
                  color: '#f5f5f5', 
                  margin: 0 
                }}>
                  {actor.NAME}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ActorsPage;