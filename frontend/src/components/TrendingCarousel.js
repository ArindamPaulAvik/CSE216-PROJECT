import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Volume2, VolumeX, Star, Clock, Users, TrendingUp, ChevronLeft, ChevronRight, Pause } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './TrendingCarousel.css';

const TrendingCarousel = ({ shows = [], onShowClick, userPreferences = { playTrailerOnHover: false } }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [watchProgress, setWatchProgress] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  const autoplayRef = useRef(null);
  const previewTimeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const stopVideoTimeoutRef = useRef(null);

  // Initialize favorites state
  useEffect(() => {
    const show = shows[currentIndex];
    if (show) {
      setIsFavorite(show.IS_FAVORITE === 1);
      setImageLoaded(false);
      setVideoReady(false);
      setIsVideoPlaying(false);
      
      // Don't auto-start video - only on hover
    }
  }, [currentIndex, shows]);

  // Enhanced autoplay with smooth transitions - pause when hovered
  useEffect(() => {
    if (autoplayEnabled && shows.length > 1 && !isHovered && !showPreview) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % shows.length);
      }, 12000); // Optimal 12-second duration per UX research
    }
    return () => clearInterval(autoplayRef.current);
  }, [autoplayEnabled, shows.length, isHovered, showPreview]);

  // Utility functions
  const getBannerPath = (banner) => {
    if (!banner) return `${BASE_URL}/banners/placeholder.jpg`;
    return `${BASE_URL}/banners/${banner}`;
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;
    
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&loop=1&playlist=${videoId}&enablejsapi=1&origin=${window.location.origin}`;
  };

  // Enhanced navigation
  const navigateToSlide = useCallback((index) => {
    if (index >= 0 && index < shows.length) {
      setCurrentIndex(index);
      setAutoplayEnabled(false);
      setTimeout(() => setAutoplayEnabled(true), 15000); // Re-enable after user interaction
    }
  }, [shows.length]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? shows.length - 1 : currentIndex - 1;
    navigateToSlide(newIndex);
  }, [currentIndex, shows.length, navigateToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % shows.length;
    navigateToSlide(newIndex);
  }, [currentIndex, shows.length, navigateToSlide]);

  // Enhanced favorites management with proper API endpoint
  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!shows[currentIndex]) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.post(`${BASE_URL}/favorite/${shows[currentIndex].SHOW_ID}`, {}, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        setIsFavorite(response.data.favorite);
        shows[currentIndex].IS_FAVORITE = response.data.favorite ? 1 : 0;
        console.log('Favorite status updated successfully:', response.data);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Enhanced video preview management
  const handleVideoToggle = useCallback(() => {
    if (isVideoPlaying) {
      setIsVideoPlaying(false);
      setVideoReady(false);
    } else {
      setIsVideoPlaying(true);
      if (shows[currentIndex]?.TEASER) {
        setTimeout(() => setVideoReady(true), 500);
      }
    }
  }, [isVideoPlaying, shows, currentIndex]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Enhanced hover functionality
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    // Clear any existing timeouts
    clearTimeout(hoverTimeoutRef.current);
    clearTimeout(stopVideoTimeoutRef.current);
    
    // Start playing trailer after a brief delay - only if user preference allows it
    if (shows[currentIndex]?.TEASER && userPreferences.playTrailerOnHover) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsVideoPlaying(true);
        setTimeout(() => setVideoReady(true), 500);
      }, 1500); // Start after 1.5s
    }
  }, [shows, currentIndex, userPreferences.playTrailerOnHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    // Clear hover timeout
    clearTimeout(hoverTimeoutRef.current);
    
    // Stop video after 1 second delay
    stopVideoTimeoutRef.current = setTimeout(() => {
      setIsVideoPlaying(false);
      setVideoReady(false);
    }, 1000); // Stop after 1 second
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutRef.current);
      clearTimeout(stopVideoTimeoutRef.current);
      clearTimeout(previewTimeoutRef.current);
    };
  }, []);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          handleVideoToggle();
          break;
        case 'Escape':
          e.preventDefault();
          setShowPreview(false);
          setIsVideoPlaying(false);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToPrevious, goToNext, handleVideoToggle, toggleMute]);

  // Enhanced progress tracking
  const calculateProgress = (show) => {
    if (!show || !show.EPISODES || show.EPISODES.length === 0) return 0;
    const totalEpisodes = show.EPISODES.length;
    const watchedEpisodes = watchProgress[show.ID] || 0;
    return Math.min((watchedEpisodes / totalEpisodes) * 100, 100);
  };

  // Format rating display
  const formatRating = (rating) => {
    if (!rating) return 'N/A';
    return typeof rating === 'number' ? rating.toFixed(1) : rating;
  };

  // Format viewer count
  const formatViewers = (viewers) => {
    if (!viewers) return 'N/A';
    if (viewers >= 1000000) return `${(viewers / 1000000).toFixed(1)}M`;
    if (viewers >= 1000) return `${(viewers / 1000).toFixed(1)}K`;
    return viewers.toString();
  };

  if (!shows || shows.length === 0) {
    return (
      <div className="trending-carousel-empty">
        <div className="empty-state">
          <TrendingUp size={48} />
          <h3>No trending shows available</h3>
          <p>Check back later for the latest trending content</p>
        </div>
      </div>
    );
  }

  const currentShow = shows[currentIndex] || {};
  const hasVideo = currentShow.TEASER && isVideoPlaying && videoReady;
  const progress = calculateProgress(currentShow);

  return (
    <div 
      className="trending-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Featured Section */}
      <div className="featured-section">
        <div className="featured-background">
          <div className="gradient-overlay" />
          <div className="noise-overlay" />
          <motion.div
            key={currentIndex}
            className="background-image"
            style={{
              backgroundImage: `url(${getBannerPath(currentShow.BANNER)})`,
            }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Video Preview Overlay */}
          <AnimatePresence>
            {hasVideo && (
              <motion.div
                className="video-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <iframe
                  src={getYouTubeEmbedUrl(currentShow.TEASER)}
                  title="Show Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          className="featured-content"
          key={currentIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="trending-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <TrendingUp size={16} />
            <span>#{currentIndex + 1} Trending</span>
          </motion.div>

          <motion.h1 
            className="featured-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {currentShow.TITLE}
            <div className="title-glow" />
          </motion.h1>

          <motion.div 
            className="show-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="meta-item">
              <Star size={16} fill="currentColor" />
              <span>{formatRating(currentShow.RATING)}</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>{currentShow.DURATION || 'N/A'}</span>
            </div>
            <div className="meta-item">
              <Users size={16} />
              <span>{formatViewers(currentShow.VIEWERS)} viewers</span>
            </div>
            <div className="meta-item year">
              <span>{currentShow.YEAR}</span>
            </div>
          </motion.div>

          <motion.p 
            className="featured-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {currentShow.DESCRIPTION}
          </motion.p>

          <motion.div 
            className="genre-tags"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {currentShow.GENRES?.split(', ').map((genre, index) => (
              <motion.span 
                key={index} 
                className="genre-tag"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {genre}
              </motion.span>
            ))}
          </motion.div>

          {progress > 0 && (
            <motion.div 
              className="progress-section"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </div>
              <span className="progress-text">
                {Math.round(progress)}% watched
              </span>
            </motion.div>
          )}

          <motion.div 
            className="action-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <motion.button
              className="play-button"
              onClick={() => onShowClick?.(currentShow.SHOW_ID)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.1 }}
            >
              <Play size={20} fill="currentColor" />
              <span>Play</span>
            </motion.button>

            <div className="secondary-actions">
              <motion.button
                className="favorites-button"
                onClick={toggleFavorite}
                whileHover={{ 
                  scale: 1.02,
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
              >
                <motion.span
                  style={{ fontSize: '18px' }}
                  animate={{
                    scale: isFavorite ? [1, 1.3, 1] : 1,
                    rotate: isFavorite ? [0, 15, -15, 0] : 0,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {isFavorite ? '💙' : '🤍'}
                </motion.span>
                {isFavorite ? 'Remove from List' : 'Add to List'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Video Controls */}
        {hasVideo && (
          <motion.div 
            className="video-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <motion.button
              className="video-control-btn"
              onClick={handleVideoToggle}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {isVideoPlaying ? <Pause size={18} /> : <Play size={18} />}
            </motion.button>
            <motion.button
              className="video-control-btn"
              onClick={toggleMute}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </motion.button>
          </motion.div>
        )}

        {/* Enhanced Navigation Controls */}
        <motion.div 
          className="navigation-controls"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <motion.button
            className="nav-btn prev"
            onClick={goToPrevious}
            disabled={shows.length <= 1}
            whileHover={{ scale: 1.02, x: -2, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.6 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <div className="slide-indicators">
            {shows.map((_, index) => (
              <motion.button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => navigateToSlide(index)}
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.7 + index * 0.05 }}
              >
                <div className="indicator-fill" />
              </motion.button>
            ))}
          </div>

          <motion.button
            className="nav-btn next"
            onClick={goToNext}
            disabled={shows.length <= 1}
            whileHover={{ scale: 1.02, x: 2, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.6 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default TrendingCarousel;
