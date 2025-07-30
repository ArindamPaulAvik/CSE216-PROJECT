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
      <div style={{ marginTop: '70px' }}>
      {/* Trending Carousel Section - Without title */}
      <section id="trending" className="shows-section" ref={trendingRef}>
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

      </div>

      <style>{`
        /* CSS Custom Properties for Optimized Glass Theme */
        :root {
          --glass-primary: rgba(255, 255, 255, 0.04);
          --glass-secondary: rgba(255, 255, 255, 0.03);
          --glass-tertiary: rgba(255, 255, 255, 0.02);
          --glass-border: rgba(255, 255, 255, 0.1);
          --glass-border-strong: rgba(255, 255, 255, 0.15);
          --glass-text: rgba(255, 255, 255, 0.95);
          --glass-text-secondary: rgba(255, 255, 255, 0.8);
          --glass-text-muted: rgba(255, 255, 255, 0.6);
          --glass-accent: rgba(255, 182, 193, 0.3);
          --glass-accent-strong: rgba(255, 182, 193, 0.5);
          --glass-blur: blur(15px);
          --glass-blur-strong: blur(20px);
          --glass-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
          --glass-shadow-strong: 0 12px 40px rgba(0, 0, 0, 0.35);
          --glass-gradient-primary: linear-gradient(135deg, rgba(255, 182, 193, 0.08) 0%, rgba(255, 160, 122, 0.08) 100%);
          --glass-gradient-secondary: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%);
        }

        /* Optimized Scroll Animation Keyframes */
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes glassShimmer {
          0% { 
            transform: translateX(-100%); 
            opacity: 0;
          }
          50% { 
            opacity: 0.8; 
          }
          100% { 
            transform: translateX(200%); 
            opacity: 0;
          }
        }

        @keyframes glassGlow {
          0%, 100% { 
            box-shadow: var(--glass-shadow); 
          }
          50% { 
            box-shadow: var(--glass-shadow);
          }
        }

        @keyframes floatingGlass {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-5px); 
          }
        }

        .shows-section {
          margin-bottom: 40px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
          padding: 25px 0;
          position: relative;
        }

        .shows-section::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -25px;
          right: -25px;
          bottom: -10px;
          background: var(--glass-primary);
          backdrop-filter: var(--glass-blur) saturate(150%) brightness(103%);
          border-radius: 18px;
          border: 1px solid var(--glass-border);
          box-shadow: 
            var(--glass-shadow),
            0 0 0 1px rgba(255, 255, 255, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 rgba(0, 0, 0, 0.08);
          opacity: 0;
          transition: all 0.5s ease;
          z-index: -1;
        }

        .shows-section::after {
          content: '';
          position: absolute;
          top: -10px;
          left: -25px;
          right: -25px;
          bottom: -10px;
          background: var(--glass-gradient-primary);
          border-radius: 18px;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: -2;
          filter: blur(1px);
        }

        .shows-section.animate-in {
          opacity: 1;
          transform: translateY(0);
          animation: floatingGlass 4s ease-in-out infinite;
        }

        .shows-section.animate-in::before {
          opacity: 1;
        }

        .shows-section.animate-in::after {
          opacity: 0.4;
        }

        .shows-section.animate-in .section-title {
          animation: slideInLeft 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .section-title {
          color: var(--glass-text);
          margin-bottom: 25px;
          font-size: 2rem;
          font-weight: 700;
          padding: 15px 25px;
          display: inline-block;
          position: relative;
          background: var(--glass-primary);
          backdrop-filter: var(--glass-blur-strong) saturate(160%) brightness(108%);
          border-radius: 16px;
          border: 1px solid var(--glass-border-strong);
          box-shadow: 
            var(--glass-shadow),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 2px 0 rgba(255, 255, 255, 0.18),
            inset 0 -2px 0 rgba(0, 0, 0, 0.08);
          overflow: hidden;
          letter-spacing: -0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          transform-style: preserve-3d;
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
            rgba(255, 255, 255, 0.25) 40%,
            rgba(255, 255, 255, 0.35) 60%,
            transparent 100%
          );
          transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 3px;
          border-radius: 2px;
          transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 
            0 0 20px currentColor,
            0 0 40px currentColor;
        }

        .shows-section.animate-in .section-title {
          animation: slideInLeft 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .shows-section.animate-in .section-title::before {
          left: 100%;
        }

        .shows-section.animate-in .section-title::after {
          width: 100%;
        }

        .trending-title::after {
          background: linear-gradient(135deg, rgba(255, 182, 193, 0.9) 0%, rgba(255, 160, 122, 0.9) 100%);
          box-shadow: 
            0 0 20px rgba(255, 182, 193, 0.7),
            0 0 40px rgba(255, 160, 122, 0.5);
        }

        .recommended-title::after {
          background: linear-gradient(135deg, rgba(255, 218, 185, 0.9) 0%, rgba(255, 192, 203, 0.9) 100%);
          box-shadow: 
            0 0 20px rgba(255, 218, 185, 0.7),
            0 0 40px rgba(255, 192, 203, 0.5);
        }

        .watch-again-title::after {
          background: linear-gradient(135deg, rgba(221, 160, 221, 0.9) 0%, rgba(255, 182, 193, 0.9) 100%);
          box-shadow: 
            0 0 20px rgba(221, 160, 221, 0.7),
            0 0 40px rgba(255, 182, 193, 0.5);
        }

        .top-rated-title::after {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 223, 186, 0.9) 100%);
          box-shadow: 
            0 0 20px rgba(255, 215, 0, 0.7),
            0 0 40px rgba(255, 223, 186, 0.5);
        }

        .action-hits-title::after {
          background: linear-gradient(135deg, rgba(255, 99, 71, 0.9) 0%, rgba(255, 127, 80, 0.9) 100%);
          box-shadow: 
            0 0 20px rgba(255, 99, 71, 0.7),
            0 0 40px rgba(255, 127, 80, 0.5);
        }

        .thriller-title::after {
          background: linear-gradient(135deg, rgba(72, 61, 139, 0.9) 0%, rgba(123, 104, 238, 0.9) 100%);
          box-shadow: 
            0 0 20px rgba(72, 61, 139, 0.7),
            0 0 40px rgba(123, 104, 238, 0.5);
        }

        .comedy-title::after {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 239, 213, 0.9) 100%);
          box-shadow: 
            0 0 20px rgba(255, 215, 0, 0.7),
            0 0 40px rgba(255, 239, 213, 0.5);
        }

        .drama-title::after {
          background: linear-gradient(135deg, rgba(219, 112, 147, 0.9) 0%, rgba(238, 130, 238, 0.9) 100%);
          box-shadow: 
            0 0 20px rgba(219, 112, 147, 0.7),
            0 0 40px rgba(238, 130, 238, 0.5);
        }

        .family-title::after {
          background: linear-gradient(135deg, rgba(135, 206, 250, 0.9) 0%, rgba(173, 216, 230, 0.9) 100%);
          box-shadow: 
            0 0 20px rgba(135, 206, 250, 0.7),
            0 0 40px rgba(173, 216, 230, 0.5);
        }

        .shows-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-template-rows: repeat(auto-fit, 500px);
          gap: 25px;
          overflow: visible;
          contain: layout;
          position: relative;
          z-index: 1;
          align-items: start;
          padding: 15px 20px;
          background: var(--glass-tertiary);
          backdrop-filter: blur(10px) saturate(120%);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 rgba(0, 0, 0, 0.08);
        }

        .shows-grid::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--glass-gradient-secondary);
          border-radius: 16px;
          opacity: 0.25;
          pointer-events: none;
          z-index: -1;
        }

        /* Enhanced responsive adjustments for optimized glass theme */
        @media (max-width: 768px) {
          .shows-section {
            margin-bottom: 30px;
            padding: 20px 0;
          }

          .shows-section::before {
            left: -20px;
            right: -20px;
            border-radius: 15px;
            backdrop-filter: blur(12px) saturate(140%);
          }

          .shows-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(auto-fit, 440px);
            gap: 18px;
            padding: 10px 15px;
            backdrop-filter: blur(8px) saturate(110%);
          }

          .section-title {
            font-size: 1.7rem;
            padding: 12px 20px;
            margin-bottom: 20px;
            backdrop-filter: blur(15px) saturate(150%);
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 1.4rem;
            padding: 10px 16px;
            backdrop-filter: blur(12px) saturate(140%);
          }

          .shows-section {
            padding: 15px 0;
          }

          .shows-section::before {
            left: -12px;
            right: -12px;
            border-radius: 12px;
          }

          .shows-grid {
            padding: 8px 10px;
          }
        }

        /* Enhanced layout background with warm glass effects */
        .layout-container {
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 160, 122, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 70%),
            radial-gradient(circle at 25% 25%, rgba(255, 182, 193, 0.06) 0%, transparent 60%),
            radial-gradient(circle at 75% 75%, rgba(255, 160, 122, 0.06) 0%, transparent 60%),
            linear-gradient(135deg, #0a0a0a 0%, #2a1a1e 25%, #2e1a16 75%, #23100f 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .layout-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 35% 65%, rgba(255, 182, 193, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 65% 35%, rgba(255, 160, 122, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 30%);
          pointer-events: none;
          z-index: -1;
        }

        .layout-container::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.008) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.008) 50%, transparent 70%);
          pointer-events: none;
          z-index: -1;
          opacity: 0.4;
        }

        /* Enhanced glass overlay for main content with warm depth */
        .main-content::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.035) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.025) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.015) 0%, transparent 60%);
          pointer-events: none;
          z-index: -1;
          backdrop-filter: blur(0.5px);
        }

        .main-content::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 80px,
              rgba(255, 255, 255, 0.003) 81px,
              rgba(255, 255, 255, 0.003) 82px
            );
          pointer-events: none;
          z-index: -1;
          opacity: 0.25;
        }

        /* Accessibility and performance optimizations for warm glass theme */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .shows-section::before,
          .shows-section::after,
          .section-title::before,
          .shows-grid::before,
          .layout-container::before,
          .layout-container::after,
          .main-content::before,
          .main-content::after {
            display: none;
          }
        }

        /* High contrast mode adjustments for warm glass theme */
        @media (prefers-contrast: high) {
          .section-title {
            border: 2px solid rgba(255, 255, 255, 0.5);
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: none;
          }
          
          .shows-section::before {
            border: 2px solid rgba(255, 255, 255, 0.4);
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: none;
          }

          .shows-grid {
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: none;
            border: 1px solid rgba(255, 255, 255, 0.25);
          }
        }

        /* Enhanced focus states for accessibility */
        .section-title:focus-visible {
          outline: 3px solid rgba(255, 182, 193, 0.8);
          outline-offset: 4px;
        }

        /* Print styles for glass theme */
        @media print {
          .shows-section::before,
          .shows-section::after,
          .section-title::before,
          .shows-grid::before,
          .layout-container::before,
          .layout-container::after,
          .main-content::before,
          .main-content::after {
            display: none !important;
          }
          
          .layout-container {
            background: white !important;
            color: black !important;
          }

          .section-title {
            background: white !important;
            color: black !important;
            border: 1px solid black !important;
            backdrop-filter: none !important;
          }
        }
      `}</style>
    </Layout>
  );
}

export default FrontPage;