import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import axios from 'axios';
import Layout from './Layout';
import VideoPlayer from './videoplayer';
import CommentSection from './Comment';
import Rating from './Rating';
import { useNavigate } from 'react-router-dom';
import './ShowCard.css';
import './TrendingCarousel.css';


function ShowDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();

  // Watch tracking state
  const [watchStartTime, setWatchStartTime] = useState(null);
  const [isWatchEventRecorded, setIsWatchEventRecorded] = useState(false);
  const watchTimerRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';


  // Check if the show is a movie
  const isMovie = show?.CATEGORY_ID === 1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Fetch current favorite status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`${BASE_URL}/favorite/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsFavorite(res.data.favorite);
      })
      .catch((err) => {
        console.warn('Could not check favorite status.');
        setIsFavorite(false);
      });
  }, [id]);

  // Fetch user subscription status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`${BASE_URL}/subscriptions/user/current`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserSubscription(res.data.subscription);
      })
      .catch((err) => {
        console.warn('Could not check subscription status.');
        setUserSubscription(null);
      });
  }, []);

  // Reset watch tracking when selected episode changes
  useEffect(() => {
    setIsWatchEventRecorded(false);
    if (watchTimerRef.current) {
      clearTimeout(watchTimerRef.current);
      watchTimerRef.current = null;
    }
  }, [selectedEpisode]);

  // Cleanup watch timer on component unmount
  useEffect(() => {
    return () => {
      if (watchTimerRef.current) {
        clearTimeout(watchTimerRef.current);
        watchTimerRef.current = null;
      }
    };
  }, []);

  // Handle episode selection from UserProfile (state-based navigation)
  useEffect(() => {
    if (location.state?.selectedEpisodeId && episodes.length > 0) {
      const targetEpisode = episodes.find(ep => ep.SHOW_EPISODE_ID === parseInt(location.state.selectedEpisodeId));
      if (targetEpisode) {
        setSelectedEpisode(targetEpisode);
        // Clear the state to prevent re-triggering
        window.history.replaceState({}, '', location.pathname);
      }
    }
  }, [episodes, location.state]);

  // Handle episode parameter from URL (for notifications)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const episodeId = params.get('episode');
    const commentId = params.get('comment');
    const preventScroll = location.state?.preventScroll;
    
    if (episodeId && episodes.length > 0) {
      console.log('📺 Switching to episode from notification:', episodeId);
      
      // Find the episode with matching SHOW_EPISODE_ID
      const targetEpisode = episodes.find(ep => ep.SHOW_EPISODE_ID === parseInt(episodeId));
      
      if (targetEpisode) {
        console.log('✅ Found episode:', targetEpisode);
        setSelectedEpisode(targetEpisode);
        
        // Only scroll if not prevented
        if (!preventScroll) {
          // Directly locate and scroll to the specific comment
          setTimeout(() => {
          if (commentId) {
            // Try to find the specific comment first
            const specificComment = document.querySelector(`[data-comment-id="${commentId}"]`) ||
                                   document.querySelector(`#comment-${commentId}`) ||
                                   document.querySelector(`.comment-${commentId}`);
            
            if (specificComment) {
              console.log('🎯 Found specific comment, scrolling directly to:', commentId);
              specificComment.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Add a temporary highlight effect
              specificComment.style.background = 'rgba(127, 90, 240, 0.2)';
              specificComment.style.border = '2px solid #7f5af0';
              specificComment.style.borderRadius = '8px';
              specificComment.style.transition = 'all 0.3s ease';
              
              // Remove highlight after 3 seconds
              setTimeout(() => {
                specificComment.style.background = '';
                specificComment.style.border = '';
                specificComment.style.borderRadius = '';
              }, 3000);
            } else {
              console.log('💬 Comment not found, falling back to comments section');
              // Fallback: scroll to comments section
              const commentsSection = document.querySelector('[data-testid="comment-section"]') || 
                                     document.querySelector('.comment-section');
              
              if (commentsSection) {
                console.log('� Scrolling to comments section as fallback');
                commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                // Final fallback: scroll to bottom of page
                console.log('📝 Comments section not found, scrolling to bottom');
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }
            }
          } else {
            // No specific comment, just scroll to comments section
            const commentsSection = document.querySelector('[data-testid="comment-section"]') || 
                                   document.querySelector('.comment-section');
            
            if (commentsSection) {
              console.log('📍 Scrolling to comments section');
              commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 1000); // Delay to ensure episode is selected and comments are loaded
        }
      } else {
        console.warn('❌ Episode not found:', episodeId);
      }
    }
  }, [location.search, episodes]);

  // Fetch show details and episodes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/auth';
      return;
    }

    // Fetch show details
    axios
      .get(`${BASE_URL}/show/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log('📺 Show details received:', res.data); // Debug log
        console.log('📽️ Directors data:', res.data.DIRECTORS); // Debug log
        console.log('🎬 Similar shows data:', res.data.SIMILAR_SHOWS); // Debug log
        setShow(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/auth';
        } else {
          console.error('Error fetching show details:', err);
          setError('Could not fetch show details.');
          setLoading(false);
        }
      });

    // Fetch episodes for this show (only if not a movie)
    axios
      .get(`${BASE_URL}/show/${id}/episodes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEpisodes(res.data);
        // Auto-select first episode if available
        if (res.data.length > 0) {
          setSelectedEpisode(res.data[0]);
        }
      })
      .catch((err) => {
        console.error('Error fetching episodes:', err);
      });
  }, [id]);

  // Video player functions
  const playEpisode = (episode) => {
    // Check if user has active subscription
    const hasActiveSubscription = userSubscription && userSubscription.SUBSCRIPTION_STATUS === 1;
    
    // Allow episode 1 for everyone, other episodes require subscription
    if (episode.EPISODE_NUMBER !== 1 && !hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }
    
    setSelectedEpisode(episode);
    setShowVideoPlayer(true);
    setIsPlaying(true);
    
    // Start watch tracking immediately when video player opens
    if (!isWatchEventRecorded && episode) {
      setWatchStartTime(Date.now());
      
      // Clear any existing timer
      if (watchTimerRef.current) {
        clearTimeout(watchTimerRef.current);
      }
      
      // Set timer for 10 seconds - starts immediately when player opens
      watchTimerRef.current = setTimeout(() => {
        recordWatchEvent(episode.SHOW_EPISODE_ID);
      }, 10000); // 10 seconds
    }
  };

  // For movies, play the movie directly (subscription required for movies)
  const playMovie = () => {
    const hasActiveSubscription = userSubscription && userSubscription.SUBSCRIPTION_STATUS === 1;
    
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }
    
    // Set the selected episode to the first (and only) episode for movies
    if (episodes && episodes.length > 0) {
      console.log('🎬 Movie - Setting selectedEpisode:', episodes[0]);
      setSelectedEpisode(episodes[0]);
    } else {
      console.error('❌ Movie - No episodes found:', { episodes, show });
    }
    
    setShowVideoPlayer(true);
    setIsPlaying(true);
    
    // Start watch tracking immediately when video player opens (for movies, use the show data)
    if (!isWatchEventRecorded && show && episodes.length > 0) {
      setWatchStartTime(Date.now());
      
      // Clear any existing timer
      if (watchTimerRef.current) {
        clearTimeout(watchTimerRef.current);
      }
      
      // For movies, record against the first episode or create a movie-specific logic
      // You might need to adjust this based on your movie data structure
      watchTimerRef.current = setTimeout(() => {
        recordWatchEvent(episodes[0]?.SHOW_EPISODE_ID);
      }, 10000); // 10 seconds
    }
  };

  const closeSubscriptionModal = () => {
    setShowSubscriptionModal(false);
  };

  const goToSubscriptionPage = () => {
    navigate('/subscription');
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setIsPlaying(false);
    // Remove videoRef.current.pause() since we're using iframe
    
    // Clean up watch tracking
    if (watchTimerRef.current) {
      clearTimeout(watchTimerRef.current);
      watchTimerRef.current = null;
    }
    setWatchStartTime(null);
    setIsWatchEventRecorded(false);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Video event handlers
  const handleVideoPlay = () => {
    setIsPlaying(true);
    // Timer already started when video player opened, no need to start it here
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    // Don't clear the timer on pause - we want to track time spent in player, not just play time
  };

  // Function to record watch event
  const recordWatchEvent = async (episodeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.post(`${BASE_URL}/watch/record`, {
        showEpisodeId: episodeId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setIsWatchEventRecorded(true);
        console.log('Watch event recorded successfully');
      }
    } catch (error) {
      console.error('Error recording watch event:', error);
    }
  };
  const handleVideoEnded = () => {
    setIsPlaying(false);
    // Auto-play next episode if available and not a movie
    if (!isMovie && selectedEpisode) {
      const currentIndex = episodes.findIndex(ep => ep.SHOW_EPISODE_ID === selectedEpisode.SHOW_EPISODE_ID);
      if (currentIndex < episodes.length - 1) {
        const nextEpisode = episodes[currentIndex + 1];
        setTimeout(() => {
          playEpisode(nextEpisode);
        }, 2000);
      }
    }
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .post(
        `${BASE_URL}/favorite/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setIsFavorite(res.data.favorite);
      })
      .catch((err) => {
        console.error('Failed to toggle favorite:', err);
      });
  };

  // Format duration properly
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle genre click navigation - avoid auth issues by staying on current domain
  const handleGenreClick = (genreName) => {
    const trimmedGenre = genreName.trim();
    console.log('🎬 Genre clicked in ShowDetails:', trimmedGenre);
    
    // Store the genre selection in sessionStorage to persist across navigation
    sessionStorage.setItem('selectedGenre', trimmedGenre);
    sessionStorage.setItem('openSearch', 'true');
    
    // Navigate to frontpage (where Layout.js is used)
    navigate('/frontpage');
    
    // Trigger a custom event to notify Layout component
    window.dispatchEvent(new CustomEvent('genreSearch', { 
      detail: { genre: trimmedGenre } 
    }));
  };

  // Parse genres and render as clickable text buttons
  const renderGenres = () => {
    if (!show.GENRES || show.GENRES === 'N/A') {
      return 'N/A';
    }

    const genres = show.GENRES.split(',').map(g => g.trim());
    
    return genres.map((genre, index) => (
      <span key={index}>
        <span
          onClick={() => handleGenreClick(genre)}
          style={{
            color: '#7f5af0',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.95rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#533483';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#7f5af0';
          }}
        >
          {genre}
        </span>
        {index < genres.length - 1 && ', '}
      </span>
    ));
  };

  // Scroll-based transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const contentY = useTransform(scrollYProgress, [0, 0.2], [0, -20]);

  // Episode card component with individual animations
  const EpisodeCard = ({ episode, index, isSelected }) => {
    const cardRef = useRef(null);
    const { scrollYProgress: cardScrollProgress } = useScroll({
      target: cardRef,
      offset: ["start end", "end start"]
    });

    const scale = useTransform(cardScrollProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);
    const opacity = useTransform(cardScrollProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.8]);

    // Check if episode is locked (requires subscription)
    const hasActiveSubscription = userSubscription && userSubscription.SUBSCRIPTION_STATUS === 1;
    const isLocked = episode.EPISODE_NUMBER !== 1 && !hasActiveSubscription;

    return (
      <motion.div
        ref={cardRef}
        style={{ 
          scale, 
          opacity: isLocked ? 0.7 : opacity,
          backgroundColor: isSelected ? '#1a1a40' : '#16213e',
          padding: '15px 20px',
          borderRadius: '12px',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          border: isSelected 
            ? '3px solid #7f5af0' // Vibrant, thick border for selected
            : isLocked 
              ? '2px solid #666' // Dimmed border for locked episodes
              : '2px solid #533483', // Visible border for unselected
          transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          boxShadow: isSelected 
            ? '0 0 8px 2px #7f5af0, 0 8px 25px rgba(22, 33, 62, 0.3)'
            : '0 4px 15px rgba(22, 33, 62, 0.2)',
        }}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={!isLocked ? { 
          scale: 1.02,
          x: 5,
          transition: { duration: 0.2 }
        } : {}}
        whileTap={!isLocked ? { scale: 0.98 } : {}}
        onClick={() => {
          if (isLocked) {
            setShowSubscriptionModal(true);
          } else {
            setSelectedEpisode(episode);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        {/* Animated background gradient */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.2), rgba(83, 52, 131, 0.08))',
            opacity: 0,
          }}
          whileHover={{ opacity: isLocked ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
          {isLocked && (
            <motion.span
              style={{ color: '#999', fontSize: '1rem' }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔒
            </motion.span>
          )}
          <motion.span 
            style={{ 
              color: isLocked ? '#999' : '#fff', 
              fontWeight: '600',
            }}
            whileHover={{ color: isLocked ? '#999' : '#e50914' }}
            transition={{ duration: 0.2 }}
          >
            Episode {episode.EPISODE_NUMBER}
          </motion.span>
        </motion.div>
        
        <motion.span 
          style={{ 
            color: isLocked ? '#666' : '#999', 
            fontSize: '0.85rem',
            position: 'relative',
            zIndex: 1
          }}
          whileHover={{ color: isLocked ? '#666' : '#ccc' }}
          transition={{ duration: 0.2 }}
        >
          {formatDuration(episode.SHOW_EPISODE_DURATION || episode.DURATION || episode.duration || episode.length || null)}
        </motion.span>
      </motion.div>
    );
  };

  // Cast Card Component - Exact 1:1 copy from ActorsPage
  const CastCard = ({ actor, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { 
      once: true, 
      amount: 0.3,
      margin: "0px 0px -100px 0px"
    });

    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0.7, opacity: 0, y: 50 }}
        animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.7, opacity: 0, y: 50 }}
        transition={{
          duration: 0.6,
          delay: (index % 4) * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          scale: 1.08,
          rotateY: 5,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/actor/${actor.ACTOR_ID}`)}
        className="actor-card"
      >
        <div className="actor-card-inner">
          <div className="actor-image-container">
            <motion.img
              src={`${BASE_URL}/actors/${actor.PICTURE}`}
              alt={actor.NAME || `${actor.ACTOR_FIRSTNAME} ${actor.ACTOR_LASTNAME}`}
              className="actor-image"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              onError={(e) => {
                e.target.src = `${BASE_URL}/actors/${actor.PICTURE}`;
              }}
            />
            {/* Glass overlay with actor info */}
            <div className="actor-glass-overlay">
              <motion.div
                className="actor-glass-content"
                initial={{ opacity: 1, y: 0 }}
                whileHover={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="actor-glass-name">
                  {actor.NAME || `${actor.ACTOR_FIRSTNAME} ${actor.ACTOR_LASTNAME}`}
                </h3>
                <p className="actor-glass-role">Actor</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Director Card Component - Exact 1:1 copy from DirectorsPage
  const DirectorCard = ({ director, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { 
      once: true, 
      amount: 0.3,
      margin: "0px 0px -100px 0px"
    });

    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0.7, opacity: 0, y: 50 }}
        animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.7, opacity: 0, y: 50 }}
        transition={{
          duration: 0.6,
          delay: (index % 4) * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          scale: 1.08,
          rotateY: 5,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/director/${director.DIRECTOR_ID}`)}
        className="actor-card"
      >
        <div className="actor-card-inner">
          <div className="actor-image-container">
            <motion.img
              src={`${BASE_URL}/directors/${director.IMAGE}`}
              alt={director.DIRECTOR_NAME}
              className="actor-image"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              onError={(e) => {
                e.target.src = `${BASE_URL}/placeholder.jpg`;
              }}
            />
            {/* Glass overlay with director info */}
            <div className="actor-glass-overlay">
              <motion.div
                className="actor-glass-content"
                initial={{ opacity: 1, y: 0 }}
                whileHover={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="actor-glass-name">
                  {director.DIRECTOR_NAME}
                </h3>
                <p className="actor-glass-role">Director</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Similar Show Card Component - Exact 1:1 copy from ShowCard (frontpage)
  const SimilarShowCard = ({ show, index }) => {
    const [showVideo, setShowVideo] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(show?.IS_FAVORITE || false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    
    const timerRef = useRef(null);
    const cardRef = useRef(null);
    const videoRef = useRef(null);

    const getImagePath = (thumbnail) => {
      if (!thumbnail) return `${BASE_URL}/shows/placeholder.jpg`;
      return `${BASE_URL}/shows/${thumbnail}`;
    };

    const getYouTubeEmbedUrl = (url) => {
      if (!url) return null;
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (!videoId) return null;
      
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&loop=1&playlist=${videoId}&enablejsapi=1&origin=${window.location.origin}`;
    };

    const handleImageError = (e, title, thumb) => {
      console.error(`Image error for ${title}`, thumb);
      e.target.src = `${BASE_URL}/placeholder.jpg`;
    };

    const handleMouseEnter = useCallback((e) => {
      setIsHovered(true);
      
      if (e.currentTarget) {
        e.currentTarget.style.willChange = 'transform, filter, backdrop-filter';
      }
      
      // Preload video after a short delay
      if (show.TEASER) {
        timerRef.current = setTimeout(() => {
          setShowVideo(true);
          setTimeout(() => setVideoReady(true), 300);
        }, 800);
      }
    }, [show.TEASER]);

    const handleMouseLeave = useCallback((e) => {
      setIsHovered(false);
      
      if (e.currentTarget) {
        e.currentTarget.style.willChange = 'auto';
      }
      
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

        const url = `${BASE_URL}/favorite/${show.SHOW_ID}`;
        
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
          '--hover-scale': isHovered ? '1.08' : '1',
          '--hover-z': isHovered ? '10' : '1'
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
                  {isMuted ? '🔇' : '🔊'}
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
              ❤️
            </button>
            
            <button
              className="action-btn play-btn"
              onClick={handleCardClick}
              aria-label="Play show"
            >
              ▶️
            </button>
          </div>

          {/* Rating Badge */}
          <div className="rating-badge">
            <span style={{ color: '#ffd700' }}>⭐</span>
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

  if (loading) {
    return (
      <Layout>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0c0c0c 0%, #16231e 100%)'
          }}
        >
          <motion.div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              color: '#fff',
              fontSize: '1.2rem'
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #333',
                borderTop: '4px solidrgb(48, 14, 220)',
                borderRadius: '50%',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Loading...
            </motion.span>
          </motion.div>
        </motion.div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)'
          }}
        >
          <motion.div 
            style={{
              textAlign: 'center',
              color: '#e50914',
              fontSize: '1.2rem',
              padding: '40px',
              background: 'rgba(229, 9, 20, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(229, 9, 20, 0.3)'
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.div>
        </motion.div>
      </Layout>
    );
  }

  if (!show) return null;

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #16213e 0%, #1a1a40 100%)',
          minHeight: '100vh',
          paddingBottom: '60px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Floating Elements */}
        <motion.div
          style={{
            position: 'fixed',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(83, 52, 131, 0.13), transparent)',
            borderRadius: '50%',
            top: '10%',
            right: '5%',
            pointerEvents: 'none',
            zIndex: 1
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          style={{
            position: 'fixed',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(22, 33, 62, 0.12), transparent)',
            borderRadius: '50%',
            bottom: '15%',
            left: '8%',
            pointerEvents: 'none',
            zIndex: 1
          }}
          animate={{
            y: [0, 25, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <VideoPlayer
          showVideoPlayer={showVideoPlayer}
          selectedEpisode={selectedEpisode}
          videoRef={videoRef}
          isPlaying={isPlaying}
          closeVideoPlayer={closeVideoPlayer}
          togglePlayPause={togglePlayPause}
          handleVideoPlay={handleVideoPlay}
          handleVideoPause={handleVideoPause}
          handleVideoEnded={handleVideoEnded}
          formatDuration={formatDuration}
          isMovie={isMovie}
        />

        {/* Hero Section with Background */}
        <motion.div 
          style={{ 
            y: heroY, 
            opacity: heroOpacity,
            position: 'relative',
            height: '82vh', // Increased height for more space
            background: `linear-gradient(rgba(22,33,62,0.55), rgba(26,26,64,0.90)), url(${BASE_URL}/banners/${show.BANNER}) center/cover`, // Less opaque overlay
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0 60px 80px', // More bottom padding
            overflow: 'hidden'
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Fade-out gradient at the bottom */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '120px',
              background: 'linear-gradient(to bottom, rgba(26,26,64,0) 0%, #16213e 100%)',
              pointerEvents: 'none',
              zIndex: 2
            }}
          />

          <motion.div 
            style={{
              maxWidth: '800px',
              color: '#fff'
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h1 
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 'bold',
                marginBottom: '20px',
                textShadow: '2px 2px 4px #0f3460',
                letterSpacing: '-1px'
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {show.TITLE} {show.CATEGORY_ID === 2 && `S${show.SEASON}`}
            </motion.h1>

            <motion.div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '25px',
                flexWrap: 'wrap'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(45deg, #533483 0%, #16213e 100%)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span>⭐</span>
                <span>{show.RATING}/10</span>
              </motion.div>

              <motion.span 
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ background: 'rgba(255,255,255,0.2)' }}
                transition={{ duration: 0.2 }}
              >
                {formatDuration(isMovie ? show.DURATION : selectedEpisode?.SHOW_EPISODE_DURATION || 'N/A')}
              </motion.span>

              <motion.span 
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ background: 'rgba(255,255,255,0.2)' }}
                transition={{ duration: 0.2 }}
              >
                {show.RELEASE_DATE?.slice(0, 4)}
              </motion.span>

              {show.AGE_RESTRICTION_NAME && (
                <motion.span 
                  style={{
                    background: 'rgba(83, 52, 131, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    border: '1px solid #533483'
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {show.AGE_RESTRICTION_NAME}
                </motion.span>
              )}
            </motion.div>

            <motion.p 
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '30px',
                maxWidth: '600px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {show.DESCRIPTION}
            </motion.p>

            <motion.div 
              style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <motion.button
                className="play-button"
                onClick={() => isMovie ? playMovie() : (selectedEpisode && playEpisode(selectedEpisode))}
                whileHover={{ 
                  scale: 1.02,
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                <span>▶</span>
                <span>Play</span>
              </motion.button>

              <div className="secondary-actions">
                <AnimatePresence>
                  {isFavorite !== null && (
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
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          style={{
            y: contentY,
            padding: '40px 60px',
            maxWidth: '1200px',
            margin: '0 auto',
            color: '#fff'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
         {/* Cast Section */}
          <AnimatePresence>
            {show.CAST && show.CAST.length > 0 && (
              <motion.div 
                style={{
                  marginBottom: '50px'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.h2 
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#fff',
                    textAlign: 'center',
                    textShadow: '1px 1px 2px #533483'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Cast & Crew
                </motion.h2>
                
                <motion.div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '80px 25px',
                    padding: '0 0 20px 0',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    marginTop: '10px'
                  }}
                  className="actors-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {show.CAST.map((actor, index) => (
                    <CastCard key={actor.ACTOR_ID} actor={actor} index={index} />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Directors Section */}
          <AnimatePresence>
            {show.DIRECTORS && show.DIRECTORS.length > 0 && (
              <motion.div 
                style={{
                  marginBottom: '50px'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.h2 
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#fff',
                    textAlign: 'center',
                    textShadow: '1px 1px 2px #533483'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Directors
                </motion.h2>
                
                <motion.div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '80px 25px',
                    padding: '0 0 20px 0',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    marginTop: '10px'
                  }}
                  className="actors-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  {show.DIRECTORS && show.DIRECTORS.map((director, index) => (
                    <DirectorCard key={director.DIRECTOR_ID} director={director} index={index} />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* More Like This Section */}
          <AnimatePresence>
            {show.SIMILAR_SHOWS && show.SIMILAR_SHOWS.length > 0 && (
              <motion.div 
                style={{
                  marginBottom: '50px'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.h2 
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#fff',
                    textAlign: 'center',
                    textShadow: '1px 1px 2px #533483'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  More Like This
                </motion.h2>
                
                <motion.div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '25px',
                    padding: '0 0 20px 0',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    marginTop: '10px'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {show.SIMILAR_SHOWS && show.SIMILAR_SHOWS.map((similarShow, index) => (
                    <SimilarShowCard key={similarShow.SHOW_ID} show={similarShow} index={index} />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Episodes Section - Only for Series */}
          <AnimatePresence>
            {!isMovie && episodes.length > 0 && (
              <motion.div 
                style={{
                  marginBottom: '50px'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.h2 
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#fff',
                    textAlign: 'center',
                    textShadow: '1px 1px 2px #533483'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Episodes
                </motion.h2>
                
                <motion.div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    maxWidth: '800px',
                    margin: '0 auto'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {episodes.map((episode, index) => (
                    <EpisodeCard 
                      key={episode.SHOW_EPISODE_ID} 
                      episode={episode} 
                      index={index}
                      isSelected={selectedEpisode && selectedEpisode.SHOW_EPISODE_ID === episode.SHOW_EPISODE_ID}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show Information */}
          <motion.div 
            style={{
              marginBottom: '50px'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.h2 
              style={{
                fontSize: '2.2rem',
                fontWeight: 'bold',
                marginBottom: '30px',
                color: '#fff',
                textAlign: 'center',
                textShadow: '1px 1px 2px #533483'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Information
            </motion.h2>
            
            <motion.div 
              style={{
                background: 'rgba(22, 33, 62, 0.85)',
                borderRadius: '15px',
                padding: '30px',
                border: '1px solid #533483',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 25px rgba(22, 33, 62, 0.3)',
                maxWidth: '800px',
                margin: '0 auto'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <motion.div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  color: '#fff'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ color: '#533483', marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>
                    Release Date
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#ccc' }}>
                    {formatReleaseDate(show.RELEASE_DATE)}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ color: '#533483', marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>
                    Rating
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#ccc' }}>
                    {show.RATING}/10
                  </p>
                </motion.div>

                {!isMovie && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 style={{ color: '#533483', marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>
                      Season
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: '#ccc' }}>
                      Season {show.SEASON}
                    </p>
                  </motion.div>
                )}

                {show.AGE_RESTRICTION_NAME && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 style={{ color: '#533483', marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>
                      Age Rating
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: '#ccc' }}>
                      {show.AGE_RESTRICTION_NAME}
                    </p>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ color: '#533483', marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>
                    Duration
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#ccc' }}>
                    {formatDuration(isMovie ? show.DURATION : selectedEpisode?.SHOW_EPISODE_DURATION || 'N/A')}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ color: '#533483', marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>
                    Watch Count
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#ccc' }}>
                    {show.WATCH_COUNT || 0} views
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 style={{ color: '#533483', marginBottom: '10px', fontSize: '1.1rem', fontWeight: '600' }}>
                    Genre
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#ccc' }}>
                    {renderGenres()}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Comments Section */}
          <AnimatePresence>
            {selectedEpisode && (
              <motion.div 
                style={{
                   position: 'static', // or remove position entirely
                    transform: 'none', // remove any transforms
                    overflow: 'visible', // ensure modal isn't clipped
                  marginBottom: '50px'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
              </motion.div>
            )}
          </AnimatePresence>

          {/* For Movies - Show comments without episode selection */}
          <AnimatePresence>
            {((isMovie && show.SHOW_ID) || (!isMovie && selectedEpisode)) && (
              <motion.div 
                style={{
                  marginBottom: '50px'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              > 
                {/* Rating Section */}
                {(isMovie && show.SHOW_ID) || (!isMovie && selectedEpisode) ? (
                  <motion.div 
                    style={{
                      background: 'rgba(22, 33, 62, 0.85)',
                      borderRadius: '15px',
                      padding: '30px',
                      border: '1px solid #533483',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 25px rgba(22, 33, 62, 0.3)',
                      maxWidth: '1000px',
                      margin: '0 auto 20px auto'
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <Rating 
                      episodeId={isMovie ? show.SHOW_ID : selectedEpisode.SHOW_EPISODE_ID} 
                      showAverageRating={true}
                    />
                  </motion.div>
                ) : null}
                
                <motion.div 
                  style={{
                    background: 'rgba(22, 33, 62, 0.85)',
                    borderRadius: '15px',
                    padding: '30px',
                    border: '1px solid #533483',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 25px rgba(22, 33, 62, 0.3)',
                    maxWidth: '1000px',
                    margin: '0 auto'
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <CommentSection episodeId={isMovie ? show.SHOW_ID : selectedEpisode.SHOW_EPISODE_ID} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Subscription Required Modal */}
      {showSubscriptionModal && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSubscriptionModal}
        >
          <motion.div
            style={{
              backgroundColor: '#16213e',
              borderRadius: '15px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              border: '2px solid #533483',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              style={{
                fontSize: '4rem',
                marginBottom: '20px'
              }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔒
            </motion.div>
            
            <h2 style={{ 
              color: '#fff', 
              marginBottom: '20px',
              fontSize: '1.8rem'
            }}>
              Subscription Required
            </h2>
            
            <p style={{ 
              color: '#ccc', 
              marginBottom: '30px',
              lineHeight: '1.6',
              fontSize: '1.1rem'
            }}>
              {isMovie 
                ? 'A subscription is required to watch this movie.'
                : 'A subscription is required to watch episodes beyond the first one. Episode 1 is free for everyone!'
              }
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <motion.button
                onClick={closeSubscriptionModal}
                style={{
                  backgroundColor: 'transparent',
                  color: '#ccc',
                  border: '2px solid #533483',
                  padding: '12px 25px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(83, 52, 131, 0.2)',
                  color: '#fff'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                onClick={goToSubscriptionPage}
                style={{
                  background: 'linear-gradient(45deg, #533483 0%, #7f5af0 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 5px 20px rgba(127, 90, 240, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get Subscription
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        .actors-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 80px 25px;
          padding: 0 0 20px 0;
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 10px;
        }

        .actor-card {
          cursor: pointer;
        }

        .actor-card-inner {
          background: linear-gradient(135deg, 
            rgba(255, 182, 193, 0.08) 0%, 
            rgba(255, 160, 122, 0.08) 100%);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(15px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
          position: relative;
        }

        .actor-image-container {
          position: relative;
          height: 350px;
          overflow: hidden;
          border-radius: 20px;
        }

        .actor-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        /* Glass overlay design similar to ShowCard */
        .actor-glass-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, 
            rgba(255, 182, 193, 0.15) 0%, 
            rgba(255, 160, 122, 0.15) 100%);
          backdrop-filter: blur(15px) saturate(140%);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 
            0 -4px 20px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .actor-glass-content {
          text-align: center;
        }

        .actor-glass-name {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.5px;
        }

        .actor-glass-role {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          font-weight: 500;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          opacity: 0.9;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .actors-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 60px 20px;
          }
        }

        @media (max-width: 768px) {
          .actors-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 50px 20px;
          }

          .actor-image-container {
            height: 240px;
          }
        }

        @media (max-width: 480px) {
          .actors-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 10px 10px 20px 10px;
          }
        }
      `}</style>
    </Layout>
  );
}

export default ShowDetails;