import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Info, Plus, ThumbsUp, Share2, Volume2, VolumeX, Star, Clock, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const TrendingCarousel = ({ shows = [], onShowClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dragState, setDragState] = useState({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 4 });
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [watchProgress, setWatchProgress] = useState({});
  const [isFavorite, setIsFavorite] = useState(shows[currentIndex]?.IS_FAVORITE || false);


  const carouselRef = useRef(null);
  const previewTimeoutRef = useRef(null);
  const autoplayRef = useRef(null);
  const progressRef = useRef(null);

  const getBannerPath = (banner) => {
    if (!banner) return 'http://localhost:5000/banners/placeholder.jpg';
    return `http://localhost:5000/banners/${banner}`;
  };

  useEffect(() => {
  const show = shows[currentIndex];
  if (show) {
    setIsFavorite(show.IS_FAVORITE === 1);
  }
}, [currentIndex, shows]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplayEnabled && shows.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % shows.length);
      }, 6000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [autoplayEnabled, shows.length]);

  // Preview functionality
  const handleMouseEnter = useCallback((index) => {
    setHoveredIndex(index);
    clearTimeout(previewTimeoutRef.current);
    previewTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 800);
  }, []);

  const toggleFavorite = () => {
    const token = localStorage.getItem('token');
    if (!token || !currentShow?.SHOW_ID) return;

    axios.post(`http://localhost:5000/favorite/${currentShow.SHOW_ID}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setIsFavorite(res.data.favorite);
    })
    .catch((err) => {
      console.error('Failed to toggle favorite:', err);
    });
  };

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setShowPreview(false);
    clearTimeout(previewTimeoutRef.current);
  }, []);

  // Touch/drag functionality
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragState({
      isDragging: true,
      startX: touch.clientX,
      scrollLeft: carouselRef.current.scrollLeft
    });
  };

  const handleTouchMove = (e) => {
    if (!dragState.isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const walk = (touch.clientX - dragState.startX) * 2;
    carouselRef.current.scrollLeft = dragState.scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setDragState({ isDragging: false, startX: 0, scrollLeft: 0 });
  };

  // Navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
    setAutoplayEnabled(false);
    setTimeout(() => setAutoplayEnabled(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % shows.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + shows.length) % shows.length);
  };

  const currentShow = shows[currentIndex] || {};

  if (shows.length === 0) {
    return <div className="trending-carousel">No trending shows available</div>;
  }

  return (
    <div className="trending-carousel">
      {/* Main Featured Section */}
      <div className="featured-section">
        <div className="featured-background">
          <div className="gradient-overlay" />
          <div className="noise-overlay" />
          <div
            className="background-image"
            style={{
              backgroundImage: `url(${getBannerPath(currentShow.BANNER)})`,
              transform: `scale(${1 + currentIndex * 0.02})`,
              filter: `hue-rotate(${currentIndex * 30}deg)`
            }}
          />
        </div>

        <div className="featured-content">
          <div className="trending-badge">
            <TrendingUp size={16} />
            <span>#{currentShow.TRENDING_RANK} Trending</span>
          </div>

          <h1 className="featured-title">
            {currentShow.TITLE}
            <div className="title-glow" />
          </h1>

          <div className="show-meta">
            <div className="meta-item">
              <Star size={16} fill="currentColor" />
              <span>{currentShow.RATING}</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>{currentShow.DURATION}</span>
            </div>
            <div className="meta-item">
              <Users size={16} />
              <span>{currentShow.VIEWERS} viewers</span>
            </div>
            <div className="meta-item year">
              <span>{currentShow.YEAR}</span>
            </div>
          </div>

          <p className="featured-description">
            {currentShow.DESCRIPTION}
          </p>

          <div className="genre-tags">
            {currentShow.GENRES?.split(', ').map((genre, index) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
          </div>

          {currentShow.PROGRESS > 0 && (
            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${currentShow.PROGRESS * 100}%` }}
                />
              </div>
              <span className="progress-text">
                {Math.round(currentShow.PROGRESS * 100)}% watched
              </span>
            </div>
          )}

          <div className="action-buttons">
            <button
              className="play-button"
              onClick={() => onShowClick?.(currentShow.SHOW_ID)}
            >
              <Play size={20} fill="currentColor" />
              <span>Play</span>
            </button>

            <div className="secondary-actions">
              <motion.button
                onClick={toggleFavorite}
                style={{
                  background: 'rgba(22, 33, 62, 0.85)',
                  color: '#fff',
                  border: '2px solid #533483',
                  padding: '13px 30px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{ background: 'rgba(255,255,255,0.1)', scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  style={{ fontSize: '1.2rem' }}
                  animate={{
                    scale: isFavorite ? [1, 1.2, 1] : 1,
                    rotate: isFavorite ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {isFavorite ? '💙' : '🤍'}
                </motion.span>
                {isFavorite ? 'Remove from List' : 'Add to List'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="navigation-controls">
          <button
            className="nav-btn prev"
            onClick={prevSlide}
            disabled={shows.length <= 1}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="slide-indicators">
            {shows.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              >
                <div className="indicator-fill" />
              </button>
            ))}
          </div>

          <button
            className="nav-btn next"
            onClick={nextSlide}
            disabled={shows.length <= 1}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <style>{`
        .trending-carousel {
          position: relative;
          width: 100%;
          max-width: 1270px;
          margin: 0 auto;
          color: white;
        }

        .featured-section {
          position: relative;
          height: 90vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .featured-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.9) 100%
          );
          z-index: 2;
        }

        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 80, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 120, 147, 0.1) 0%, transparent 50%);
          z-index: 3;
        }

        .featured-content {
          position: relative;
          z-index: 4;
          max-width: 800px;
          padding: 0 60px;
          animation: fadeInUp 1s ease-out;
        }

        .trending-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .featured-title {
          position: relative;
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 900;
          margin: 0 0 24px 0;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
        }

        .title-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          filter: blur(20px);
          opacity: 0.3;
          z-index: -1;
        }

        .show-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .meta-item.year {
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .featured-description {
          font-size: 18px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 24px;
          max-width: 600px;
        }

        .genre-tags {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .genre-tag {
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .progress-section {
          margin-bottom: 32px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .play-button {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .play-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.6);
        }

        .info-button {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 14px 28px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .info-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .secondary-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.1);
        }

        .navigation-controls {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 20px;
          z-index: 5;
        }

        .nav-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .nav-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .slide-indicators {
          display: flex;
          gap: 12px;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .indicator.active {
          background: white;
          transform: scale(1.2);
        }

        .indicator-fill {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .indicator.active .indicator-fill {
          opacity: 1;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .featured-content {
            padding: 0 40px;
          }
        }

        @media (max-width: 768px) {
          .featured-section {
            height: 70vh;
            min-height: 500px;
          }
          
          .featured-content {
            padding: 0 20px;
          }
          
          .featured-title {
            font-size: clamp(2rem, 6vw, 3rem);
          }
          
          .show-meta {
            gap: 16px;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .secondary-actions {
            align-self: stretch;
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {
          .featured-content {
            padding: 0 16px;
          }
          
          .navigation-controls {
            bottom: 20px;
            gap: 12px;
          }
          
          .nav-btn {
            width: 40px;
            height: 40px;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus states for accessibility */
        .play-button:focus,
        .info-button:focus,
        .action-btn:focus,
        .nav-btn:focus,
        .indicator:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default TrendingCarousel;