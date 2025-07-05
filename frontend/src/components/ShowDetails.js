import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';

function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // null means "loading", true/false means loaded favorite status
  const [isFavorite, setIsFavorite] = useState(null);

  // Fetch current favorite status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`http://localhost:5000/favorite/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsFavorite(res.data.favorite);
      })
      .catch((err) => {
        console.warn('Could not check favorite status.');
        setIsFavorite(false); // fallback to false if error
      });
  }, [id]);

  // Fetch show details
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/login';
      return;
    }

    axios
      .get(`http://localhost:5000/show/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setShow(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error('Error fetching show details:', err);
          setError('Could not fetch show details.');
          setLoading(false);
        }
      });
  }, [id]);

  // Toggle favorite status
  const toggleFavorite = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .post(
        `http://localhost:5000/favorite/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setIsFavorite(res.data.favorite);
      })
      .catch((err) => {
        console.error('Failed to toggle favorite:', err);
      });
  };

  if (loading) {
    return (
      <Layout>
        <div
          style={{
            color: '#ccc',
            padding: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            fontSize: '1.2rem',
          }}
        >
          Loading...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div
          style={{
            color: '#ff6b6b',
            padding: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            fontSize: '1.2rem',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      </Layout>
    );
  }

  if (!show) return null;

  return (
    <Layout>
      <div style={{ padding: '0 0 40px 0' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '40px',
            alignItems: 'flex-start',
            flexWrap: 'wrap-reverse',
          }}
        >
          {/* LEFT: DETAILS */}
          <div style={{ flex: '2 1 600px', minWidth: '300px' }}>
            <h1
              style={{
                fontSize: '2.5rem',
                marginBottom: '15px',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              {show.TITLE}
              {/* Heart button - show only after favorite status loads */}
              {isFavorite === null ? (
                <span
                  style={{
                    fontSize: '1.8rem',
                    color: '#999',
                    marginLeft: '10px',
                  }}
                  title="Loading favorite status..."
                >
                  {/* Optional: show a loading spinner or nothing */}
                  ⏳
                </span>
              ) : (
                <span
                  onClick={toggleFavorite}
                  title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  style={{
                    fontSize: '1.8rem',
                    color: isFavorite ? '#ff6b6b' : '#ccc',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    marginLeft: '10px',
                    userSelect: 'none',
                  }}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </span>
              )}
            </h1>

            <div
              style={{
                fontSize: '1.2rem',
                color: '#ddd',
                marginBottom: '25px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '1rem',
                }}
              >
                ⭐ {show.RATING}
              </span>
              <span>{show.DURATION} mins</span>
              <span>Released: {show.RELEASE_DATE?.slice(0, 10)}</span>
            </div>

            <div
              style={{
                marginBottom: '30px',
                lineHeight: '1.7',
                fontSize: '1.1rem',
                color: '#ccc',
                maxWidth: '800px',
              }}
            >
              {show.DESCRIPTION}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginTop: '30px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#1c1c1c',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #333',
                }}
              >
                <h3
                  style={{
                    color: '#fff',
                    marginBottom: '15px',
                    fontSize: '1.2rem',
                  }}
                >
                  Show Information
                </h3>
                <div style={{ color: '#ccc', lineHeight: '1.6' }}>
                  <p>
                    <strong style={{ color: '#ddd' }}>Category:</strong>{' '}
                    {show.CATEGORY_NAME || 'N/A'}
                  </p>
                  <p>
                    <strong style={{ color: '#ddd' }}>Publisher:</strong>{' '}
                    {show.PUBLISHER_NAME || 'N/A'}
                  </p>
                  <p>
                    <strong style={{ color: '#ddd' }}>Age Restriction:</strong>{' '}
                    {show.AGE_RESTRICTION_NAME || 'N/A'}
                  </p>
                  <p>
                    <strong style={{ color: '#ddd' }}>Seasons:</strong>{' '}
                    {show.SEASON_COUNT || 0}
                  </p>
                  <p>
                    <strong style={{ color: '#ddd' }}>Genre:</strong>{' '}
                    {show.GENRES || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Additional info card if needed */}
              <div
                style={{
                  backgroundColor: '#1c1c1c',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #333',
                }}
              >
                <h3
                  style={{
                    color: '#fff',
                    marginBottom: '15px',
                    fontSize: '1.2rem',
                  }}
                >
                  Quick Stats
                </h3>
                <div style={{ color: '#ccc', lineHeight: '1.6' }}>
                  <p>
                    <strong style={{ color: '#ddd' }}>Duration:</strong>{' '}
                    {show.DURATION} minutes
                  </p>
                  <p>
                    <strong style={{ color: '#ddd' }}>Rating:</strong>{' '}
                    {show.RATING}/10
                  </p>
                  <p>
                    <strong style={{ color: '#ddd' }}>Release Year:</strong>{' '}
                    {show.RELEASE_DATE?.slice(0, 4) || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: IMAGE */}
          <div style={{ flex: '1 1 350px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={`/showS/${show.THUMBNAIL}`}
                alt={show.TITLE || 'Show Thumbnail'}
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  height: '500px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                }}
                loading="lazy"
              />

              {/* Play button overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '3px solid rgba(255,255,255,0.8)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.9)';
                  e.currentTarget.style.transform =
                    'translate(-50%, -50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '20px solid #fff',
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent',
                    marginLeft: '6px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ShowDetails;
