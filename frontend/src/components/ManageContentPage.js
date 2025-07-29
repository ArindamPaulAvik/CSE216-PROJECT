import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiStar as FiStarOutline } from 'react-icons/fi';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

function ManageContentPage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';
  const [shows, setShows] = useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${BASE_URL}/publishers/my-shows`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setShows(data))
      .catch(err => setShows([]));
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleBack = () => {
    navigate('/publisher-frontpage');
  };

  const handleDropdownToggle = () => {
    console.log('Dropdown toggle clicked');
    setDropdownOpen((open) => !open);
  };

  const handleDropdownBlur = (e) => {
    // Close dropdown if focus leaves the dropdown
    if (!dropdownContainerRef.current.contains(e.relatedTarget)) {
      setDropdownOpen(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <header
        style={{
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontWeight: '600',
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Manage your content</h1>
        </div>
      </header>
      {/* Main Content */}
      <div
        style={{
          padding: '40px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          minHeight: '220px',
          boxSizing: 'border-box',
          marginTop: '10px',
          width: '100%'
        }}>
          {/* Header row for section title and add content button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', position: 'relative' }}>
            <h2 style={{
              margin: 0,
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#fff'
            }}>
              Your shows
            </h2>
            <div style={{ position: 'relative', zIndex: 1000 }} ref={dropdownContainerRef}>
              <button
                onClick={handleDropdownToggle}
                style={{
                  background: 'linear-gradient(45deg, #ffa726, #ff9800)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  position: 'relative',
                  zIndex: 1001
                }}
              >
                Add content ▾
              </button>
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    background: 'rgba(30,30,40,0.98)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    minWidth: '180px',
                    zIndex: 2000
                  }}
                >
                  <button
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontWeight: '500',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/add-show');
                    }}
                  >
                    Add new show
                  </button>
                  <button
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontWeight: '500',
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => { 
                      setDropdownOpen(false); 
                      navigate('/add-episode');
                    }}
                  >
                    Add new episode
                  </button>
                </div>
              )}
            </div>
          </div>
          <p style={{ opacity: 0.7, fontSize: '1rem' }}>
            (Your shows will appear here)
          </p>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {shows.length === 0 && <div style={{ color: '#aaa' }}>No shows found.</div>}
            {shows.map(show => (
              <div key={show.SHOW_ID} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12, gap: 18 }}>
                <img src={`${BASE_URL}/shows/${show.THUMBNAIL}`} alt={show.TITLE} style={{ width: 70, height: 100, objectFit: 'cover', borderRadius: 8, background: '#222' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 18, color: '#fff' }}>{show.TITLE}</div>
                  <div style={{ color: '#aaa', fontSize: 15, marginTop: 4 }}>
                    Rating: {show.RATING ?? 'N/A'}
                  </div>
                  <div style={{ color: '#8cf', fontSize: 14, marginTop: 2 }}>Watch count: {show.WATCH_COUNT ?? 0}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageContentPage; 