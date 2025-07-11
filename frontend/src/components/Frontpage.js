import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import TrendingCarousel from './TrendingCarousel';


function FrontPage() {
  const [trendingShows, setTrendingShows] = useState([]);
  const [watchAgainShows, setWatchAgainShows] = useState([]);
  const [recommendedShows, setRecommendedShows] = useState([]);
  const [userName, setUserName] = useState('User');
  const [profilePicture, setProfilePicture] = useState('');
  const [activeSection, setActiveSection] = useState('trending');
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for scroll animations
  const trendingRef = useRef(null);
  const recommendedRef = useRef(null);
  const watchAgainRef = useRef(null);

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

  // Scroll animations setup - Fixed dependency array
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

    // Observe all sections - use a small delay to ensure DOM is ready
    const observeSections = () => {
      const sections = [trendingRef, recommendedRef, watchAgainRef];
      sections.forEach(ref => {
        if (ref.current) {
          observer.observe(ref.current);
        }
      });
    };

    // Small delay to ensure all sections are rendered
    const timeoutId = setTimeout(observeSections, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []); // Empty dependency array - only run once

  // Re-observe sections when data changes
  useEffect(() => {
    if (watchAgainRef.current) {
      // Reset animation class and re-trigger if needed
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
  }, [watchAgainShows]); // Only re-observe when watchAgainShows changes

  // Re-observe recommended section when data changes
  useEffect(() => {
    if (recommendedRef.current) {
      // Reset animation class and re-trigger if needed
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
  }, [recommendedShows]); // Only re-observe when recommendedShows changes

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

  // Track which section is active on scroll
  useEffect(() => {
    const handleScroll = () => {
      const trendingTop = trendingRef.current?.getBoundingClientRect().top ?? Infinity;
      const recommendedTop = recommendedRef.current?.getBoundingClientRect().top ?? Infinity;
      const watchAgainTop = watchAgainRef.current?.getBoundingClientRect().top ?? Infinity;
      const offset = 120; // header + some margin

      // Find the section closest to the top (but not above)
      let section = 'trending';
      if (recommendedTop - offset < 0 && watchAgainTop - offset > 0) {
        section = 'recommended';
      } else if (watchAgainTop - offset < 0) {
        section = 'watchagain';
      }
      setActiveSection(section);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Trending Now Section */}
     <section id="trending" className="shows-section" ref={trendingRef}>
  <h2 className="section-title trending-title">Trending Now</h2>
  <TrendingCarousel 
    shows={trendingShows} 
    onShowClick={(showId) => navigate(`/show/${showId}`)}
  />
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