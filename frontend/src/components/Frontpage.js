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
      window.location.href = '/login';
      return;
    }

    // Fetch frontpage data
    axios.get('http://localhost:5000/frontpage', {
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

    // Fetch user preferences
    axios.get('http://localhost:5000/users/preferences', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUserPreferences({
          playTrailerOnHover: res.data.playTrailerOnHover || false,
          showMyRatingsToOthers: res.data.showMyRatingsToOthers || false
        });
      })
      .catch(err => {
        console.error('Error fetching user preferences:', err);
        // Keep default preferences if fetch fails
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
    if (!thumbnail) return 'http://localhost:5000/shows/placeholder.jpg';
    return `/shows/${thumbnail}`;
  };

  const handleImageError = (e, showTitle, thumbnail) => {
    console.error(`Image error for ${showTitle}`, thumbnail);
    e.target.src = '/placeholder.jpg';
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

        .top-rated-title::after {
          background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
        }

        .action-hits-title::after {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        }

        .thriller-title::after {
          background: linear-gradient(135deg, #2c2c54 0%, #8b5cf6 100%);
        }

        .comedy-title::after {
          background: linear-gradient(135deg, #f9ca24 0%, #f0932b 100%);
        }

        .drama-title::after {
          background: linear-gradient(135deg, #eb4d4b 0%, #6c5ce7 100%);
        }

        .family-title::after {
          background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
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
          transform: translateY(-12px) scale(1.15);
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