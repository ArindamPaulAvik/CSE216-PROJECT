import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Layout from './Layout';
import VideoPlayer from './videoplayer';
import CommentSection from './Comment';

function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Fetch current favorite status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`http://localhost:5000/favorite/${id}`, {
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

  // Fetch show details and episodes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Redirecting...');
      window.location.href = '/login';
      return;
    }

    // Fetch show details
    axios
      .get(`http://localhost:5000/show/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setShow(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error('Error fetching show details:', err);
          setError('Could not fetch show details.');
          setLoading(false);
        }
      });

    // Fetch episodes for this show
    axios
      .get(`http://localhost:5000/show/${id}/episodes`, {
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
    setSelectedEpisode(episode);
    setShowVideoPlayer(true);
    setIsPlaying(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
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
  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);
  const handleVideoEnded = () => {
    setIsPlaying(false);
    // Auto-play next episode if available
    const currentIndex = episodes.findIndex(ep => ep.SHOW_EPISODE_ID === selectedEpisode.SHOW_EPISODE_ID);
    if (currentIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentIndex + 1];
      setTimeout(() => {
        playEpisode(nextEpisode);
      }, 2000);
    }
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .post(
        `http://localhost:5000/favorite/${id}`,
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

    return (
      <motion.div
        ref={cardRef}
        style={{ 
          scale, 
          opacity,
          backgroundColor: isSelected ? '#333' : '#1a1a1a',
          padding: '15px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          border: isSelected ? '2px solid #e50914' : '1px solid #333',
          transition: 'all 0.3s ease',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          boxShadow: isSelected ? '0 8px 25px rgba(229, 9, 20, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.2)',
        }}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{ 
          scale: 1.02,
          x: 5,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setSelectedEpisode(episode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
            background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(229, 9, 20, 0.05))',
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.span 
          style={{ 
            color: '#fff', 
            fontWeight: '600',
            position: 'relative',
            zIndex: 1
          }}
          whileHover={{ color: '#e50914' }}
          transition={{ duration: 0.2 }}
        >
          Episode {episode.EPISODE_NUMBER}
        </motion.span>
        
        <motion.span 
          style={{ 
            color: '#999', 
            fontSize: '0.85rem',
            position: 'relative',
            zIndex: 1
          }}
          whileHover={{ color: '#ccc' }}
          transition={{ duration: 0.2 }}
        >
          {formatDuration(episode.SHOW_EPISODE_DURATION)}
        </motion.span>
      </motion.div>
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
            background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)'
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
                borderTop: '4px solid #e50914',
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
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
          minHeight: '100vh',
          paddingBottom: '60px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Scroll Progress Indicator */}
        <motion.div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #e50914, #ff6b6b)',
            transformOrigin: '0%',
            scaleX: scrollYProgress,
            zIndex: 1000
          }}
        />

        {/* Floating Elements */}
        <motion.div
          style={{
            position: 'fixed',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(229, 9, 20, 0.1), transparent)',
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
            background: 'radial-gradient(circle, rgba(255, 107, 107, 0.08), transparent)',
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
        />

        {/* Hero Section with Background */}
        <motion.div 
          style={{ 
            y: heroY, 
            opacity: heroOpacity,
            position: 'relative',
            height: '70vh',
            background: `linear-gradient(rgba(0,0,0,0.4), rgba(33, 28, 28, 0.8)), url(/showS/${show.THUMBNAIL}) center/cover`,
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0 60px 60px'
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
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
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
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
                  background: 'rgba(229, 9, 20, 0.9)',
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
                  background: 'rgba(255,255,255,0.1)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ background: 'rgba(255,255,255,0.2)' }}
                transition={{ duration: 0.2 }}
              >
                {formatDuration(selectedEpisode?.SHOW_EPISODE_DURATION || 'N/A')}
              </motion.span>

              <motion.span 
                style={{
                  background: 'rgba(255,255,255,0.1)',
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
                    background: 'rgba(255,255,255,0.2)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.3)'
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
                onClick={() => selectedEpisode && playEpisode(selectedEpisode)}
                style={{
                  background: 'linear-gradient(45deg, #fff 0%, #f0f0f0 100%)',
                  color: '#000',
                  border: 'none',
                  padding: '15px 35px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span>▶️</span>
                Play
              </motion.button>

              <AnimatePresence>
                {isFavorite !== null && (
                  <motion.button
                    onClick={toggleFavorite}
                    style={{
                      background: 'rgba(42, 42, 42, 0.8)',
                      color: '#fff',
                      border: '2px solid rgba(255,255,255,0.3)',
                      padding: '13px 30px',
                      borderRadius: '8px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    whileHover={{ 
                      background: 'rgba(255,255,255,0.1)',
                      scale: 1.05
                    }}
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
                        rotate: isFavorite ? [0, 10, -10, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {isFavorite ? '❤️' : '🤍'}
                    </motion.span>
                    {isFavorite ? 'Remove from List' : 'Add to List'}
                  </motion.button>
                )}
              </AnimatePresence>
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
          {/* Container for Episodes and Show Info */}
          <motion.div 
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '40px',
              marginBottom: '30px',
              width: '100%',
              maxWidth: '100vw',
              boxSizing: 'border-box',
              paddingRight: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Episodes Section (left) */}
            <AnimatePresence>
              {episodes.length > 0 && (
                <motion.div 
                  style={{
                    width: '500px',
                    maxWidth: '100%', 
                    minWidth: '300px',
                    flexShrink: 0,
                  }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.h2 
                    style={{ 
                      fontSize: '2rem', 
                      fontWeight: 'bold', 
                      marginBottom: '20px', 
                      color: '#fff' 
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    Episodes
                  </motion.h2>
                  <motion.div 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    {episodes.map((episode, index) => (
                      <EpisodeCard 
                        key={episode.SHOW_EPISODE_ID}
                        episode={episode}
                        index={index}
                        isSelected={selectedEpisode?.SHOW_EPISODE_ID === episode.SHOW_EPISODE_ID}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show Information Section (right) */}
            <motion.div 
              style={{
                flex: '0 0 280px',
                position: 'sticky',
                top: '20px',
                alignSelf: 'flex-start',
                right: 0,
                background: 'rgba(42, 42, 42, 0.85)',
                padding: '25px 30px',
                borderRadius: '15px',
                color: '#ccc',
                lineHeight: '1.8',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                marginLeft: 'auto',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ 
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                scale: 1.02
              }}
            > 
              {[
                { label: 'Category', value: show.CATEGORY_NAME || 'N/A' },
                { label: 'Genre', value: show.GENRES || 'N/A' },
                { label: 'Duration', value: formatDuration(selectedEpisode?.SHOW_EPISODE_DURATION || 'N/A') },
                { label: 'Release Date', value: formatReleaseDate(show.RELEASE_DATE) },
                { label: 'Publisher', value: show.PUBLISHER_NAME || 'N/A' },
                { label: 'Rating', value: `${show.RATING}/10` },
                { label: 'Age Rating', value: show.AGE_RESTRICTION_NAME || 'N/A' },
                ...(show.SEASON_COUNT > 0 ? [{ label: 'Seasons', value: show.SEASON_COUNT }] : [])
              ].map((item, index) => (
                <motion.p 
                  key={item.label}
                  style={{ marginBottom: '15px' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <strong style={{ color: '#fff' }}>{item.label}:</strong> {item.value}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>

          {/* Comments Section below */}
          <AnimatePresence>
            {selectedEpisode && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <CommentSection episodeId={selectedEpisode.SHOW_EPISODE_ID} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

export default ShowDetails;