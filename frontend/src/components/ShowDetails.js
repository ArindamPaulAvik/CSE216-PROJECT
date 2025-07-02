import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiMenu, FiSearch, FiHeart, FiCreditCard } from 'react-icons/fi';

function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/show/${id}`)
      .then(res => {
        setShow(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching show details:', err);
        setError('Could not fetch show details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '30px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', padding: '30px' }}>{error}</div>;
  if (!show) return null;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0d0d0d',
      color: '#fff',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      {/* Menu Bar */}
      <div
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        style={{
          width: menuOpen ? 200 : 60,
          backgroundColor: '#111',
          transition: 'width 0.3s ease',
          paddingTop: 20,
          paddingLeft: 15,
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <FiMenu size={28} color="#ccc" />
        {menuOpen && (
          <div style={{ marginTop: 40, color: '#ccc' }}>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
              <FiSearch size={18} style={{ marginRight: 8 }} />
              <input
                type="text"
                placeholder="Search shows..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: 'none',
                  outline: 'none',
                  fontSize: 14,
                  backgroundColor: '#222',
                  color: '#eee',
                  width: '100%'
                }}
              />
            </div>
            <div style={{ marginBottom: 20, fontSize: 16, display: 'flex', alignItems: 'center' }}>
              <FiCreditCard size={18} style={{ marginRight: 8 }} /> Subscription
            </div>
            <div style={{ marginBottom: 20, fontSize: 16, display: 'flex', alignItems: 'center' }}>
              <FiHeart size={18} style={{ marginRight: 8 }} /> Favourites
            </div>
          </div>
        )}
      </div>

      {/* Main Show Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '40px',
          alignItems: 'flex-start',
          flexWrap: 'wrap-reverse'
        }}>
          {/* LEFT: DETAILS */}
          <div style={{ flex: '2 1 600px', minWidth: '300px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{show.TITLE}</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '20px' }}>
              ⭐ {show.RATING} | {show.DURATION} mins | Released: {show.RELEASE_DATE?.slice(0, 10)}
            </p>
            <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>{show.DESCRIPTION}</p>
            <p><strong>Category:</strong> {show.CATEGORY_NAME || 'N/A'}</p>
            <p><strong>Publisher:</strong> {show.PUBLISHER_NAME || 'N/A'}</p>
            <p><strong>Age Restriction:</strong> {show.AGE_RESTRICTION_NAME || 'N/A'}</p>
            <p><strong>Seasons:</strong> {show.SEASON_COUNT || 0}</p>
          </div>

          {/* RIGHT: IMAGE */}
          <div style={{ flex: '1 1 300px', textAlign: 'right' }}>
            <img
              src={show.THUMBNAIL ? `http://localhost:5000/${show.THUMBNAIL}` : ''}
              alt={show.TITLE || 'Show Thumbnail'}
              style={{
                width: '300px',
                height: '450px',
                objectFit: 'cover',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDetails;
