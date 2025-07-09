import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const imagePaths = [
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.jpg',
  '/images/image4.jpg',
  '/images/image5.jpg',
];

const keywords = [
  'Oscars', 'Tom Cruise', 'Stranger Things', 'Romance', 'Action',
  'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Emmy', 'Netflix',
  'Cinematography', 'Directors', 'Stunts', 'Series', 'Blockbuster',
  'Marvel', 'Disney', 'Comedy', 'Animation', 'Documentary', 'Fantasy',
  'Adventure', 'Mystery', 'Leonardo DiCaprio', 'Meryl Streep', 'Brad Pitt',
  'Jennifer Lawrence', 'Denzel Washington', 'Scarlett Johansson', 'Will Smith',
  'Margot Robbie', 'Robert Downey Jr', 'Emma Stone', 'Ryan Gosling',
  'Natalie Portman', 'Christian Bale', 'Cate Blanchett', 'Matt Damon',
  'Sandra Bullock', 'Christopher Nolan', 'Quentin Tarantino', 'Martin Scorsese',
  'Steven Spielberg', 'Denis Villeneuve', 'Jordan Peele', 'Greta Gerwig',
  'Ridley Scott', 'David Fincher', 'Rian Johnson', 'Chloe Zhao',
  'Bong Joon-ho', 'Damien Chazelle', 'Guillermo del Toro', 'Wes Anderson',
  'Sofia Coppola', 'Spike Lee', 'Paul Thomas Anderson', 'Ari Aster',
  'HBO', 'Amazon Prime', 'Apple TV', 'Hulu', 'Paramount', 'Warner Bros',
  'Universal', 'Sony Pictures', 'A24', 'Sundance', 'Cannes', 'Golden Globes',
  'SAG Awards', 'Critics Choice', 'BAFTA', 'Venice Film Festival'
];

// Animation Variants
const formVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    rotateY: direction < 0 ? 15 : -15,
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const buttonVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
      delay: 0.3,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const switchTextVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
    },
  },
};

const renderFloatingKeywords = () => {
  const lanes = 8;
  const wordsPerLane = 8;
  const keywordGroups = [];

  // Configuration for each lane - larger=faster, smaller=slower
  const laneConfigs = [
    { speed: 70, fontSize: 16, opacity: 0.25 },  // small=slow
    { speed: 30, fontSize: 28, opacity: 0.4 },   // large=fast
    { speed: 85, fontSize: 14, opacity: 0.2 },   // small=slow
    { speed: 50, fontSize: 20, opacity: 0.3 },   // medium=normal
    { speed: 75, fontSize: 15, opacity: 0.22 },  // small=slow
    { speed: 25, fontSize: 32, opacity: 0.45 },  // large=fast
    { speed: 55, fontSize: 18, opacity: 0.28 },  // medium=normal
    { speed: 35, fontSize: 26, opacity: 0.38 }   // large=fast
  ];

  for (let i = 0; i < lanes; i++) {
    // Create 8 words for this lane, cycling through the keywords array
    const laneWords = [];
    for (let j = 0; j < wordsPerLane; j++) {
      laneWords.push(keywords[(i * wordsPerLane + j) % keywords.length]);
    }

    const config = laneConfigs[i];

    keywordGroups.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${(i + 1) * (100 / (lanes + 1))}%`,
          whiteSpace: 'nowrap',
          display: 'flex',
          gap: '60px',
          fontSize: `${config.fontSize}px`,
          fontWeight: 600,
          color: 'white',
          opacity: config.opacity,
          pointerEvents: 'none',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <motion.div
          style={{ display: 'flex', gap: '60px' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: config.speed,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {laneWords.map((word, index) => (
            <span key={index}>{word}</span>
          ))}
          {laneWords.map((word, index) => (
            <span key={`${index}-dup1`}>{word}</span>
          ))}
          {laneWords.map((word, index) => (
            <span key={`${index}-dup2`}>{word}</span>
          ))}
          {laneWords.map((word, index) => (
            <span key={`${index}-dup3`}>{word}</span>
          ))}
        </motion.div>
      </div>
    );
  }

  return keywordGroups;
};

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    userFirstname: '',
    userLastname: '',
    countryId: '',
    birthdate: '',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imagePaths.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e) => {
    setRegisterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/login', loginData);
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_id', res.data.userId); // Store user_id for comment logic
        navigate('/frontpage');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/register', registerData);
      if (response.status === 201) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setMode('login');
  };

  const switchMode = (targetMode) => {
    if (mode !== targetMode) {
      setError(null);
      setMode(targetMode);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '8px',
    borderRadius: '8px',
    border: '2px solid transparent',
    fontSize: '16px',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  };

  const submitBtnStyle = {
    marginTop: 'auto',
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(45deg, #e50914, #ff1744)',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)',
    position: 'relative',
    overflow: 'hidden',
  };

  const switchTextStyle = {
    marginTop: '16px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'white',
  };

  const hoverSpanStyle = {
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgb(22, 32, 62)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }}>
        {renderFloatingKeywords()}
      </div>

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          zIndex: 1000,
        }}
      >
        <h1
          style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#ff0000',
            fontFamily: 'Segoe UI, sans-serif',
            textShadow: `
              0 0 12px rgba(255, 0, 0, 0.9),
              0 0 20px rgba(255, 0, 0, 0.8),
              0 0 30px rgba(255, 0, 0, 0.6),
              0 0 40px rgba(255, 0, 0, 0.5)
            `,
            letterSpacing: '1px',
            transition: 'none',
            userSelect: 'none',
          }}
        >
          RnbDom
        </h1>
      </div>

      {/* Image Holder container */}
      <div
        style={{
          flexBasis: '50vw',
          marginLeft: '20px',
          marginRight: '20px',
          marginTop: '20px',
          marginBottom: '24px',
          left: '200px',
          bottom: '10px',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(255,255,255,0.2)',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={imagePaths[currentImageIndex]}
            alt="Cycling background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.85)',
              borderRadius: '15px',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </AnimatePresence>
      </div>

      {/* Enhanced Sliding Sidebar Container */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100vh',
          width: '25vw',
          overflow: 'hidden',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '15px 25px',
          boxSizing: 'border-box',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          zIndex: 4,
        }}
      >
        <div style={{ position: 'relative', height: '100%', perspective: '1000px' }}>
          <AnimatePresence mode="wait" custom={mode === 'login' ? -1 : 1}>
            <motion.div
              key={mode}
              custom={mode === 'login' ? -1 : 1}
              variants={formVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 20,
                duration: 0.6,
              }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
              }}
            >
              {mode === 'login' ? (
                // Enhanced Login Form
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ width: '100%', height: '100%' }}
                >
                  <motion.form 
                    onSubmit={handleLoginSubmit} 
                    style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <motion.h2 
                      variants={itemVariants}
                      style={{ 
                        textAlign: 'center', 
                        marginBottom: '20px', 
                        color: 'white',
                        fontSize: '28px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Log In
                    </motion.h2>

                    <motion.label 
                      variants={itemVariants}
                      style={{ marginLeft:'15px', marginBottom: '10px', fontWeight: '500', color: '#e0e0e0' }}
                    >
                      Email
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        value={loginData.email}
                        onChange={handleLoginChange}
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid #e50914';
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid transparent';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      />
                    </motion.label>

                    <motion.label 
                      variants={itemVariants}
                      style={{ marginLeft:'15px', marginBottom: '10px', fontWeight: '500', color: '#e0e0e0' }}
                    >
                      Password
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        value={loginData.password}
                        onChange={handleLoginChange}
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid #e50914';
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid transparent';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      />
                    </motion.label>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      disabled={isLoading}
                      style={{
                        ...submitBtnStyle,
                        background: isLoading 
                          ? 'linear-gradient(45deg, #666, #888)' 
                          : 'linear-gradient(45deg, #e50914, #ff1744)',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid transparent',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                          }}
                        />
                      ) : null}
                      {isLoading ? 'Logging in...' : 'Log In'}
                    </motion.button>

                    <motion.div 
                      variants={switchTextVariants}
                      style={switchTextStyle}
                    >
                      Don't have an account?{' '}
                      <motion.span
                        onClick={() => switchMode('register')}
                        style={hoverSpanStyle}
                        whileHover={{
                          scale: 1.05,
                          textShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Register here
                      </motion.span>
                    </motion.div>
                  </motion.form>
                </motion.div>
              ) : (
                // Enhanced Register Form
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ width: '100%', height: '100%' }}
                >
                  <motion.form 
                    onSubmit={handleRegisterSubmit} 
                    style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <motion.h2 
                      variants={itemVariants}
                      style={{ 
                        textAlign: 'center', 
                        marginBottom: '20px', 
                        color: 'white',
                        fontSize: '28px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Register
                    </motion.h2>

                    <motion.label 
                      variants={itemVariants}
                      style={{ marginBottom: '10px', fontWeight: '500', color: '#e0e0e0' }}
                    >
                      Email
                      <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid #e50914';
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid transparent';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      />
                    </motion.label>

                    <motion.label 
                      variants={itemVariants}
                      style={{ marginBottom: '15px', fontWeight: '500', color: '#e0e0e0' }}
                    >
                      Password
                      <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid #e50914';
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid transparent';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      />
                    </motion.label>

                    <motion.label 
                      variants={itemVariants}
                      style={{ marginBottom: '15px', fontWeight: '500', color: '#e0e0e0' }}
                    >
                      First Name
                      <input
                        name="userFirstname"
                        type="text"
                        placeholder="Enter your first name"
                        required
                        value={registerData.userFirstname}
                        onChange={handleRegisterChange}
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid #e50914';
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid transparent';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      />
                    </motion.label>

                    <motion.label 
                      variants={itemVariants}
                      style={{ marginBottom: '15px', fontWeight: '500', color: '#e0e0e0' }}
                    >
                      Last Name
                      <input
                        name="userLastname"
                        type="text"
                        placeholder="Enter your last name"
                        required
                        value={registerData.userLastname}
                        onChange={handleRegisterChange}
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid #e50914';
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid transparent';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      />
                    </motion.label>

                    <motion.label 
                      variants={itemVariants}
                      style={{ marginBottom: '15px', fontWeight: '500', color: '#e0e0e0' }}
                    >
                      Country
                      <select
                        name="countryId"
                        value={registerData.countryId}
                        onChange={handleRegisterChange}
                        required
                        style={{
                          ...inputStyle,
                          appearance: 'none',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid #e50914';
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid transparent';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        <option value="" disabled hidden style={{ color: '#333' }}>Choose Country</option>
                        <option value="BD" style={{ color: '#333' }}>Bangladesh</option>
                        <option value="USA" style={{ color: '#333' }}>United States</option>
                        <option value="GB" style={{ color: '#333' }}>United Kingdom</option>
                        <option value="IND" style={{ color: '#333' }}>India</option>
                        <option value="CA" style={{ color: '#333' }}>Canada</option>
                      </select>
                    </motion.label>

                    <motion.label 
                      variants={itemVariants}
                      style={{ marginBottom: '15px', fontWeight: '500', color: '#e0e0e0' }}
                    >
                      Birthdate
                      <input
                        name="birthdate"
                        type="date"
                        value={registerData.birthdate}
                        max={getTodayDate()}
                        onChange={handleRegisterChange}
                        required
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid #e50914';
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid transparent';
                          e.target.style.boxShadow = 'none';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      />
                    </motion.label>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      disabled={isLoading}
                      style={{
                        ...submitBtnStyle,
                        background: isLoading? 'linear-gradient(45deg, #666, #888)' 
                        : 'linear-gradient(45deg, #e50914, #ff1744)',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid transparent',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                          }}
                        />
                      ) : null}
                      {isLoading ? 'Registering...' : 'Register'}
                    </motion.button>

                    <motion.div 
                      variants={switchTextVariants}
                      style={switchTextStyle}
                    >
                      Already have an account?{' '}
                      <motion.span
                        onClick={() => switchMode('login')}
                        style={hoverSpanStyle}
                        whileHover={{
                          scale: 1.05,
                          textShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Login here
                      </motion.span>
                    </motion.div>
                  </motion.form>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(229, 9, 20, 0.9)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxWidth: '90%',
                wordWrap: 'break-word',
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

     
      

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
              backdropFilter: 'blur(5px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ 
                type: 'spring',
                stiffness: 120,
                damping: 15,
                duration: 0.4
              }}
              style={{
                backgroundColor: '#fff',
                padding: '40px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                maxWidth: '350px',
                width: '90%',
                border: '2px solid rgba(229, 9, 20, 0.1)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{
                  fontSize: '48px',
                  marginBottom: '20px',
                }}
              >
                🎉
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ 
                  marginBottom: '15px', 
                  color: '#333',
                  fontSize: '24px',
                  fontWeight: '700'
                }}
              >
                Registration Successful!
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ 
                  marginBottom: '25px', 
                  color: '#666',
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}
              >
                Welcome to RnbDom! You can now login to access your account.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 6px 20px rgba(229, 9, 20, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseModal}
                style={{
                  padding: '12px 30px',
                  background: 'linear-gradient(45deg, #e50914, #ff1744)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                Continue to Login
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Auth;