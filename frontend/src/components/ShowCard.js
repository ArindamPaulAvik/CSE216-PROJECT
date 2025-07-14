import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Play, Volume2, VolumeX, Star } from 'lucide-react';

const ShowCard = ({ show, index = 0 }) => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(show?.IS_FAVORITE || false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  
  const timerRef = useRef(null);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  const getImagePath = (thumbnail) => {
    if (!thumbnail) return 'http://localhost:5000/shows/placeholder.jpg';
    return `/shows/${thumbnail}`;
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;
    
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&loop=1&playlist=${videoId}&enablejsapi=1&origin=${window.location.origin}`;
  };

  const handleImageError = (e, title, thumb) => {
    console.error(`Image error for ${title}`, thumb);
    e.target.src = '/placeholder.jpg';
  };

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    // Preload video after a short delay
    if (show.TEASER) {
      timerRef.current = setTimeout(() => {
        setShowVideo(true);
        setTimeout(() => setVideoReady(true), 300);
      }, 800);
    }
  }, [show.TEASER]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    clearTimeout(timerRef.current);
    setShowVideo(false);
    setVideoReady(false);
  }, []);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFavorite = useCallback(async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const url = `http://localhost:5000/favorite/${show.SHOW_ID}`;
      
      console.log(`POST ${url}`, { showId: show.SHOW_ID, currentFavorite: isFavorite });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setIsFavorite(result.favorite);
        console.log('Favorite status updated successfully:', result);
      } else {
        const errorText = await response.text();
        console.error('Failed to update favorite status:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [isFavorite, show.SHOW_ID]);

  const handleCardClick = useCallback(() => {
    navigate(`/show/${show.SHOW_ID}`);
  }, [navigate, show.SHOW_ID]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`show-card ${isHovered ? 'hovered' : ''} ${imageLoaded ? 'loaded' : ''}`}
      role="button"
      tabIndex={0}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        '--hover-scale': isHovered ? '1.2' : '1',
        '--hover-z': isHovered ? '100' : '1'
      }}
      onClick={handleCardClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-image-container">
        {/* Background Image */}
        <img
          src={getImagePath(show.THUMBNAIL)}
          alt={show.TITLE}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => handleImageError(e, show.TITLE, show.THUMBNAIL)}
        />

        {/* Video Overlay */}
        {showVideo && show.TEASER && (
          <div className={`video-container ${videoReady ? 'ready' : ''}`}>
            <iframe
              ref={videoRef}
              src={getYouTubeEmbedUrl(show.TEASER)}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={show.TITLE}
              className="video-iframe"
              onLoad={() => setVideoReady(true)}
            />
            
            {/* Video Controls Overlay */}
            <div className="video-controls">
              <button
                className="control-btn mute-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            {/* Gradient overlays to hide YouTube branding */}
            <div className="video-overlay-top"></div>
            <div className="video-overlay-bottom"></div>
          </div>
        )}

        {/* Card Actions */}
        <div className={`card-actions ${isHovered ? 'visible' : ''}`}>
          <button
            className="action-btn favorite-btn"
            onClick={toggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              size={20} 
              fill={isFavorite ? '#ff4757' : 'transparent'} 
              color={isFavorite ? '#ff4757' : '#ffffff'}
            />
          </button>
          
          <button
            className="action-btn play-btn"
            onClick={handleCardClick}
            aria-label="Play show"
          >
            <Play size={20} fill="#ffffff" />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="rating-badge">
          <Star size={14} fill="#ffd700" color="#ffd700" />
          <span>{show.RATING}</span>
        </div>

        {/* Progress Bar (if watch progress exists) */}
        {show.WATCH_PROGRESS && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${show.WATCH_PROGRESS}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Enhanced Card Content */}
      <div className={`card-content ${isHovered ? 'expanded' : ''}`}>
        <div className="content-main">
          <h3 className="card-title">{show.TITLE}</h3>
          
          <div className="card-meta">
            <div className="meta-item">
              <span className="year">{show.YEAR || 'N/A'}</span>
            </div>
            {show.DURATION && (
              <div className="meta-item">
                <span className="duration">{show.DURATION}</span>
              </div>
            )}
            {show.MATURITY_RATING && (
              <div className="meta-item maturity-rating">
                {show.MATURITY_RATING}
              </div>
            )}
          </div>

          <p className="card-description">
            {show.DESCRIPTION && show.DESCRIPTION.length > 120
              ? show.DESCRIPTION.substring(0, 120) + '...'
              : show.DESCRIPTION || 'No description available'}
          </p>

          <div className="card-genres">
            {show.GENRES ? 
              show.GENRES.split(',').slice(0, 3).map((genre, idx) => (
                <span key={idx} className="genre-tag">
                  {genre.trim()}
                </span>
              )) : 
              <span className="genre-tag">No genres</span>
            }
          </div>
        </div>

        {/* Additional content shown on hover */}
        <div className="content-expanded">
          <div className="cast-info">
            {show.CAST && (
              <div className="cast-section">
                <span className="section-label">Cast:</span>
                <span className="cast-names">
                  {show.CAST.split(',').slice(0, 2).join(', ')}
                </span>
              </div>
            )}
            
            {show.DIRECTOR && (
              <div className="director-section">
                <span className="section-label">Director:</span>
                <span className="director-name">{show.DIRECTOR}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ripple effect on click */}
      <div className="ripple-container"></div>
    </div>
  );
};

export default ShowCard;