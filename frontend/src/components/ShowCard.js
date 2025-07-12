import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ShowCard = ({ show, index = 0 }) => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const timerRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const getImagePath = (thumbnail) => {
    if (!thumbnail) return 'http://localhost:5000/shows/placeholder.jpg';
    return `/shows/${thumbnail}`;
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url?.split('v=')[1]?.split('&')[0];
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&loop=1&playlist=${videoId}`;
  };

  const handleImageError = (e, title, thumb) => {
    console.error(`Image error for ${title}`, thumb);
    e.target.src = '/placeholder.jpg';
  };

  const handleMouseEnter = () => {
    setHovered(true);
    timerRef.current = setTimeout(() => {
      if (show.TEASER) setShowVideo(true);
    }, 700);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    clearTimeout(timerRef.current);
    setShowVideo(false);
  };

  return (
    <div
      className="show-card"
      role="button"
      tabIndex={0}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: hovered ? 10 : 1
      }}
      onClick={() => navigate(`/show/${show.SHOW_ID}`)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/show/${show.SHOW_ID}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-image-container">
        {showVideo && show.TEASER ? (
          <div className="video-container">
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(show.TEASER)}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={show.TITLE}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ) : (
          <img
            src={getImagePath(show.THUMBNAIL)}
            alt={show.TITLE}
            className="card-image"
            loading="lazy"
            onError={(e) => handleImageError(e, show.TITLE, show.THUMBNAIL)}
          />
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{show.TITLE}</h3>
        <div className="card-rating">
          <span className="rating-star">⭐</span>
          <span className="rating-value">{show.RATING}</span>
        </div>
        <p className="card-description">
          {show.DESCRIPTION && show.DESCRIPTION.length > 120
            ? show.DESCRIPTION.substring(0, 120) + '...'
            : show.DESCRIPTION || 'No description available'}
        </p>
        <div className="card-genres">
          {show.GENRES || 'No genres available'}
        </div>
      </div>
    </div>
  );
};

export default ShowCard;