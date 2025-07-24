import React, { useState, useEffect, useCallback } from 'react';
import { FiMenu, FiSearch, FiCreditCard, FiUsers, FiX, FiFilter, FiBell, FiSettings, FiTrendingUp, FiClock, FiStar, FiWifi, FiWifiOff, FiChevronRight, FiAward } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children, activeSection, hasWatchAgain = true, hasTopRated = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [viewingActivity, setViewingActivity] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get user data on mount
  const [userImage, setUserImage] = useState(null);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load personalization data
  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const savedActivity = JSON.parse(localStorage.getItem('viewingActivity') || '[]');
    
    setRecentSearches(savedSearches.slice(0, 5)); // Last 5 searches
    setViewingActivity(savedActivity.slice(0, 3)); // Last 3 viewed
  }, []);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ No auth token found');
      return;
    }

    console.log('🔔 Fetching notifications...');
    try {
      const response = await fetch('http://localhost:5000/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (response.ok) {
        const notifications = await response.json();
        console.log('📬 Raw notifications from API:', notifications);
        
        // Transform API response to match frontend format
        const formattedNotifications = notifications.map(notif => {
          let parsedData = null;
          
          // Safely parse JSON data
          if (notif.DATA) {
            try {
              // If DATA is already an object, use it directly
              if (typeof notif.DATA === 'object') {
                parsedData = notif.DATA;
              } else {
                // If it's a string, try to parse it
                parsedData = JSON.parse(notif.DATA);
              }
            } catch (error) {
              console.warn('Failed to parse notification data:', notif.DATA, error);
              parsedData = null;
            }
          }
          
          return {
            id: notif.NOTIF_ID,
            type: notif.TYPE,
            message: notif.MESSAGE,
            time: formatTimeAgo(notif.CREATED_AT),
            unread: !notif.IS_READ,
            data: parsedData
          };
        });
        
        console.log('✨ Formatted notifications:', formattedNotifications);
        setNotifications(formattedNotifications);
      } else {
        const errorData = await response.text();
        console.error('❌ API error:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Test the notification routes
    fetch('http://localhost:5000/notifications/test')
      .then(res => res.json())
      .then(data => console.log('🧪 Test endpoint response:', data))
      .catch(err => console.error('❌ Test endpoint error:', err));
  }, []);

  // Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/search/genres')
      .then(res => res.json())
      .then(data => {
        const genreState = {};
        (data.genres || []).forEach(g => {
          genreState[g] = false;
        });
        setFilters(prev => ({
          ...prev,
          genre: genreState
        }));
        
        console.log('📚 Genres loaded:', data.genres);
        
        // Check for pending genre selection after genres are loaded
        const selectedGenre = sessionStorage.getItem('selectedGenre');
        const shouldOpenSearch = sessionStorage.getItem('openSearch');
        
        if (selectedGenre && shouldOpenSearch === 'true') {
          console.log('🎯 Processing pending genre selection:', selectedGenre);
          
          // Clear the session storage
          sessionStorage.removeItem('selectedGenre');
          sessionStorage.removeItem('openSearch');
          
          // Set the filter after genres are loaded
          setTimeout(() => {
            setSearchOpen(true);
            setSearchTerm('');
            setFilters(prev => ({
              ...prev,
              genre: {
                ...Object.keys(prev.genre).reduce((acc, key) => {
                  acc[key] = false;
                  return acc;
                }, {}),
                [selectedGenre]: true
              }
            }));
            console.log('✅ Genre filter set for:', selectedGenre);
          }, 100);
        }
      })
      .catch(err => console.error('Error loading genres:', err));
  }, []);

  const handleGenreChange = (genreName) => {
    console.log('🔧 Manual genre change:', genreName);
    setFilters(prev => ({
      ...prev,
      genre: {
        ...prev.genre,
        [genreName]: !prev.genre[genreName]
      }
    }));
  };

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

  const [filters, setFilters] = useState({
    category: {
      movie: true,
      series: true
    },
    genre: {}
  });

  // Enhanced search with suggestions - Updated to show all movies when search opens
// Enhanced search with suggestions - Updated to show all movies when search opens
useEffect(() => {
  if (!searchOpen) {
    setSearchResults([]);
    setIsSearching(false);
    setError('');
    setSearchSuggestions([]);
    return;
  }

  setIsSearching(true);
  setError('');

  const handler = setTimeout(() => {
    const token = localStorage.getItem('token');
    const { movie, series } = filters.category;
    const selectedGenres = Object.keys(filters.genre).filter(g => filters.genre[g]);
    const genreParam = selectedGenres.map(encodeURIComponent).join(',');
    
    // Use '*' for empty search to get all results
    const queryParam = searchTerm.trim() || '*';
    
    console.log('🔍 Frontend search params:', {
      query: queryParam,
      movie,
      series,
      genres: genreParam
    });
    
    fetch(`http://localhost:5000/search?query=${encodeURIComponent(queryParam)}&movie=${movie}&series=${series}&genres=${genreParam}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Search failed');
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ Frontend received results:', data.results?.length || 0);
        
        // Handle different possible response structures
        setSearchResults(data.results || data.shows || data || []);
        setIsSearching(false);
        
        // Save to recent searches - ONLY if searchTerm is not empty and not already in recent searches
        if (searchTerm.trim() && !recentSearches.includes(searchTerm)) {
          const updatedSearches = [searchTerm, ...recentSearches].slice(0, 5);
          setRecentSearches(updatedSearches);
          localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        }

        // Show suggestions for empty search
        if (!searchTerm.trim()) {
          setSearchSuggestions([
            ...recentSearches.map(search => ({ type: 'recent', value: search })),
            { type: 'trending', value: 'Breaking Bad' },
            { type: 'trending', value: 'Stranger Things' },
            { type: 'trending', value: 'The Office' }
          ]);
        }
      })
      .catch(err => {
        console.error('❌ Frontend search error:', err);
        setSearchResults([]);
        setIsSearching(false);
        setError('Search failed. Please try again.');
      });
  }, 300);

  return () => clearTimeout(handler);
}, [searchTerm, searchOpen, filters]);

  // Handle genre search from ShowDetails page
  useEffect(() => {
    const handleGenreSearch = (event) => {
      const genreName = event.detail.genre;
      
      console.log('🎯 Genre search triggered for:', genreName);
      
      // Open search
      setSearchOpen(true);
      
      // Clear search term to show all results
      setSearchTerm('');
      
      // Reset all genre filters first, then set the selected one
      setFilters(prev => {
        console.log('🔧 Current filters before update:', prev);
        const newFilters = {
          ...prev,
          genre: {
            ...Object.keys(prev.genre).reduce((acc, key) => {
              acc[key] = false;
              return acc;
            }, {}),
            [genreName]: true
          }
        };
        console.log('🔧 New filters after update:', newFilters);
        return newFilters;
      });
    };

    // Listen for custom event
    window.addEventListener('genreSearch', handleGenreSearch);

    return () => {
      window.removeEventListener('genreSearch', handleGenreSearch);
    };
  }, []);

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

  const handleFilterToggle = () => {
    setFilterOpen(prev => !prev);
  };

  const handleCategoryFilterChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: {
        ...prev.category,
        [category]: !prev.category[category]
      }
    }));
  };

  const handleSearchToggle = () => {
    setSearchOpen(prev => !prev);
    if (!searchOpen) {
      setSearchTerm('');
      setIsSearching(false);
      setError('');
      setSearchSuggestions([]);
    } else {
      setSearchTerm('');
      setSearchResults([]);
      setError('');
      setSearchSuggestions([]);
    }
  };

  const handleNotificationToggle = () => {
    setNotificationOpen(prev => {
      const newState = !prev;
      // Refresh notifications when opening the panel
      if (newState) {
        fetchNotifications();
      }
      return newState;
    });
  };

  const markNotificationAsRead = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, unread: false } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, unread: false }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    console.log('🔔 Notification clicked:', notification);
    
    // Mark as read first
    await markNotificationAsRead(notification.id);
    
    // Close notification panel
    setNotificationOpen(false);
    
    // Route based on notification type
    if (notification.type === 'billing_update') {
      // Navigate to Settings with billing mode
      console.log('💳 Navigating to billing settings');
      navigate('/settings?section=billing');
      return;
    } else if (notification.type === 'profile_update') {
      // Navigate to Settings with personal details mode
      console.log('👤 Navigating to personal settings');
      navigate('/settings?section=personal');
      return;
    }
    
    // Navigate based on notification type and data
    if (notification.data) {
      const { movie_id, comment_id, show_episode_id } = notification.data;
      
      if (notification.type === 'movie_update' && (movie_id)) {
        // Navigate to show details page
        const showId = movie_id;
        console.log('🎬 Navigating to show:', showId);
        navigate(`/show/${showId}`);
      } else if (notification.type === 'comment_reply' && comment_id) {
        // Navigate to the show where the comment was made
        if (notification.data.show_id || notification.data.movie_id) {
          const showId = notification.data.show_id || notification.data.movie_id;
          console.log('💬 Navigating to show with comment:', showId, 'comment:', comment_id);
          
          if (show_episode_id) {
            // Navigate to show with specific episode and comment
            console.log('📺 Switching to episode:', show_episode_id, 'and comment:', comment_id);
            navigate(`/show/${showId}?episode=${show_episode_id}&comment=${comment_id}`);
          } else {
            // Navigate to show without specific episode but with comment
            navigate(`/show/${showId}?comment=${comment_id}`);
          }
        }
      } 
    } else {
      console.log('⚠️ No navigation data available for notification');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.value);
    setSearchSuggestions([]);
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
    <div className="layout-container dark-theme">
      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="network-status offline">
          <FiWifiOff size={16} />
          <span>You're offline</span>
        </div>
      )}

      {/* Backdrop for mobile */}
      {menuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Enhanced Fixed Sidebar */}
      <div
        className={`sidebar ${menuOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <div className="sidebar-header">
          <div className="menu-icon-wrapper">
            <FiMenu size={24} className="menu-icon" />
            {!isOnline && <div className="offline-indicator" />}
          </div>
          {menuOpen && (
            <span
              className="logo-text logo-clickable"
              onClick={() => {
                window.location.href = '/frontpage';
                setMenuOpen(false);
                setSearchOpen(false);
                setSearchTerm('');
                setSearchResults([]);
                setError('');
              }}
              title="Go to frontpage"
            >
              RnbDom
            </span>
          )}
        </div>

        {menuOpen && (
          <div className="sidebar-content">
            {/* Enhanced Search Section */}
            <div className="search-section">
              <div className="menu-item" onClick={handleSearchToggle}>
                <FiSearch size={18} />
                <span>Search</span>
              </div>

              {/* Enhanced Search Input */}
              {searchOpen && (
                <div className="search-input-container">
                  <div className="search-input-wrapper">
                    <FiSearch size={16} className="search-input-icon" />
                    <input
                      type="text"
                      placeholder="Search shows, actors, directors..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="search-input"
                      autoFocus
                    />
                  </div>

                  {/* Search Suggestions */}
                  {searchSuggestions.length > 0 && (
                    <div className="search-suggestions">
                      {searchSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`suggestion-item ${suggestion.type}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.type === 'recent' && <FiClock size={14} />}
                          {suggestion.type === 'trending' && <FiTrendingUp size={14} />}
                          <span>{suggestion.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {isSearching && (
                    <div className="search-loading">
                      <div className="loading-spinner" />
                      <span>Searching...</span>
                    </div>
                  )}
                  {error && (
                    <div className="search-error">{error}</div>
                  )}
                </div>
              )}
            </div>

            {/* Continue Watching Section */}
            {viewingActivity.length > 0 && (
              <div className="continue-watching-section">
                <h4 className="section-title">Continue Watching</h4>
                <div className="continue-watching-list">
                  {viewingActivity.map((item, index) => (
                    <div key={index} className="continue-item">
                      <div className="continue-thumbnail">
                        <img src={`/shows/${item.thumbnail}`} alt={item.title} />
                        <div className="progress-indicator">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="continue-info">
                        <span className="continue-title">{item.title}</span>
                        <span className="continue-episode">S{item.season}E{item.episode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wiki Section */}
            <div className="wiki-section">
              <div className="wiki-header">
                <h3 className="wiki-title">Wiki</h3>
                <div className="wiki-underline"></div>
              </div>
              
              <div className="nav-section">
                <div className="menu-item" onClick={() => handleMenuItemClick('/actors')}>
                  <FiUsers size={18} />
                  <span>Actors</span>
                  <div className="nav-indicator" />
                </div>

                <div className="menu-item" onClick={() => handleMenuItemClick('/directors')}>
                  <FiUsers size={18} style={{ transform: 'scaleX(-1)' }} />
                  <span>Directors</span>
                  <div className="nav-indicator" />
                </div>

                <div className="menu-item" onClick={() => handleMenuItemClick('/awards')}>
                  <FiAward size={18} />
                  <span>Awards</span>
                  <div className="nav-indicator" />
                </div>
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
        {/* Enhanced Fixed Header */}
        <div className="header">
          <div className="header-left">
            {location.pathname === '/frontpage' && (
              <div className="section-nav-buttons">
                <button
                  onClick={() => scrollToSection('trending')}
                  className={`section-nav-btn ${activeSection === 'trending' ? 'active' : ''}`}
                >
                  <FiTrendingUp size={16} />
                  <span>Trending</span>
                </button>
                <button
                  onClick={() => scrollToSection('recommended')}
                  className={`section-nav-btn ${activeSection === 'recommended' ? 'active' : ''}`}
                >
                  <FiStar size={16} />
                  <span>Recommended</span>
                </button>
                {hasWatchAgain && (
                  <button
                    onClick={() => scrollToSection('watchagain')}
                    className={`section-nav-btn ${activeSection === 'watchagain' ? 'active' : ''}`}
                  >
                    <FiClock size={16} />
                    <span>Watch Again</span>
                  </button>
                )}
                {hasTopRated && (
                  <button
                    onClick={() => scrollToSection('toprated')}
                    className={`section-nav-btn ${activeSection === 'toprated' ? 'active' : ''}`}
                  >
                    <FiAward size={16} />
                    <span>Top Rated</span>
                  </button>
                )}
                <button
                  onClick={() => scrollToSection('actionhits')}
                  className={`section-nav-btn ${['actionhits', 'thriller', 'comedy', 'drama', 'family'].includes(activeSection) ? 'active' : ''}`}
                >
                  <FiChevronRight size={16} />
                  <span>Discover More</span>
                </button>
              </div>
            )}
          </div>

          <div className="header-right">
            {/* Notifications */}
            <div className="notifications-wrapper">
              <button 
                className="notification-bell"
                onClick={handleNotificationToggle}
                title="Notifications"
              >
                <FiBell size={20} />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationOpen && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <div className="notifications-actions">
                      {notifications.some(n => n.unread) && (
                        <button 
                          className="mark-all-read"
                          onClick={markAllNotificationsAsRead}
                          title="Mark all as read"
                        >
                          Mark all read
                        </button>
                      )}
                      <button 
                        className="close-notifications"
                        onClick={() => setNotificationOpen(false)}
                        title="Close notifications"
                      >
                        <FiChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`notification-item ${notification.unread ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-content">
                            <div className="notification-icon">
                              {notification.type === 'movie_update' && <FiTrendingUp size={16} />}
                              {notification.type === 'admin_notice' && <FiStar size={16} />}
                              {notification.type === 'comment_reply' && <FiClock size={16} />}
                              {notification.type === 'billing_update' && <FiCreditCard size={16} />}
                              {notification.type === 'profile_update' && <FiUsers size={16} />}
                            </div>
                            <div className="notification-text">
                              <p className="notification-message">{notification.message}</p>
                              <span className="notification-time">{notification.time}</span>
                            </div>
                          </div>
                          <div className="notification-arrow">
                            <FiChevronRight size={14} />
                          </div>
                          {notification.unread && <div className="unread-indicator" />}
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <FiBell size={32} />
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div 
              className="user-info-dropdown" 
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="user-info" title="Profile Menu">
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
                <div className="user-details">
                  <span className="user-name">{userName || 'User'}</span>
                  <span className="user-status">Premium Member</span>
                </div>
                <div className="user-status-indicator online" />
                <FiChevronRight className={`dropdown-arrow ${profileDropdownOpen ? 'open' : ''}`} />
              </div>
              
              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-item" onClick={() => navigate('/profile')}>
                    <FiUsers size={16} />
                    <span>Profile</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigate('/subscription')}>
                    <FiCreditCard size={16} />
                    <span>Subscriptions</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigate('/settings')}>
                    <FiSettings size={16} />
                    <span>Settings</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="content-area">
          {searchOpen ? (
            <>
              <div className="search-results-header" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="filter-button" onClick={handleFilterToggle}>
                  <FiFilter style={{ marginRight: '6px' }} />
                  Filter
                </button>
              </div>

              {filterOpen && (
                <div className="filter-section">
                  {/* Category Filter */}
                  <div className="filter-group">
                    <h3 className="filter-title">Category</h3>
                    <div className="filter-options">
                      <label className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.category.movie}
                          onChange={() => handleCategoryFilterChange('movie')}
                        />
                        <span className="checkmark"></span>
                        Movie
                      </label>
                      <label className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.category.series}
                          onChange={() => handleCategoryFilterChange('series')}
                        />
                        <span className="checkmark"></span>
                        Series
                      </label>
                    </div>
                  </div>

                  {/* Genre Filter */}
                  <div className="filter-group">
                    <h3 className="filter-title">Genre</h3>
                    <div className="filter-options">
                      {Object.keys(filters.genre).length > 0 ? (
                        Object.keys(filters.genre).map((genreName) => (
                          <label className="filter-checkbox" key={genreName}>
                            <input
                              type="checkbox"
                              checked={filters.genre[genreName]}
                              onChange={() => handleGenreChange(genreName)}
                            />
                            <span className="checkmark"></span>
                            {genreName}
                          </label>
                        ))
                      ) : (
                        <p className="coming-soon">Loading genres...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
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

      {/* Enhanced Styles - Modern UI/UX */}
      <style>{`
        /* CSS Custom Properties for Dynamic Theming */
        .layout-container {
          --primary-bg: linear-gradient(135deg, #1a1a2e 0%, rgb(31, 42, 74) 50%, #0f0f23 100%);
          --secondary-bg: rgba(8, 8, 20, 0.98);
          --accent-color: #667eea;
          --accent-secondary: #764ba2;
          --text-primary: #e0e0e0;
          --text-secondary: #b0b0b0;
          --text-muted: #9a9a9a;
          --border-color: rgba(255, 255, 255, 0.05);
          --glass-bg: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.08);
          --shadow-light: 0 4px 16px rgba(0,0,0,0.3);
          --shadow-heavy: 0 8px 32px rgba(0,0,0,0.5);
          --blur-amount: 15px;
          --transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
          --transition-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .layout-container {
          min-height: 100vh;
          background: var(--primary-bg);
          color: var(--text-primary);
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
          display: flex;
          position: relative;
          transition: all 0.3s var(--transition-smooth);
        }

        /* Network Status Indicator */
        .network-status {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(220, 38, 38, 0.9);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          z-index: 9999;
          backdrop-filter: blur(10px);
          animation: slideInRight 0.5s var(--transition-bounce);
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .offline-indicator {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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
          backdrop-filter: blur(4px);
        }

        /* Enhanced Sidebar with Modern Glassmorphism */
        .sidebar {
          background: var(--secondary-bg);
          backdrop-filter: blur(var(--blur-amount));
          border-right: 1px solid var(--border-color);
          transition: all 0.3s var(--transition-smooth);
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          box-shadow: var(--shadow-heavy);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .sidebar-closed {
          width: 60px;
        }

        .sidebar-open {
          width: 320px;
        }

        .sidebar-header {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 24px;
          background: var(--glass-bg);
        }

        .menu-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-icon {
          color: var(--text-secondary);
          transition: all 0.3s var(--transition-smooth);
          cursor: pointer;
        }

        .menu-icon:hover {
          color: var(--accent-color);
          transform: scale(1.1);
        }

        .logo-text {
          font-weight: 800;
          font-size: 28px;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s var(--transition-smooth);
          cursor: pointer;
          letter-spacing: -0.5px;
        }

        .logo-clickable:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
          text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
        }

        .sidebar-content {
          padding: 0 16px;
          animation: fadeInUp 0.4s var(--transition-smooth);
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          gap: 24px;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Enhanced Search Section */
        .search-section {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 20px;
        }

        .search-input-container {
          margin-top: 16px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 0 16px;
          transition: all 0.3s var(--transition-smooth);
          backdrop-filter: blur(10px);
        }

        .search-input-wrapper:focus-within {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--accent-color);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          transform: scale(1.02);
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 15px;
          padding: 14px 0;
          flex: 1;
          font-weight: 500;
        }

        .search-input::placeholder {
          color: var(--text-muted);
          font-weight: 400;
        }

        /* Search Suggestions */
        .search-suggestions {
          background: var(--secondary-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          margin-top: 8px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-light);
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateX(4px);
        }

        .suggestion-item.recent {
          color: var(--text-secondary);
        }

        .suggestion-item.trending {
          color: var(--accent-color);
        }

        .search-loading {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 12px;
          padding: 0 16px;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-top: 2px solid var(--accent-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Continue Watching Section */
        .continue-watching-section {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 20px;
        }

        .continue-watching-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .continue-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s var(--transition-smooth);
        }

        .continue-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .continue-thumbnail {
          position: relative;
          width: 50px;
          height: 30px;
          border-radius: 6px;
          overflow: hidden;
        }

        .continue-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .progress-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(0, 0, 0, 0.5);
        }

        .progress-fill {
          height: 100%;
          background: var(--accent-color);
          transition: width 0.3s ease;
        }

        .continue-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .continue-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .continue-episode {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Wiki Section */
        .wiki-section {
          margin-top: 32px;
        }

        .wiki-header {
          margin-bottom: 16px;
          padding: 0 20px;
        }

        .wiki-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px 0;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .wiki-underline {
          width: 120px;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-color), var(--accent-secondary));
          border-radius: 1px;
        }

        /* Navigation Menu */
        .nav-section {
          margin-top: 8px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          margin: 6px 0;
          cursor: pointer;
          transition: all 0.3s var(--transition-smooth);
          border-radius: 12px;
          position: relative;
          font-weight: 500;
          background: transparent;
          overflow: hidden;
        }

        .menu-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .menu-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: var(--accent-color);
          transform: translateX(8px);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
        }

        .menu-item:hover::before {
          left: 100%;
        }

        .menu-item.active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
          color: var(--accent-color);
          border-left: 3px solid var(--accent-color);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }

        .menu-item svg {
          flex-shrink: 0;
          transition: all 0.3s var(--transition-smooth);
        }

        .menu-item:hover svg {
          transform: scale(1.1) rotate(5deg);
        }

        .menu-item span {
          font-size: 15px;
          white-space: nowrap;
          opacity: 1;
          transition: all 0.3s var(--transition-smooth);
        }

        .sidebar-closed .menu-item span {
          opacity: 0;
          transform: translateX(-10px);
        }

        .nav-indicator {
          position: absolute;
          right: 16px;
          width: 4px;
          height: 0;
          background: var(--accent-color);
          border-radius: 2px;
          transition: height 0.3s var(--transition-smooth);
        }

        .menu-item:hover .nav-indicator {
          height: 20px;
        }

        .logout-section {
          margin-top: auto;
          margin-bottom: 16px;
          padding-top: 8px;
          border-top: 1px solid var(--border-color);
        }

        .logout-item {
          color: #ef4444 !important;
        }

        .logout-item:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #ef4444 !important;
        }

        /* Main Content Area */
        .main-content {
          flex: 1;
          transition: all 0.3s var(--transition-smooth);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: rgba(0, 0, 0, 0.02);
        }

        .main-content-closed {
          margin-left: 60px;
        }

        .main-content-open {
          margin-left: 320px;
        }

        /* Enhanced Header with Modern Features */
        .header {
          background: var(--secondary-bg);
          backdrop-filter: blur(var(--blur-amount));
          border-bottom: 1px solid var(--border-color);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow-light);
          gap: 48px; /* Gap between left and right sections */
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 32px; /* 32px gap between notification and user profile */
        }

        .section-nav-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-right: 20px; /* Push buttons slightly to the left */
        }

        .section-nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
          padding: 10px 16px; /* Reduced padding to fit 5 buttons */
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          font-weight: 500;
          font-size: 13px; /* Slightly smaller font */
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          white-space: nowrap; /* Prevent text wrapping */
        }

        .section-nav-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
          z-index: 1;
        }

        .section-nav-btn:hover {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 
            0 8px 25px rgba(102, 126, 234, 0.4),
            0 4px 15px rgba(118, 75, 162, 0.3);
        }

        .section-nav-btn:hover::before {
          left: 100%;
        }

        .section-nav-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        .section-nav-btn.active {
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
          border-color: rgba(255, 255, 255, 0.4);
          color: white;
          box-shadow: 
            0 6px 20px rgba(90, 103, 216, 0.5),
            0 3px 12px rgba(107, 70, 193, 0.4);
          transform: translateY(-1px);
        }

        .section-nav-btn.active::before {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        /* Responsive styles for section navigation buttons */
        @media (max-width: 1024px) {
          .section-nav-buttons {
            gap: 6px;
          }
          
          .section-nav-btn {
            padding: 8px 12px;
            font-size: 12px;
            gap: 4px;
          }
          
          .section-nav-btn span {
            display: none; /* Hide text on smaller screens */
          }
        }

        @media (max-width: 768px) {
          .section-nav-buttons {
            gap: 4px;
            margin-right: 10px;
          }
          
          .section-nav-btn {
            padding: 8px 10px;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            justify-content: center;
          }
        }

        /* Enhanced Notifications */
        .notifications-wrapper {
          position: relative;
        }

        .notification-bell {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s var(--transition-smooth);
        }

        .notification-bell:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent-color);
          transform: scale(1.1);
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: notificationPulse 2s infinite;
        }

        @keyframes notificationPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .notifications-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 400px;
          max-height: 500px;
          background: var(--secondary-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          box-shadow: var(--shadow-heavy);
          backdrop-filter: blur(20px);
          z-index: 1000;
          overflow: hidden;
          animation: dropdownSlideIn 0.3s var(--transition-bounce);
        }

        @keyframes dropdownSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .notifications-header {
          background: var(--glass-bg);
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .notifications-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mark-all-read {
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          color: var(--accent-color);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mark-all-read:hover {
          background: rgba(102, 126, 234, 0.2);
          border-color: var(--accent-color);
        }

        .notifications-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .mark-all-read {
          background: rgba(102, 126, 234, 0.1);
          color: var(--accent-color);
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .mark-all-read:hover {
          background: rgba(102, 126, 234, 0.2);
          transform: scale(1.05);
        }

        .notifications-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .notification-item {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .notification-item:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .notification-item:hover .notification-arrow {
          opacity: 1;
          transform: translateX(2px);
        }

        .notification-item.unread {
          border-left: 3px solid var(--accent-color);
          background: rgba(102, 126, 234, 0.03);
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.3), 
                      inset 0 0 20px rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.4);
          animation: glow-pulse 2s infinite;
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.3), 
                        inset 0 0 20px rgba(102, 126, 234, 0.1);
          }
          50% {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.5), 
                        inset 0 0 30px rgba(102, 126, 234, 0.2);
          }
        }

        .notification-content {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .notification-text {
          flex: 1;
        }

        .notification-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          color: var(--accent-color);
        }

        .notification-text {
          flex: 1;
        }

        .notification-message {
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 12px;
          color: var(--text-muted);
        }

        .notification-arrow {
          opacity: 0.4;
          color: var(--text-muted);
          transition: all 0.2s ease;
          margin-left: 8px;
        }

        .close-notifications {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--text-muted);
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-notifications:hover {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
          transform: translateX(2px);
        }

        .no-notifications {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted);
        }

        .no-notifications svg {
          margin-bottom: 12px;
          opacity: 0.5;
        }

        /* Enhanced User Profile */
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 8px 16px 8px 8px;
          cursor: pointer;
          transition: all 0.3s var(--transition-smooth);
          position: relative;
        }

        .user-info:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent-color);
          transform: scale(1.01);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
        }

        .user-avatar, .user-avatar-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .user-avatar {
          background: linear-gradient(135deg, var(--accent-color), var(--accent-secondary));
          color: white;
          font-weight: 700;
          font-size: 14px;
        }

        .user-avatar-img {
          object-fit: cover;
        }

        .user-avatar::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
          transform: rotate(-45deg);
          transition: all 0.6s ease;
          opacity: 0;
        }

        .user-info:hover .user-avatar::before {
          opacity: 1;
          animation: shimmer 1.5s ease-in-out;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(-45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(-45deg); }
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-status {
          font-size: 11px;
          color: var(--text-muted);
        }

        .user-status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-left: auto;
        }

        .user-status-indicator.online {
          background: #22c55e;
          animation: pulse 2s infinite;
        }

        /* Profile Dropdown Styles */
        .user-info-dropdown {
          position: relative;
        }

        .dropdown-arrow {
          transition: transform 0.3s ease;
          margin-left: 8px;
          color: var(--text-muted);
        }

        .dropdown-arrow.open {
          transform: rotate(90deg);
        }

        .profile-dropdown-menu {
          position: absolute;
          top: calc(100% + 2px);
          right: 0;
          background: var(--sidebar-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 8px 0;
          min-width: 200px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          z-index: 1000;
          animation: dropdownFadeIn 0.2s ease-out;
        }

        @keyframes dropdownFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
        }

        .dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: var(--accent-color);
        }

        .dropdown-item svg {
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .dropdown-item:hover svg {
          color: var(--accent-color);
        }

        /* Content Area */
        .content-area {
          flex: 1;
          padding: 24px 32px;
          overflow-y: auto;
          background: transparent;
        }

        /* Enhanced Search Results */
        .search-results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 0 4px;
        }

        .search-results-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .filter-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s var(--transition-smooth);
          font-weight: 500;
          font-size: 14px;
        }

        .filter-button:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: var(--accent-color);
          color: var(--accent-color);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
        }

        /* Enhanced Filter Section */
        .filter-section {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          animation: slideDown 0.3s var(--transition-smooth);
          backdrop-filter: blur(var(--blur-amount));
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .filter-group {
          margin-bottom: 24px;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 12px;
          border-radius: 10px;
          transition: all 0.3s var(--transition-smooth);
          user-select: none;
        }

        .filter-checkbox:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .filter-checkbox input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          position: relative;
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-color);
          border-radius: 4px;
          transition: all 0.3s var(--transition-smooth);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .filter-checkbox input[type="checkbox"]:checked + .checkmark {
          background: var(--accent-color);
          border-color: var(--accent-color);
          transform: scale(1.1);
        }

        .filter-checkbox input[type="checkbox"]:checked + .checkmark::after {
          content: '✓';
          color: white;
          font-size: 14px;
          font-weight: 700;
        }

        .coming-soon {
          color: var(--text-muted);
          font-style: italic;
          text-align: center;
          padding: 20px;
        }

        /* Movie Grid Enhanced */
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          padding: 24px 0;
        }

        .no-results {
          text-align: center;
          color: var(--text-muted);
          font-size: 18px;
          padding: 60px 20px;
          grid-column: 1 / -1;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .sidebar-open {
            width: 280px;
          }
          
          .main-content-open {
            margin-left: 280px;
          }
          
          .movie-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 992px) {
          .sidebar {
            position: fixed;
            transform: translateX(-100%);
            transition: transform 0.3s var(--transition-smooth);
          }
          
          .sidebar-open {
            transform: translateX(0);
          }
          
          .sidebar-backdrop {
            display: block !important;
          }
          
          .main-content {
            margin-left: 0 !important;
          }
          
          .header {
            padding: 12px 20px;
          }
          
          .content-area {
            padding: 20px 24px;
          }
          
          .movie-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 16px;
          }
          
          .filter-options {
            grid-template-columns: 1fr;
          }
          
          .notifications-dropdown {
            width: calc(100vw - 40px);
            right: -20px;
          }
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .button-group {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .header-button {
            flex: 1;
            min-width: 140px;
            padding: 14px 20px;
            font-size: 14px;
          }
          
          .content-area {
            padding: 16px 20px;
          }
          
          .movie-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 12px;
          }
          
          .search-results-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .filter-section {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .sidebar-open {
            width: 100vw;
          }
          
          .header {
            padding: 12px 16px;
          }
          
          .content-area {
            padding: 12px 16px;
          }
          
          .movie-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
          }
          
          .filter-section {
            padding: 16px;
          }
          
          .notifications-dropdown {
            width: calc(100vw - 32px);
            right: -16px;
          }
          
          .button-group {
            gap: 8px;
          }
          
          .header-button {
            padding: 12px 16px;
            font-size: 13px;
            min-width: 120px;
            border-radius: 40px;
          }
        }

        /* Dark Mode Toggle Animations */
        .layout-container.transitioning {
          transition: all 0.5s var(--transition-smooth);
        }

        .layout-container.transitioning * {
          transition: all 0.5s var(--transition-smooth);
        }

        /* Accessibility Improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Print Styles */
        @media print {
          .sidebar,
          .notifications-dropdown,
          .filter-section {
            display: none !important;
          }
          
          .main-content {
            margin-left: 0 !important;
          }
          
          .layout-container {
            background: white !important;
            color: black !important;
          }
        }

        .filter-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-title {
  color: #d0d0d0;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #b0b0b0;
  font-size: 14px;
  user-select: none;
  transition: color 0.2s ease;
}

.filter-checkbox:hover {
  color: #d0d0d0;
}

.filter-checkbox input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s ease;
}

.filter-checkbox input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(135deg, #4f46e5, #9333ea);
  border-color: #4f46e5;
}

.filter-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.coming-soon {
  color: #666;
  font-style: italic;
  font-size: 14px;
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

        .header-button.active-glow {
          text-shadow: 0 0 4px #8b5cf6, 0 0 8px #3b82f6;
          color: transparent;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          background-clip: text;
          filter: brightness(1.03) drop-shadow(0 0 2px #8b5cf6);
          animation: glowPulse 1.2s infinite alternate;
        }
        @keyframes glowPulse {
          from { filter: brightness(1.03) drop-shadow(0 0 2px #8b5cf6); }
          to { filter: brightness(1.08) drop-shadow(0 0 4px #8b5cf6); }
        }
        .header-button::after {
          content: none;
        }
        .header-button.active-glow::after {
          content: none;
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
          color:rgb(91, 76, 255); /* Red shine */
          transform: scale(1.20);
          text-shadow: 0 0 8px rgba(88, 76, 255, 0.8);
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
          transform: scale(1.01);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.25);
          z-index: 10;
        }

        
.search-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

        .filter-button {
  display: flex;
  align-items: right;
  gap: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background: linear-gradient(135deg, #4f46e5, #9333ea);
  color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(147, 51, 234, 0.4);
}

        .filter-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.6);
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
          margin-bottom: 16px;
          padding-top: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logout-item {
          color: #e53e3e !important;
        }

        .logout-item:hover {
          background: rgba(229, 62, 62, 0.15) !important;
          color: #ff6b6b !important;
        }

        .header-button.active-glow {
          text-shadow: 0 0 4px #8b5cf6, 0 0 8px #3b82f6;
          color: transparent;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          background-clip: text;
          filter: brightness(1.03) drop-shadow(0 0 2px #8b5cf6);
          animation: glowPulse 1.2s infinite alternate;
        }
        @keyframes glowPulse {
          from { filter: brightness(1.03) drop-shadow(0 0 2px #8b5cf6); }
          to { filter: brightness(1.08) drop-shadow(0 0 4px #8b5cf6); }
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

        .header-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          filter: grayscale(0.7) brightness(0.7);
          text-shadow: none;
          background: none;
          -webkit-text-fill-color: #b0b0b0;
          color: #b0b0b0;
          border: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}