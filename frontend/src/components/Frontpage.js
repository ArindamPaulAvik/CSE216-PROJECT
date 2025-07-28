import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import TrendingCarousel from './TrendingCarousel';
import ShowCard from './ShowCard';
import './ShowCard.css';



function FrontPage() {
  const [trendingShows, setTrendingShows] = useState([]);
  const [watchAgainShows, setWatchAgainShows] = useState([]);
  const [recommendedShows, setRecommendedShows] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [actionHitsShows, setActionHitsShows] = useState([]);
  const [thrillerShows, setThrillerShows] = useState([]);
  const [comedyShows, setComedyShows] = useState([]);
  const [dramaShows, setDramaShows] = useState([]);
  const [familyShows, setFamilyShows] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';
  
  // User preferences state
  const [userPreferences, setUserPreferences] = useState({
    playTrailerOnHover: false,
    showMyRatingsToOthers: false
  });
  
  // Debug effect to monitor comedyShows state
  useEffect(() => {
    console.log('Comedy shows state updated:', comedyShows);
  }, [comedyShows]);
  const [userName, setUserName] = useState('User');
  const [profilePicture, setProfilePicture] = useState('');
  const [activeSection, setActiveSection] = useState('trending');
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for scroll animations
  const trendingRef = useRef(null);
  const recommendedRef = useRef(null);
  const watchAgainRef = useRef(null);
  const topRatedRef = useRef(null);
  const actionHitsRef = useRef(null);
  const thrillerRef = useRef(null);
  const comedyRef = useRef(null);
  const dramaRef = useRef(null);
  const familyRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/auth';
      return;
    }

    // Fetch frontpage data
    axios.get(`${BASE_URL}/frontpage`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const data = res.data;
        console.log('Comedy shows received:', data.comedyShows); // Debug log
        setTrendingShows(data.trendingshows || []);
        setWatchAgainShows(data.watchagainshows || []);
        setRecommendedShows(data.recommendedShows || []);
        setTopRatedShows(data.topRatedShows || []);
        setActionHitsShows(data.actionHitsShows || []);
        setThrillerShows(data.thrillerShows || []);
        setComedyShows(data.comedyShows || []);
        setDramaShows(data.dramaShows || []);
        setFamilyShows(data.familyShows || []);
        setUserName(data.userName || 'User');
        if (data.profilePicture) {
          setProfilePicture(`${BASE_URL}/images/user/${data.profilePicture}`);
        }
      })
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/auth';
        } else {
          console.error('Error fetching frontpage:', err);
        }
      });
  }, []);

  // Fetch user preferences on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(`${BASE_URL}/users/preferences`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUserPreferences({
        playTrailerOnHover: res.data.playTrailerOnHover,
        showMyRatingsToOthers: res.data.showMyRatingsToOthers
      });
    })
    .catch(err => {
      console.error('Error fetching user preferences:', err);
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
      const sections = [trendingRef, recommendedRef, watchAgainRef, topRatedRef, actionHitsRef, thrillerRef, comedyRef, dramaRef, familyRef];
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

  // Re-observe top rated section when data changes
  useEffect(() => {
    if (topRatedRef.current) {
      // Reset animation class and re-trigger if needed
      topRatedRef.current.classList.remove('animate-in');

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

      observer.observe(topRatedRef.current);

      return () => observer.disconnect();
    }
  }, [topRatedShows]); // Only re-observe when topRatedShows changes

  // Re-observe action hits section when data changes
  useEffect(() => {
    if (actionHitsRef.current) {
      // Reset animation class and re-trigger if needed
      actionHitsRef.current.classList.remove('animate-in');

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

      observer.observe(actionHitsRef.current);

      return () => observer.disconnect();
    }
  }, [actionHitsShows]); // Only re-observe when actionHitsShows changes

  // Re-observe thriller section when data changes
  useEffect(() => {
    if (thrillerRef.current) {
      // Reset animation class and re-trigger if needed
      thrillerRef.current.classList.remove('animate-in');

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

      observer.observe(thrillerRef.current);

      return () => observer.disconnect();
    }
  }, [thrillerShows]); // Only re-observe when thrillerShows changes

  // Re-observe comedy section when data changes
  useEffect(() => {
    if (comedyRef.current) {
      // Reset animation class and re-trigger if needed
      comedyRef.current.classList.remove('animate-in');

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

      observer.observe(comedyRef.current);

      return () => observer.disconnect();
    }
  }, [comedyShows]); // Only re-observe when comedyShows changes

  // Re-observe drama section when data changes
  useEffect(() => {
    if (dramaRef.current) {
      // Reset animation class and re-trigger if needed
      dramaRef.current.classList.remove('animate-in');

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

      observer.observe(dramaRef.current);

      return () => observer.disconnect();
    }
  }, [dramaShows]); // Only re-observe when dramaShows changes

  // Re-observe family section when data changes
  useEffect(() => {
    if (familyRef.current) {
      // Reset animation class and re-trigger if needed
      familyRef.current.classList.remove('animate-in');

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

      observer.observe(familyRef.current);

      return () => observer.disconnect();
    }
  }, [familyShows]); // Only re-observe when familyShows changes

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
      const topRatedTop = topRatedRef.current?.getBoundingClientRect().top ?? Infinity;
      const actionHitsTop = actionHitsRef.current?.getBoundingClientRect().top ?? Infinity;
      const thrillerTop = thrillerRef.current?.getBoundingClientRect().top ?? Infinity;
      const comedyTop = comedyRef.current?.getBoundingClientRect().top ?? Infinity;
      const dramaTop = dramaRef.current?.getBoundingClientRect().top ?? Infinity;
      const familyTop = familyRef.current?.getBoundingClientRect().top ?? Infinity;
      const offset = 120; // header + some margin

      // Find the section closest to the top (but not above)
      let section = 'trending';
      if (recommendedTop - offset < 0 && watchAgainTop - offset > 0) {
        section = 'recommended';
      } else if (watchAgainTop - offset < 0 && topRatedTop - offset > 0) {
        section = 'watchagain';
      } else if (topRatedTop - offset < 0 && actionHitsTop - offset > 0) {
        section = 'toprated';
      } else if (actionHitsTop - offset < 0 && thrillerTop - offset > 0) {
        section = 'actionhits';
      } else if (thrillerTop - offset < 0 && comedyTop - offset > 0) {
        section = 'thriller';
      } else if (comedyTop - offset < 0 && dramaTop - offset > 0) {
        section = 'comedy';
      } else if (dramaTop - offset < 0 && familyTop - offset > 0) {
        section = 'drama';
      } else if (familyTop - offset < 0) {
        section = 'family';
      }
      setActiveSection(section);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getImagePath = (thumbnail) => {
    if (!thumbnail) return `${BASE_URL}/shows/placeholder.jpg`;
    return `${BASE_URL}/shows/${thumbnail}`;
  };

  const handleImageError = (e, showTitle, thumbnail) => {
    console.error(`Image error for ${showTitle}`, thumbnail);
    e.target.src = `${BASE_URL}/placeholder.jpg`;
  };



  const renderShowBox = useCallback((show, index) => (
    <ShowCard 
      key={show.SHOW_ID} 
      show={show} 
      index={index} 
    />
  ), []);

  return (
    <Layout 
      activeSection={activeSection} 
      hasWatchAgain={watchAgainShows.length > 0}
      hasTopRated={topRatedShows.length > 0}
    >
      {/* Trending Now Section */}
      <section id="trending" className="shows-section" ref={trendingRef}>
        <h2 className="section-title trending-title">Trending Now</h2>
        <TrendingCarousel
          shows={trendingShows}
          onShowClick={(showId) => navigate(`/show/${showId}`)}
          userPreferences={userPreferences}
        />
      </section>

      {/* Recommended Shows Section */}
      {recommendedShows.length > 0 && (
        <section id="recommended" className="shows-section" ref={recommendedRef}>
          <h2 className="section-title recommended-title">
            Recommended for You
          </h2>
          <div className="shows-grid">
            {recommendedShows.map((show, index) => (
              <ShowCard key={show.SHOW_ID} show={show} index={index} userPreferences={userPreferences} />
            ))}
          </div>
        </section>
      )}

      {/* Watch Again Section */}
      {watchAgainShows.length > 0 && (
        <section id="watchagain" className="shows-section" ref={watchAgainRef}>
          <h2 className="section-title watch-again-title">
            Watch Again
          </h2>
          <div className="shows-grid">
            {watchAgainShows.map((show, index) => (
              <ShowCard key={show.SHOW_ID} show={show} index={index} userPreferences={userPreferences} />
            ))}
          </div>
        </section>
      )}

      {/* Top Rated Section */}
      {topRatedShows.length > 0 && (
        <section id="toprated" className="shows-section" ref={topRatedRef}>
          <h2 className="section-title top-rated-title">
            Top Rated
          </h2>
          <div className="shows-grid">
            {topRatedShows.map((show, index) => (
              <ShowCard key={show.SHOW_ID} show={show} index={index} userPreferences={userPreferences} />
            ))}
          </div>
        </section>
      )}

      {/* Famous Action Hits Section */}
      {actionHitsShows.length > 0 && (
        <section id="actionhits" className="shows-section" ref={actionHitsRef}>
          <h2 className="section-title action-hits-title">
            Famous Action Hits
          </h2>
          <div className="shows-grid">
            {actionHitsShows.map((show, index) => (
              <ShowCard key={show.SHOW_ID} show={show} index={index} userPreferences={userPreferences} />
            ))}
          </div>
        </section>
      )}

      {/* Edge of Your Seat Thriller Section */}
      {thrillerShows.length > 0 && (
        <section id="thriller" className="shows-section" ref={thrillerRef}>
          <h2 className="section-title thriller-title">
            Edge of Your Seat
          </h2>
          <div className="shows-grid">
            {thrillerShows.map((show, index) => (
              <ShowCard key={show.SHOW_ID} show={show} index={index} userPreferences={userPreferences} />
            ))}
          </div>
        </section>
      )}

      {/* Laugh Out Loud Comedy Section */}
      {comedyShows.length > 0 && (
        <section id="comedy" className="shows-section" ref={comedyRef}>
          <h2 className="section-title comedy-title">
            Laugh Out Loud
          </h2>
          <div className="shows-grid">
            {comedyShows.map((show, index) => (
              <ShowCard key={show.SHOW_ID} show={show} index={index} userPreferences={userPreferences} />
            ))}
          </div>
        </section>
      )}

      {/* Drama Queens Section */}
      {dramaShows.length > 0 && (
        <section id="drama" className="shows-section" ref={dramaRef}>
          <h2 className="section-title drama-title">
            Drama Queens
          </h2>
          <div className="shows-grid">
            {dramaShows.map((show, index) => (
              <ShowCard key={show.SHOW_ID} show={show} index={index} userPreferences={userPreferences} />
            ))}
          </div>
        </section>
      )}

      {/* Watch with Your Family Section */}
      {familyShows.length > 0 && (
        <section id="family" className="shows-section" ref={familyRef}>
          <h2 className="section-title family-title">
            Watch with Your Family
          </h2>
          <div className="shows-grid">
            {familyShows.map((show, index) => (
              <ShowCard key={show.SHOW_ID} show={show} index={index} userPreferences={userPreferences} />
            ))}
          </div>
        </section>
      )}

      {/* Debug section - remove after testing */}
      {comedyShows.length === 0 && (
        <section id="comedy-debug" className="shows-section">
          <h2 className="section-title">
            Comedy Debug: {comedyShows.length} shows found
          </h2>
        </section>
      )}

      <style>{`
        /* CSS Custom Properties for Glass Theme */
        :root {
          --glass-primary: rgba(255, 255, 255, 0.05);
          --glass-secondary: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.08);
          --glass-text: rgba(255, 255, 255, 0.9);
          --glass-text-secondary: rgba(255, 255, 255, 0.7);
          --glass-accent: rgba(102, 126, 234, 0.3);
          --glass-blur: blur(15px);
          --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

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

        @keyframes glassShimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }

        .shows-section {
          margin-bottom: 80px;
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
          padding: 40px 0;
          position: relative;
        }

        .shows-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: -50px;
          right: -50px;
          bottom: 0;
          background: var(--glass-secondary);
          backdrop-filter: var(--glass-blur);
          border-radius: 30px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          opacity: 0;
          transition: opacity 0.8s ease;
          z-index: -1;
        }

        .shows-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .shows-section.animate-in::before {
          opacity: 1;
        }

        .shows-section.animate-in .section-title {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .section-title {
          color: var(--glass-text);
          margin-bottom: 40px;
          font-size: 2.2rem;
          font-weight: 700;
          padding: 20px 30px;
          display: inline-block;
          position: relative;
          background: var(--glass-primary);
          backdrop-filter: var(--glass-blur) saturate(180%);
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
          letter-spacing: -0.5px;
        }

        .section-title::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%
          );
          transition: left 0.8s ease;
        }

        .shows-section.animate-in .section-title::before {
          left: 100%;
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
          box-shadow: 0 0 20px currentColor;
        }

        .shows-section.animate-in .section-title::after {
          width: 100%;
        }

        .trending-title::after {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
        }

        .recommended-title::after {
          background: linear-gradient(135deg, rgba(240, 147, 251, 0.8) 0%, rgba(245, 87, 108, 0.8) 100%);
        }

        .watch-again-title::after {
          background: linear-gradient(135deg, rgba(118, 75, 162, 0.8) 0%, rgba(102, 126, 234, 0.8) 100%);
        }

        .top-rated-title::after {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(255, 140, 0, 0.8) 100%);
        }

        .action-hits-title::after {
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.8) 0%, rgba(238, 90, 36, 0.8) 100%);
        }

        .thriller-title::after {
          background: linear-gradient(135deg, rgba(44, 44, 84, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
        }

        .comedy-title::after {
          background: linear-gradient(135deg, rgba(249, 202, 36, 0.8) 0%, rgba(240, 147, 43, 0.8) 100%);
        }

        .drama-title::after {
          background: linear-gradient(135deg, rgba(235, 77, 75, 0.8) 0%, rgba(108, 92, 231, 0.8) 100%);
        }

        .family-title::after {
          background: linear-gradient(135deg, rgba(0, 210, 255, 0.8) 0%, rgba(58, 123, 213, 0.8) 100%);
        }

        .shows-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-template-rows: repeat(auto-fit, 500px); /* Updated to match new card height */
          gap: 30px;
          overflow: visible;
          contain: layout;
          position: relative;
          z-index: 1;
          align-items: start;
          padding: 0 20px;
        }

        /* Enhanced responsive adjustments */
        @media (max-width: 768px) {
          .shows-section {
            margin-bottom: 60px;
            padding: 30px 0;
          }

          .shows-section::before {
            left: -20px;
            right: -20px;
            border-radius: 20px;
          }

          .shows-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(auto-fit, 440px); /* Fixed mobile height */
            gap: 20px;
            padding: 0 10px;
          }

          .section-title {
            font-size: 1.8rem;
            padding: 16px 24px;
            margin-bottom: 30px;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 1.5rem;
            padding: 12px 20px;
          }

          .shows-section {
            padding: 20px 0;
          }
        }

        /* Enhance layout background with glass effects */
        .layout-container {
          background: 
            radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          min-height: 100vh;
        }

        /* Add subtle glass overlay to main content */
        .main-content::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .shows-section::before,
          .section-title::before {
            display: none;
          }
        }

        /* High contrast mode adjustments */
        @media (prefers-contrast: high) {
          .section-title {
            border: 2px solid rgba(255, 255, 255, 0.3);
            background: rgba(0, 0, 0, 0.8);
          }
          
          .shows-section::before {
            border: 2px solid rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </Layout>
  );
}

export default FrontPage;