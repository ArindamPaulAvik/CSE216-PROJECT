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
  const [direction, setDirection] = useState(1);
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
      setDirection(1);
      setCurrentTrendingIndex(prev => (prev + 1) % trendingShows.length);
    }, 8000);

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
    setDirection(1);
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
    setDirection(-1);
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
    setDirection(index > currentTrendingIndex ? 1 : -1);
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

  const getBannerPath = (banner) => {
    if (!banner) return 'http://localhost:5000/banners/placeholder.jpg';
    return `/banners/${banner}`;
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

  const slideVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 1.1
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 0.9
      }
    }
  }

  const textVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 100 : -100,
        opacity: 0
      }
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        x: direction < 0 ? 100 : -100,
        opacity: 0
      }
    }
  };

  return (
    <Layout activeSection={activeSection}>
      {/* Hero Section */}
      <div className="hero-wrapper" ref={heroRef} style={{
        width: '89vw',
        maxWidth: '100%',
        height: '75vh',
        minHeight: 500,
        position: 'relative',
        margin: '0 auto',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
      }}>
        {/* Left navigation button */}
        <button
          className="nav-button prev-button"
          onClick={prevSlide}
          disabled={trendingShows.length <= 1}
          style={{
            position: 'absolute',
            left: 18,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: trendingShows.length <= 1 ? 0.3 : 1
          }}
          aria-label="Previous Movie"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Right navigation button */}
        <button
          className="nav-button next-button"
          onClick={nextSlide}
          disabled={trendingShows.length <= 1}
          style={{
            position: 'absolute',
            right: 18,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: trendingShows.length <= 1 ? 0.3 : 1
          }}
          aria-label="Next Movie"
        >
          <ChevronRight size={32} />
        </button>

        {/* Animated background slides */}
        <AnimatePresence mode="wait" custom={direction}>
          {trendingShows.length > 0 && (
            <motion.div
              key={currentTrendingIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 }
              }}
              className="hero-banner-bg"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                background: `url(${getBannerPath(trending.BANNER)}) center center / cover no-repeat`,
                filter: 'brightness(0.7)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Gradient fade from left to right */}
        <div
          className="hero-gradient"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 60%, transparent 100%)',
            transition: 'opacity 0.5s ease'
          }}
        />

        {/* Animated content on the left */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`content-${currentTrendingIndex}`}
            custom={direction}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              position: 'relative',
              zIndex: 3,
              padding: '70px 60px',
              maxWidth: 700,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: '100%',
            }}
          >
            <h2
              className="hero-title"
              style={{
                fontSize: '2.8rem',
                marginBottom: 24,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {trending.TITLE}
            </h2>

            <p
              className="hero-description"
              style={{
                fontSize: '1.2rem',
                marginBottom: 32,
                maxWidth: 500,
                color: '#e0e0e0',
                lineHeight: 1.5,
              }}
            >
              {trending.DESCRIPTION}
            </p>

            <div
              className="hero-actions"
              style={{
                display: 'flex',
                gap: 18,
              }}
            >
              <span
                className="hero-rating"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '8px 18px',
                  borderRadius: 20,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                ⭐ {trending.RATING}
              </span>

              <button
                onClick={() => navigate(`/show/${trending.SHOW_ID}`)}
                className="hero-button play-button"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  padding: '12px 28px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
              >
                <Play size={22} />
                Watch Now
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
  .hero-wrapper {
    animation: heroReveal 0.8s ease-out forwards;
  }
  
  @keyframes heroReveal {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .nav-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .nav-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .nav-button:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }
  
  .nav-button:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
  
  .hero-banner-bg {
    will-change: transform, opacity;
  }
  
  .hero-wrapper .hero-title,
  .hero-wrapper .hero-description,
  .hero-wrapper .hero-actions {
    will-change: transform, opacity;
  }
`}</style>
      {/* Dot Indicators below hero section, always separated */}
      <div className="hero-indicators" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        margin: '0 auto 32px auto',
        width: '89vw',
        maxWidth: '100%',
        position: 'relative',
        left: '48%',
        top: '20px'
      }}>
        {trendingShows.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentTrendingIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: index === currentTrendingIndex ? '#fff' : 'rgba(255,255,255,0.4)',
              boxShadow: index === currentTrendingIndex ? '0 0 0 2px #667eea' : 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Go to movie ${index + 1}`}
          />
        ))}
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
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
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-top: 0;
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

        .hero-section {
          position: relative;
          width: 100vw;
          height: 450px;
          background: rgba(255, 255, 255, 0.02);
          border: none;
          border-radius: 0;
          margin: 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .hero-carousel {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
        }

        .hero-content {
          flex: 0 0 45%; /* Keep original size */
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #ddd;
          position: relative;
          z-index: 3;
        }

        .hero-text {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
        }

        .hero-title {
          font-size: 2.5rem;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          line-height: 1.2;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 25px;
          color: #ccc;
          max-height: 120px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .hero-rating {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: bold;
          color: white;
          transition: all 0.3s ease;
        }

        .hero-rating:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .hero-button {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .play-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .play-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .info-button {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .info-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px) scale(1.05);
        }

        .hero-image {
          flex: 1 1 70%; /* CHANGED: Increased from 55% to 70% */
          position: relative;
          overflow: hidden;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right, /* Keep original direction */
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.4) 40%,
      transparent 70%
    );
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
          padding: 0 40px;
          z-index: 10;
          pointer-events: none;
        }

        .nav-button {
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          pointer-events: auto;
          opacity: 0.8;
        }

        .nav-button:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.1);
          opacity: 1;
        }

        .nav-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-button:disabled:hover {
          transform: none;
          background: rgba(0, 0, 0, 0.5);
        }

        /* Dot Indicators */
        .hero-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 3;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          transform: scale(1.2);
        }

        .indicator:hover {
          border-color: rgba(255, 255, 255, 0.8);
          transform: scale(1.1);
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
            width: 100vw;
            margin-left: calc(-50vw + 50%);
          }

          .hero-section {
            height: 400px;
          }

          .hero-slide {
            flex-direction: column;
          }

          .hero-content {
            flex: none;
            padding: 20px;
            min-height: 200px;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-description {
            font-size: 1rem;
            -webkit-line-clamp: 2;
            max-height: 60px;
          }

          .hero-actions {
            flex-wrap: wrap;
            gap: 10px;
          }

          .hero-button {
            font-size: 0.9rem;
            padding: 10px 20px;
          }

          .hero-image {
            flex: none;
            height: 200px;
          }

          .nav-button {
            width: 50px;
            height: 50px;
          }

          .hero-controls {
            padding: 0 10px;
          }

          .hero-indicators {
            bottom: 10px;
          }

          .indicator {
            width: 10px;
            height: 10px;
          }

          .shows-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .card-image-container {
            height: 300px;
          }

          .card-content {
            padding: 20px;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .show-card:hover {
            transform: translateY(-8px) scale(1.01);
          }
        }

        @media (max-width: 480px) {
          .hero-content {
            padding: 15px;
          }

          .hero-title {
            font-size: 1.5rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-button {
            width: 100%;
            justify-content: center;
          }

          .nav-button {
            width: 40px;
            height: 40px;
          }

          .hero-indicators {
            gap: 8px;
          }

          .indicator {
            width: 8px;
            height: 8px;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </Layout>
  );
}

export default FrontPage;