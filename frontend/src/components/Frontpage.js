import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FiMenu, FiSearch, FiHeart, FiCreditCard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function FrontPage() {
  const [userName, setUserName] = useState('');
  const [trendingShows, setTrendingShows] = useState([]);
  const [watchAgainShows, setWatchAgainShows] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/login';
      return;
    }

    axios.get('http://localhost:5000/frontpage', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUserName(res.data.userName);
        setTrendingShows(res.data.trendingshows || []);
        setWatchAgainShows(res.data.watchagainshows || []);
      })
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error('Error fetching frontpage:', err);
        }
      });
  }, []);

  useEffect(() => {
    if (trendingShows.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTrendingIndex(prev => (prev + 1) % trendingShows.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [trendingShows]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:5000/search?query=${encodeURIComponent(searchTerm)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setSearchResults(res.data.results || []);
          setIsSearching(false);
        })
        .catch(() => {
          setSearchResults([]);
          setIsSearching(false);
        });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const trending = trendingShows[currentTrendingIndex] || {};

  const renderShowBox = useCallback((show) => (
    <div
      className="movie-box"
      key={show.SHOW_ID}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/show/${show.SHOW_ID}`)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/show/${show.SHOW_ID}`)}
      style={{ cursor: 'pointer' }}
    >
      <img src={show.THUMBNAIL} alt={show.TITLE} className="movie-thumbnail" loading="lazy" />
      <div className="movie-bottom-overlay">
        <h3>{show.TITLE}</h3>
        <p>⭐ {show.RATING}</p>
      </div>
      <div className="movie-hover-description">
        <p>{show.DESCRIPTION}</p>
      </div>
    </div>
  ), [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #2c2c2c, #0d0d0d)',
      color: '#fff',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        style={{
          width: menuOpen ? 200 : 45,
          backgroundColor: '#111',
          transition: 'width 0.3s ease',
          paddingTop: 20,
          paddingLeft: 15,
          overflow: 'hidden'
        }}
      >
        <FiMenu size={28} color="#ccc" />
        {menuOpen && (
          <div style={{ marginTop: 40, color: '#ccc' }}>
            {/* Search icon */}
            <div
              style={{ marginBottom: 10, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setSearchOpen(prev  => !prev)}
            >
              <FiSearch size={18} style={{ marginRight: 8 }} />
              <span style={{ fontSize: 16 }}>Search</span>
            </div>

            {/* Search input shown below the button */}
            {searchOpen && (
              <input
                type="text"
                placeholder="Search shows..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  marginLeft: 20,           // pushed a bit right to avoid cutoff
                  marginBottom: 20,
                  padding: '6px 10px',
                  width: 'calc(100% - 30px)', // adjust width to fit sidebar nicely
                  borderRadius: 6,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: '#222',
                  color: '#eee',
                  fontSize: 14
                }}
              />
            )}

            <div style={{ marginBottom: 20, fontSize: 16, display: 'flex', alignItems: 'center' }}>
              <FiCreditCard size={18} style={{ marginRight: 8 }} /> Subscription
            </div>
            <div style={{ marginBottom: 20, fontSize: 16, display: 'flex', alignItems: 'center' }}>
              <FiHeart size={18} style={{ marginRight: 8 }} /> Favourites
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40 }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#e0e0e0' }}>{userName}</div>
        </div>

        {searchTerm.trim() !== '' ? (
          <>
            <h2 style={{ color: '#ccc', marginBottom: 20 }}>
              Search Results {isSearching && '(Searching...)'}
            </h2>
            <div className="movie-grid">
              {searchResults.length > 0
                ? searchResults.map(renderShowBox)
                : !isSearching && <p style={{ color: '#aaa' }}>No results found</p>}
            </div>
          </>
        ) : (
          <>
            {trendingShows.length > 0 && (
              <section style={{
                display: 'flex',
                backgroundColor: '#1c1c1c',
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 60,
                height: 300
              }}>
                <div style={{
                  flex: '0 0 40%',
                  padding: 30,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  color: '#ddd',
                  background: 'rgba(0,0,0,0.7)'
                }}>
                  <h2 style={{ fontSize: '2.2rem', marginBottom: 15 }}>{trending.TITLE}</h2>
                  <p style={{
                    flexGrow: 1,
                    fontSize: '1rem',
                    lineHeight: 1.4,
                    overflowY: 'auto',
                    maxHeight: 140,
                    marginBottom: 15
                  }}>{trending.DESCRIPTION}</p>
                  <p style={{ fontSize: '1.1rem' }}>⭐ {trending.RATING}</p>
                </div>
                <div style={{ flex: '1 1 60%' }}>
                  <img
                    src={trending.THUMBNAIL}
                    alt={trending.TITLE}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.85)'
                    }}
                    loading="lazy"
                  />
                </div>
              </section>
            )}

            <section style={{ marginBottom: 60 }}>
              <h2 style={{ color: '#ccc', marginBottom: 20 }}>Trending Now</h2>
              <div className="movie-grid">{trendingShows.map(renderShowBox)}</div>
            </section>

            <section>
              <h2 style={{ color: '#ccc', marginBottom: 20 }}>Watch Again</h2>
              <div className="movie-grid">{watchAgainShows.map(renderShowBox)}</div>
            </section>
          </>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
        }
        .movie-box {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background-color: #1c1c1c;
          height: 420px;
          transition: transform 0.3s ease;
        }
        .movie-box:hover {
          transform: scale(1.03);
        }
        .movie-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .movie-bottom-overlay {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 20px 15px;
          background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0));
          color: #fff;
          z-index: 2;
        }
        .movie-hover-description {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          padding: 20px;
          background-color: rgba(0, 0, 0, 0.95);
          color: #ddd;
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 3;
          overflow-y: auto;
        }
        .movie-box:hover .movie-hover-description {
          opacity: 1;
        }
        .movie-box:hover .movie-bottom-overlay {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default FrontPage;
