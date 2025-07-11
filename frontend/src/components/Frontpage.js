import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';

function FrontPage() {
  const [trendingShows, setTrendingShows] = useState([]);
  const [watchAgainShows, setWatchAgainShows] = useState([]);
  const [recommendedShows, setRecommendedShows] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [userName, setUserName] = useState('User');
  const [profilePicture, setProfilePicture] = useState('');
  const [activeSection, setActiveSection] = useState('trending');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for scroll animations
  const heroRef = useRef(null);
  const trendingRef = useRef(null);
  const recommendedRef = useRef(null);
  const watchAgainRef = useRef(null);
  const autoPlayRef = useRef(null);

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
        const data = res.data;
        setTrendingShows(data.trendingshows || []);
        setWatchAgainShows(data.watchagainshows || []);
        setRecommendedShows(data.recommendedShows || []);
        setUserName(data.userName || 'User');
        if (data.profilePicture) {
          setProfilePicture(`http://localhost:5000/images/user/${data.profilePicture}`);
        }
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

  // Scroll animations setup
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const observeSections = () => {
      const sections = [heroRef, trendingRef, recommendedRef, watchAgainRef];
      sections.forEach(ref => {
        if (ref.current) {
          observer.observe(ref.current);
        }
      });
    };

    const timeoutId = setTimeout(observeSections, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Re-observe sections when data changes
  useEffect(() => {
    if (watchAgainRef.current) {
      watchAgainRef.current.classList.remove('animate-in');
      
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);

      observer.observe(watchAgainRef.current);
      
      return () => observer.disconnect();
    }
  }, [watchAgainShows]);

  useEffect(() => {
    if (recommendedRef.current) {
      recommendedRef.current.classList.remove('animate-in');
      
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);

      observer.observe(recommendedRef.current);
      
      return () => observer.disconnect();
    }
  }, [recommendedShows]);

  // Scroll to section from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');
    if (scrollTo) {
      setTimeout(() => {
        const target = document.getElementById(scrollTo);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [location.search]);

  // Auto-slide for trending shows
  useEffect(() => {
    if (trendingShows.length === 0 || !isAutoPlaying) return;
    
    autoPlayRef.current = setInterval(() => {
      setCurrentTrendingIndex(prev => (prev + 1) % trendingShows.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [trendingShows, isAutoPlaying]);

  // Track which section is active on scroll
  useEffect(() => {
    const handleScroll = () => {
      const trendingTop = trendingRef.current?.getBoundingClientRect().top ?? Infinity;
      const recommendedTop = recommendedRef.current?.getBoundingClientRect().top ?? Infinity;
      const watchAgainTop = watchAgainRef.current?.getBoundingClientRect().top ?? Infinity;
      const offset = 120;

      let section = 'trending';
      if (recommendedTop - offset < 0 && watchAgainTop - offset > 0) {
        section = 'recommended';
      } else if (watchAgainTop - offset < 0) {
        section = 'watchagain';
      }
      setActiveSection(section);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => {
    if (trendingShows.length === 0) return;
    setCurrentTrendingIndex(prev => (prev + 1) % trendingShows.length);
    setIsAutoPlaying(false);
    
    // Resume autoplay after 10 seconds
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    if (trendingShows.length === 0) return;
    setCurrentTrendingIndex(prev => (prev - 1 + trendingShows.length) % trendingShows.length);
    setIsAutoPlaying(false);
    
    // Resume autoplay after 10 seconds
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    if (trendingShows.length === 0) return;
    setCurrentTrendingIndex(index);
    setIsAutoPlaying(false);
    
    // Resume autoplay after 10 seconds
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const trending = trendingShows[currentTrendingIndex] || {};

  const getImagePath = (thumbnail) => {
    if (!thumbnail) return 'http://localhost:5000/shows/placeholder.jpg';
    return `/shows/${thumbnail}`;
  };

  const handleImageError = (e, showTitle, thumbnail) => {
    console.error(`Image error for ${showTitle}`, thumbnail);
    e.target.src = '/placeholder.jpg';
  };

  const renderShowBox = useCallback((show, index) => (
    <div
      className="show-card"
      key={show.SHOW_ID}
      role="button"
      tabIndex={0}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => navigate(`/show/${show.SHOW_ID}`)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/show/${show.SHOW_ID}`)}
    >
      <div className="card-image-container">
        <img 
          src={getImagePath(show.THUMBNAIL)} 
          alt={show.TITLE}
          className="card-image"
          loading="lazy"
          onError={(e) => handleImageError(e, show.TITLE, show.THUMBNAIL)}
        />
        <div className="card-overlay">
          <button 
            className="view-button"
            onClick={() => navigate(`/show/${show.SHOW_ID}`)}
          >
            View Details
          </button>
        </div>
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
            : show.DESCRIPTION || 'No description available'
          }
        </p>
        <div className="card-genres">
          {show.GENRES || 'No genres available'}
        </div>
      </div>
    </div>
  ), [navigate]);

  return (
    <Layout activeSection={activeSection}>
      {/* Hero Section */}
      <div className="hero-wrapper" ref={heroRef} style={{ marginTop: '10px' }}>
        {trendingShows.length > 0 && (
          <section className="hero-section">
            <div className="hero-carousel">
              <div className="hero-slide">
                {/* Background Image */}
                <div className="hero-background">
                  <img
                    src={getImagePath(trending.THUMBNAIL)}
                    alt={trending.TITLE}
                    className="hero-bg-image"
                    loading="lazy"
                    onError={(e) => handleImageError(e, trending.TITLE, trending.THUMBNAIL)}
                  />
                  <div className="hero-overlay"></div>
                </div>

                {/* Content */}
                <div className="hero-content">
                  <motion.div
                    key={currentTrendingIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hero-text"
                  >
                    <h1 className="hero-title">{trending.TITLE}</h1>
                    <p className="hero-description">{trending.DESCRIPTION}</p>
                    <div className="hero-actions">
                      <button
                        onClick={() => navigate(`/show/${trending.SHOW_ID}`)}
                        className="hero-button play-button"
                      >
                        <Play size={20} fill="currentColor" />
                        Play
                      </button>
                      <button
                        onClick={() => navigate(`/show/${trending.SHOW_ID}`)}
                        className="hero-button info-button"
                      >
                        <Info size={20} />
                        More Info
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="hero-controls">
                <button
                  className="nav-button nav-button-prev"
                  onClick={prevSlide}
                  disabled={trendingShows.length <= 1}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="nav-button nav-button-next"
                  onClick={nextSlide}
                  disabled={trendingShows.length <= 1}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Dot Indicators */}
              <div className="hero-indicators">
                {trendingShows.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentTrendingIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Trending Now Section */}
      <section id="trending" className="shows-section" ref={trendingRef}>
        <h2 className="section-title trending-title">
          Trending Now
        </h2>
        <div className="shows-grid">
          {trendingShows.map((show, index) => renderShowBox(show, index))}
        </div>
        {trendingShows.length === 0 && (
          <p className="empty-message">
            No trending shows available at the moment.
          </p>
        )}
      </section>

      {/* Recommended Shows Section */}
      {recommendedShows.length > 0 && (
        <section id="recommended" className="shows-section" ref={recommendedRef}>
          <h2 className="section-title recommended-title">
            Recommended for You
          </h2>
          <div className="shows-grid">
            {recommendedShows.map((show, index) => renderShowBox(show, index))}
          </div>
        </section>
      )}

      {/* Watch Again Section */}
      <section id="watchagain" className="shows-section" ref={watchAgainRef}>
        <h2 className="section-title watch-again-title">
          Watch Again
        </h2>
        <div className="shows-grid">
          {watchAgainShows.map((show, index) => renderShowBox(show, index))}
        </div>
        {watchAgainShows.length === 0 && (
          <p className="empty-message">
            No shows to watch again yet. Start watching some content!
          </p>
        )}
      </section>

      <style>{`
        /* Scroll Animation Keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cardStagger {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Base styles for animation elements */
        .hero-wrapper {
          position: relative;
          width: calc(100vw - 120px);
          margin-left: calc(-50vw + 50% + 60px);
          margin-top: -20px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .hero-wrapper.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .shows-section {
          margin-bottom: 60px;
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .shows-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .shows-section.animate-in .section-title {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .shows-section.animate-in .show-card {
          animation: cardStagger 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) both;
        }

        /* Netflix-style Hero Section */
        .hero-section {
          position: relative;
          width: 100%;
          height: 56.25vw;
          max-height: 500px;
          min-height: 400px;
          background: #000;
          overflow: hidden;
        }

        .hero-carousel {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-slide {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            transparent 100%
          ),
          linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 60%
          );
        }

        .hero-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          z-index: 2;
          padding: 0 60px;
        }

        .hero-text {
          max-width: 500px;
          color: white;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .hero-description {
          font-size: 1.2rem;
          line-height: 1.4;
          margin-bottom: 30px;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hero-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .hero-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .play-button {
          background: rgba(255, 255, 255, 1);
          color: black;
        }

        .play-button:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .info-button {
          background: rgba(109, 109, 110, 0.7);
          color: white;
        }

        .info-button:hover {
          background: rgba(109, 109, 110, 0.4);
        }

        /* Navigation Controls */
        .hero-controls {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 3;
          pointer-events: none;
        }

        .nav-button {
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          pointer-events: auto;
          opacity: 0.8;
        }

        .nav-button:hover {
          background: rgba(0, 0, 0, 0.8);
          opacity: 1;
          transform: scale(1.1);
        }

        .nav-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-button:disabled:hover {
          transform: none;
          background: rgba(0, 0, 0, 0.5);
        }

        .nav-button-prev {
          left: 20px;
        }

        .nav-button-next {
          right: 20px;
        }

        /* Dot Indicators */
        .hero-indicators {
          position: absolute;
          bottom: 20px;
          right: 60px;
          display: flex;
          gap: 8px;
          z-index: 3;
        }

        .indicator {
          width: 12px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: rgba(255, 255, 255, 1);
        }

        .indicator:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .section-title {
          color: #fff;
          margin-bottom: 30px;
          font-size: 1.8rem;
          font-weight: bold;
          padding-bottom: 10px;
          display: inline-block;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 3px;
          border-radius: 2px;
          transition: width 0.8s ease;
        }

        .shows-section.animate-in .section-title::after {
          width: 100%;
        }

        .trending-title::after {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .recommended-title::after {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .watch-again-title::after {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        .shows-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
        }

        .show-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transform: translateY(20px);
          opacity: 0;
        }

        .show-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .card-image-container {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .show-card:hover .card-image {
          transform: scale(1.1);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.8) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .show-card:hover .card-overlay {
          opacity: 1;
        }

        .view-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          transform: translateY(20px);
        }

        .show-card:hover .view-button {
          transform: translateY(0);
        }

        .view-button:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }

        .card-content {
          padding: 25px;
        }

        .card-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #e0e0e0;
          margin: 0 0 12px 0;
          line-height: 1.3;
          transition: color 0.3s ease;
        }

        .show-card:hover .card-title {
          color: #fff;
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 15px;
        }

        .rating-star {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }

        .show-card:hover .rating-star {
          transform: scale(1.2);
        }

        .rating-value {
          font-weight: 600;
          color: #ffd700;
          font-size: 1rem;
        }

        .card-description {
          color: #b0b0b0;
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0 0 15px 0;
          transition: color 0.3s ease;
        }

        .show-card:hover .card-description {
          color: #d0d0d0;
        }

        .card-genres {
          color: #9a9a9a;
          font-size: 0.9rem;
          font-style: italic;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 12px;
          transition: color 0.3s ease;
        }

        .show-card:hover .card-genres {
          color: #bbb;
        }

        .empty-message {
          color: #888;
          text-align: center;
          font-size: 1.1rem;
          margin-top: 40px;
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) 0.3s both;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-wrapper {
            width: calc(100vw - 40px);
            margin-left: calc(-50vw + 50% + 20px);
          }

          .hero-section {
            height: 70vw;
            max-height: 400px;
            min-height: 300px;
          }

          .hero-content {
            padding: 0 30px;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
            -webkit-line-clamp: 2;
          }

          .hero-actions {
            flex-wrap: wrap;
            gap: 10px;
          }

          .hero-button {
            font-size: 0.9rem;
            padding: 10px 20px;
          }

          .nav-button {
            width: 40px;
            height: 40px;
          }

          .hero-controls {
            padding: 0 10px;
          }

          .hero-indicators {
            bottom: 10px;
            right: 30px;
          }

          .shows-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .show-card {
            max-width: 100%;
          }

          .card-image-container {
            height: 300px;
          }

          .section-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero-wrapper {
            width: calc(100vw - 20px);
            margin-left: calc(-50vw + 50% + 10px);
          }

          .hero-content {
            padding: 0 20px;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-description {
            font-size: 0.9rem;
          }

          .hero-button {
            font-size: 0.8rem;
            padding: 8px 16px;
          }

          .shows-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Enhanced Netflix-style carousel improvements */
        .hero-carousel {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 0;
          overflow: hidden;
        }

        .hero-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          transition: opacity 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: brightness(0.7);
          transition: filter 0.3s ease;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.9) 0%,
              rgba(0, 0, 0, 0.7) 40%,
              rgba(0, 0, 0, 0.4) 60%,
              transparent 100%
            ),
            linear-gradient(
              180deg,
              transparent 0%,
              rgba(0, 0, 0, 0.2) 50%,
              rgba(0, 0, 0, 0.8) 100%
            );
          z-index: 2;
        }

        /* Enhanced navigation buttons */
        .hero-controls {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 10;
          pointer-events: none;
        }

        .nav-button {
          background: rgba(42, 42, 42, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.1);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          pointer-events: auto;
          opacity: 0.8;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #000;
          opacity: 1;
          transform: scale(1.1);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .nav-button:active {
          transform: scale(1.05);
        }

        .nav-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          background: rgba(42, 42, 42, 0.4);
        }

        .nav-button:disabled:hover {
          transform: none;
          background: rgba(42, 42, 42, 0.4);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .nav-button svg {
          width: 28px;
          height: 28px;
        }

        /* Enhanced dot indicators */
        .hero-indicators {
          position: absolute;
          bottom: 30px;
          right: 60px;
          display: flex;
          gap: 12px;
          z-index: 10;
        }

        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .indicator::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .indicator.active {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.2);
        }

        .indicator.active::before {
          transform: scale(1);
        }

        .indicator:hover {
          background: rgba(255, 255, 255, 0.7);
          border-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        /* Auto-play progress indicator */
        .hero-indicators::before {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
}

.hero-indicators::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 0%;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
  animation: progress 5s linear infinite;  /* ✅ Fixed - remove template literal */
}

.hero-indicators.paused::after {
  animation-play-state: paused;
}

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }

        /* Enhanced hero content */
        .hero-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          z-index: 3;
          padding: 0 60px;
        }

        .hero-text {
          max-width: 600px;
          color: white;
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.1;
          text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.8);
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: clamp(1rem, 2vw, 1.3rem);
          line-height: 1.5;
          margin-bottom: 30px;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.8);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hero-actions {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
        }

        .hero-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
        }

        .hero-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .hero-button:hover::before {
          left: 100%;
        }

        .play-button {
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          color: #000;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .play-button:hover {
          background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .info-button {
          background: rgba(109, 109, 110, 0.8);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .info-button:hover {
          background: rgba(109, 109, 110, 0.6);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        /* Mobile responsiveness for navigation */
        @media (max-width: 768px) {
          .nav-button {
            width: 50px;
            height: 50px;
          }

          .nav-button svg {
            width: 24px;
            height: 24px;
          }

          .hero-indicators {
            bottom: 20px;
            right: 30px;
            gap: 8px;
          }

          .indicator {
            width: 6px;
            height: 6px;
          }
        }

        @media (max-width: 480px) {
          .hero-controls {
            padding: 0 10px;
          }

          .nav-button {
            width: 40px;
            height: 40px;
          }

          .nav-button svg {
            width: 20px;
            height: 20px;
          }

          .hero-indicators {
            bottom: 15px;
            right: 20px;
            gap: 6px;
          }

          .indicator {
            width: 5px;
            height: 5px;
          }
        }
          