import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// HARDCODED - NO ENVIRONMENT VARIABLES
const PRODUCTION_API_URL = 'https://cse216-project.onrender.com';

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

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
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

  // Mouse and background offset for floating background
  const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Animate background offset to follow mouse
    let animationFrame;
    function animate() {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Calculate offset based on mouse position relative to center, max ±15px
      const offsetX = ((mousePosition.x - centerX) / centerX) * 15;
      const offsetY = ((mousePosition.y - centerY) / centerY) * 15;
      setBgOffset(prev => ({
        x: prev.x + (offsetX - prev.x) * 0.05, // Smoother (was 0.1)
        y: prev.y + (offsetY - prev.y) * 0.05
      }));
      animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition]);

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
    console.log('API URL being used:', PRODUCTION_API_URL); // Debug log
    console.log('Login attempt at:', new Date().toISOString()); // Force rebuild
    try {
      const res = await axios.post(`${PRODUCTION_API_URL}/login`, loginData);
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_id', res.data.userId || res.data.adminId || res.data.publisherId);
        localStorage.setItem('user_type', res.data.userType);
        if (res.data.adminType) {
          localStorage.setItem('admin_type', res.data.adminType);
        }
        if (res.data.publisherId) {
          localStorage.setItem('publisher_id', res.data.publisherId);
        }
        // Navigate based on user type
        navigate(res.data.redirectTo || '/frontpage');
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
      const response = await axios.post(`${PRODUCTION_API_URL}/register`, registerData);
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
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      {/* Enhanced background image with mouse following */}
      <div
  style={{
    position: 'absolute',
    top: '-10%',    // Start above the viewport
    left: '-10%',   // Start left of the viewport
    right: '-10%',  // Extend right of the viewport
    bottom: '-10%', // Extend below the viewport
    zIndex: 0,
    backgroundImage: `url(${BASE_URL}/images/authpage.png)`,
    filter: 'blur(1.5px)',
    transform: `translate(${bgOffset.x}px, ${bgOffset.y}px)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    willChange: 'transform',
  }}
/>
      {/* Strong shadowy gradient on all sides */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      {/* Semi-transparent overlay for extra darkening */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.18)',
          zIndex: 2,
        }}
      />

      {/* Picture/Sidebar container with glossy black background */}
      {/* Centered Auth Form Container */}
<div
  style={{
    position: 'relative',
    width: '100%',
    minHeight: 'calc(100vh - 240px)', // smaller height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '40px',   // reduced from 60px
    paddingBottom: '40px',
    zIndex: 4,
  }}
>
  <div
    style={{
      width: '100%',
      maxWidth: '450px',
      minHeight: '450px',
      background: 'rgba(10, 10, 20, 0.92)',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.15)',
      backdropFilter: 'blur(12px) saturate(1.5)',
      WebkitBackdropFilter: 'blur(12px) saturate(1.5)',
      backgroundImage: 'linear-gradient(135deg, rgba(40,40,60,0.7) 0%, rgba(0,0,0,0.9) 100%)',
      padding: '25px',
      position: 'relative',
      perspective: '1000px',
    }}
  >
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
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        {mode === 'login' ? (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    style={{ width: '100%', height: '100%' }}
  >
    <motion.form
      onSubmit={handleLoginSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      <motion.h2
        variants={itemVariants}
        style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '20px',
        }}
      >
        Log In
      </motion.h2>

      <motion.label
        variants={itemVariants}
        style={{ marginBottom: '15px', fontWeight: '500', color: '#e0e0e0' }}
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
        style={{ marginBottom: '15px', fontWeight: '500', color: '#e0e0e0' }}
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
          width: '50%',
          marginLeft: 'auto',     // center horizontally
          marginRight: 'auto', 
          background: isLoading
            ? 'linear-gradient(45deg, #666, #888)'
            : 'linear-gradient(45deg, #e50914, #ff1744)',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginTop: '25px',
          marginBottom: '5px',
        }}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '8px',
              marginTop: '-5px', // Adjusted for better alignment
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%', height: '100%' }}
          >
            <motion.form
              onSubmit={handleRegisterSubmit}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px 20px',
              }}
            >
              {/* Headline - span both columns */}
              <motion.h2
                variants={itemVariants}
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '10px',
                }}
              >
                Register
              </motion.h2>

              {/* Email */}
              <motion.label
                variants={itemVariants}
                style={{ fontWeight: '500', color: '#e0e0e0' }}
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

              {/* Password */}
              <motion.label
                variants={itemVariants}
                style={{ fontWeight: '500', color: '#e0e0e0' }}
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

              {/* First Name */}
              <motion.label
                variants={itemVariants}
                style={{ fontWeight: '500', color: '#e0e0e0' }}
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

              {/* Last Name */}
              <motion.label
                variants={itemVariants}
                style={{ fontWeight: '500', color: '#e0e0e0' }}
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

              {/* Country */}
              <motion.label
                variants={itemVariants}
                style={{ fontWeight: '500', color: '#e0e0e0' }}
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
                  <option  value="AUS" style={{ backgroundColor: '#222', color: '#fff' }}>Australia</option>
                  <option value="BD" style={{ backgroundColor: '#222', color: '#fff' }}>Bangladesh</option>
                  <option value="BRA" style={{ backgroundColor: '#222', color: '#fff' }}>Brazil</option>
                  <option value="CAN" style={{ backgroundColor: '#222', color: '#fff' }}>Canada</option>
                  <option value="FRA" style={{ backgroundColor: '#222', color: '#fff' }}>France</option>
                  <option value="GER" style={{ backgroundColor: '#222', color: '#fff' }}>Germany</option>
                  <option value="IND" style={{ backgroundColor: '#222', color: '#fff' }}>India</option>
                  <option value="JPN" style={{ backgroundColor: '#222', color: '#fff' }}>Japan</option>
                  <option value="KOR" style={{ backgroundColor: '#222', color: '#fff' }}>South Korea</option>
                  <option value="UK" style={{ backgroundColor: '#222', color: '#fff' }}>United Kingdom</option>
                  <option value="USA" style={{ backgroundColor: '#222', color: '#fff' }}>United States</option>
                </select>
              </motion.label>

              {/* Birthdate */}
              <motion.label
                variants={itemVariants}
                style={{ fontWeight: '500', color: '#e0e0e0' }}
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

              {/* Submit Button - span both columns */}
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={isLoading}
                style={{
                  gridColumn: '1 / -1',
                  ...submitBtnStyle,
                  width: '50%',
                  marginLeft: 'auto',     // center horizontally
                  marginRight: 'auto', 
                  marginTop: '25px',
                  marginBottom: '5px',
                  background: isLoading
                    ? 'linear-gradient(45deg, #666, #888)'
                    : 'linear-gradient(45deg, #e50914, #ff1744)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: '8px',
                      marginTop: '-5px', 
                    }}
                  />
                ) : null}
                {isLoading ? 'Registering...' : 'Register'}
              </motion.button>

              {/* Switch Text - span both columns */}
              <motion.div
                variants={switchTextVariants}
                style={{ ...switchTextStyle, gridColumn: '1 / -1' }}
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
