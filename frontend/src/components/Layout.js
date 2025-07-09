import React, { useState, useEffect, useCallback } from 'react';
import { FiMenu, FiSearch, FiHeart, FiCreditCard, FiUsers, FiX } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Get user data on mount
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/frontpage', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch user data');
          return res.json();
        })
        .then(data => {
          setUserName(data.userName || 'User');
          setUserImage(data.profilePicture || null);
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          setUserName('User');
          setUserImage(null);
        });
    }
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      setError('');
      return;
    }

    setIsSearching(true);
    setError('');

    const handler = setTimeout(() => {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5000/search?query=${encodeURIComponent(searchTerm)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Search failed');
          }
          return res.json();
        })
        .then(data => {
          // Handle different possible response structures
          setSearchResults(data.results || data.shows || data || []);
          setIsSearching(false);
        })
        .catch(err => {
          console.error('Search error:', err);
          setSearchResults([]);
          setIsSearching(false);
          setError('Search failed. Please try again.');
        });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const renderShowBox = useCallback((show) => {
    // Safely access properties with fallbacks
    const showId = show.SHOW_ID || show.id || show.showId;
    const thumbnail = show.THUMBNAIL || show.thumbnail || show.poster || 'placeholder.jpg';
    const title = show.TITLE || show.title || show.name || 'Unknown Title';
    const rating = show.RATING || show.rating || show.score || 'N/A';
    const description = show.DESCRIPTION || show.description || show.summary || 'No description available';

    if (!showId) {
      console.warn('Show missing ID:', show);
      return null;
    }

    return (
      <div
        className="movie-box"
        key={showId}
        role="button"
        tabIndex={0}
        onClick={() => {
          navigate(`/show/${showId}`);
          setSearchOpen(false);     // <-- close search on navigation
          setSearchTerm('');        // <-- clear search input to remove results
          setSearchResults([]);     // <-- clear results too
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate(`/show/${showId}`);
            setSearchOpen(false);
            setSearchTerm('');
            setSearchResults([]);
          }
        }}
      >
        <img
          src={`/shows/${thumbnail}`}
          alt={title}
          className="movie-thumbnail"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder.jpg'; // Fallback image
          }}
        />
        <div className="movie-bottom-overlay">
          <h3>{title}</h3>
          <p>⭐ {rating}</p>
        </div>
        <div className="movie-hover-description" style={{ textAlign: 'left', wordWrap: 'break-word', whiteSpace: 'normal', maxWidth: '90%' }}>
          <p>
            <strong>Title:</strong> {title}
          </p>
          <p>
            <strong>Synopsis:</strong> {description}
          </p>
          <p style={{ marginBottom: '6px' }}>
            <strong>Genres:</strong> {show.GENRES || 'N/A'}
          </p>
        </div>
      </div>
    );
  }, [navigate]);

  const handleSearchToggle = () => {
    setSearchOpen(prev => !prev);
    if (searchOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setError('');
    }
  };

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('token');
    // Navigate to login page
    navigate('/auth');
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    // Close menu on mobile after navigation
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="layout-container">
      {/* Backdrop for mobile */}
      {menuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <div
        className={`sidebar ${menuOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <div className="sidebar-header">
          <FiMenu size={24} className="menu-icon" />
          {menuOpen && (
            <span
              className="logo-text logo-clickable"
              onClick={() => {
                navigate('/frontpage');
                setMenuOpen(false);
              }}
              title="Go to frontpage"
            >
              RnbDom
            </span>
          )}
        </div>

        {menuOpen && (
          <div className="sidebar-content">
            {/* Search Section */}
            <div className="search-section">
              <div className="menu-item" onClick={handleSearchToggle}>
                <FiSearch size={18} />
                <span>Search</span>
                {searchOpen && <FiX size={16} className="close-icon" />}
              </div>

              {/* Enhanced Search Input */}
              {searchOpen && (
                <div className="search-input-container">
                  <div className="search-input-wrapper">
                    <FiSearch size={16} className="search-input-icon" />
                    <input
                      type="text"
                      placeholder="Search shows..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="search-input"
                      autoFocus
                    />
                    {searchTerm && (
                      <FiX
                        size={16}
                        className="clear-search-icon"
                        onClick={() => setSearchTerm('')}
                      />
                    )}
                  </div>
                  {isSearching && (
                    <div className="search-loading">Searching...</div>
                  )}
                  {error && (
                    <div className="search-error">{error}</div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Items */}
            <div className="nav-section">
              <div className="menu-item" onClick={() => handleMenuItemClick('/actors')}>
                <FiUsers size={18} />
                <span>Actors</span>
              </div>

              <div className="menu-item" onClick={() => handleMenuItemClick('/subscription')}>
                <FiCreditCard size={18} />
                <span>Subscription</span>
              </div>

              <div className="menu-item" onClick={() => handleMenuItemClick('/favourites')}>
                <FiHeart size={18} />
                <span>Favourites</span>
              </div>
            </div>

            {/* Logout Section */}
            <div className="logout-section">
              <div className="menu-item logout-item" onClick={handleLogout}>
                <FiX size={18} />
                <span>Logout</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Fixed Header with user info */}
        <div className="header">
          {location.pathname === '/frontpage' && (
            <div className="button-group">
              <button onClick={() => scrollToSection('trending')} className="header-button">Trending</button>
              <button onClick={() => scrollToSection('recommended')} className="header-button">Recommended</button>
              <button onClick={() => scrollToSection('watchagain')} className="header-button">Watch Again</button>
            </div>
          )}

          <div className="user-info" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            {userImage ? (
              <img
                src={`http://localhost:5000/images/user/${userImage}`}
                alt="Profile"
                className="user-avatar-img"
                onError={(e) => { e.target.src = '/images/user/default-avatar.png'; }}
              />
            ) : (
              <div className="user-avatar">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="user-name">{userName || 'User'}</span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="content-area">
          {searchTerm.trim() !== '' ? (
            <>
              <h2 className="search-results-title">
                Search Results {isSearching && '(Searching...)'}
              </h2>
              <div className="movie-grid">
                {searchResults.length > 0
                  ? searchResults.map(show => renderShowBox(show)).filter(Boolean)
                  : !isSearching && <p className="no-results">No results found</p>}
              </div>
            </>
          ) : (
            children
          )}
        </div>
      </div>

      {/* Enhanced Styles - Fixed Layout */}
      <style>{`
        .layout-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
          color: #e0e0e0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          position: relative;
        }

        .sidebar-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 999;
          display: none;
        }

        .header-button {
          font-weight: 700;
          font-size: 1.2rem;
          padding: 8px 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          outline: none;

          /* Gradient text */
          background: linear-gradient(90deg, #3b82f6, #8b5cf6); /* blue to bright purple */
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          text-decoration: underline;
          text-underline-offset: 4px;
          position: relative;
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }

        .header-button::after {
          content: "";
          position: absolute;
          left: 15%;
          right: 15%;
          bottom: 4px;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transform-origin: center;
          transform: scaleX(1);
          transition: transform 0.3s ease, opacity 0.3s ease;
          border-radius: 1px;
          pointer-events: none;
          opacity: 0.6;
        }

        .header-button:hover {
          /* Make text glow in purple */
          text-shadow: 0 0 10px #8b5cf6, 0 0 15px #3b82f6;
          color: transparent; /* keep gradient */
        }

        .header-button:hover::after {
          transform: scaleX(1.4);
          opacity: 1;
        }

        .button-group {
          margin-right: 50px;
          display: inline-flex; /* keep buttons inline */
          gap: 10px; /* optional spacing */
        }

        .logo-text {
          font-weight: 700;
          font-size: 24px; /* Larger */
          color: #e0e0e0;
          margin-left: 40px; /* Shift right */
          transition: all 0.3s ease;
        }

        .logo-clickable:hover {
          color: #ff4c4c; /* Red shine */
          transform: scale(1.20);
          text-shadow: 0 0 8px rgba(255, 76, 76, 0.8);
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .sidebar-backdrop {
            display: block;
          }
        }

        /* CUSTOM SCROLLBAR STYLES */
        .sidebar::-webkit-scrollbar {
          width: 8px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          margin: 8px 0;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4a5568, #2d3748);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6578, #3d4758);
          box-shadow: 0 0 6px rgba(74, 85, 104, 0.4);
        }

        .sidebar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(135deg, #6a7588, #4d5768);
        }

        .sidebar::-webkit-scrollbar-corner {
          background: rgba(255, 255, 255, 0.02);
        }

        /* Firefox scrollbar */
        .sidebar {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 rgba(255, 255, 255, 0.02);
        }

        /* FIXED SIDEBAR */
        .sidebar {
          background: rgba(8, 8, 20, 0.98);
          backdrop-filter: blur(15px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-closed {
          width: 60px;
        }

        .sidebar-open {
          width: 280px;
        }

        .sidebar-header {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 20px;
        }

        .menu-icon {
          color: #b0b0b0;
          transition: color 0.2s ease;
        }

        .menu-icon:hover {
          color: #4a5568;
        }

        .sidebar-content {
          padding: 0 15px;
          animation: fadeIn 0.3s ease;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
          padding-right: 8px; /* Add space for scrollbar */
        }

        .search-section {
          margin-bottom: 30px;
        }

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #9a9a9a;
          font-size: 15px;
          position: relative;
        }

        .menu-item:hover {
          background: rgba(74, 85, 104, 0.2);
          color: #d0d0d0;
          transform: translateX(2px);
        }

        .close-icon {
          margin-left: auto;
          opacity: 0.6;
        }

        .search-input-container {
          margin-top: 12px;
          padding-left: 15px;
          padding-right: 15px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0 12px;
          transition: all 0.2s ease;
        }

        .search-input-wrapper:focus-within {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(74, 85, 104, 0.4);
          box-shadow: 0 0 0 3px rgba(74, 85, 104, 0.1);
        }

        .search-input-icon {
          color: #666;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          color: #d0d0d0;
          font-size: 14px;
          padding: 10px 0;
          flex: 1;
          min-width: 0;
        }

        .search-input::placeholder {
          color: #666;
        }

        .clear-search-icon {
          color: #666;
          cursor: pointer;
          margin-left: 8px;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }

        .clear-search-icon:hover {
          color: #9a9a9a;
        }

        .search-loading {
          font-size: 12px;
          color: #666;
          margin-top: 8px;
          padding-left: 12px;
        }

        .search-error {
          font-size: 12px;
          color: #e53e3e;
          margin-top: 8px;
          padding-left: 12px;
        }

        /* MAIN CONTENT WITH PROPER MARGINS */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          margin-left: 60px; /* Space for closed sidebar */
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Adjust margin when sidebar is open */
        .sidebar-open ~ .main-content {
          margin-left: 280px;
        }

        /* FIXED HEADER */
        .header {
          padding: 20px 40px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: fixed;
          top: 0;
          right: 0;
          left: 60px; /* Start after closed sidebar */
          z-index: 100;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Adjust header position when sidebar is open */
        .sidebar-open ~ .main-content .header {
          left: 280px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: rgba(187, 104, 104, 0.03);
          border-radius: 25px;
          transition: all 0.3s ease;
          border: 1px solid rgba(158, 97, 97, 0.05);
          cursor: pointer;
        }

        .user-info:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.1);
          transform: scale(1.3);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.25);
          z-index: 10;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4a5568, #2d3748);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          color: #e0e0e0;
        }

        .user-avatar-img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .user-name {
          font-weight: 500;
          color: #b0b0b0;
        }

        /* SCROLLABLE CONTENT AREA */
        .content-area {
          flex: 1;
          padding: 100px 40px 30px; /* Top padding to account for fixed header */
          overflow-y: auto;
          margin-top: 0;
        }

        .search-results-title {
          color: #b0b0b0;
          margin-bottom: 25px;
          font-size: 24px;
          font-weight: 600;
        }

        .no-results {
          color: #666;
          text-align: center;
          padding: 40px;
          font-size: 16px;
        }

        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
        }

        .movie-box {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background-color: #1c1c1c;
          height: 420px;
          width: 310px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }

        .movie-box:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
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
          background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0));
          color: #e0e0e0;
          z-index: 2;
        }

        .movie-hover-description {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.96), rgba(22, 33, 62, 0.96));
          color: #d0d0d0;
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 3;
          overflow-y: auto;
          backdrop-filter: blur(15px);
        }

        .movie-box:hover .movie-hover-description {
          opacity: 1;
        }

        .movie-box:hover .movie-bottom-overlay {
          opacity: 0;
        }

        .logout-section {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logout-item {
          color: #e53e3e !important;
        }

        .logout-item:hover {
          background: rgba(229, 62, 62, 0.15) !important;
          color: #ff6b6b !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .sidebar-open {
            position: fixed;
            height: 100vh;
            z-index: 1001;
            left: 0;
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .header {
            left: 0;
            padding: 15px 20px;
          }
          
          .content-area {
            padding: 80px 20px 20px;
          }
        }
      `}</style>
    </div>
  );
}