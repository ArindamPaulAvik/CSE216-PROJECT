import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiFilm, FiEdit3, FiUsers, FiAward } from 'react-icons/fi';
import axios from 'axios';

function ContentAdminFrontpage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    const adminType = localStorage.getItem('admin_type');
    
    if (!token || userType !== 'admin' || adminType !== 'Content') {
      alert('Access denied. Please login as a content admin.');
      navigate('/');
      return;
    }

    // Fetch admin data
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      // You can implement this API later
      setAdminData({
        name: 'Content Admin',
        email: 'content@rnbdom.com',
        adminType: 'CONTENT'
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');
    localStorage.removeItem('admin_type');
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/admin-profile');
  };

  if (!adminData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Content Admin Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Content & Media Management</p>
        </div>
        
        <div style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <FiUser size={20} />
          </motion.button>

          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                top: '60px',
                right: '0',
                background: 'rgba(0, 0, 0, 0.9)',
                borderRadius: '10px',
                padding: '15px',
                minWidth: '200px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
                <p style={{ margin: 0, fontWeight: '600' }}>{adminData.name}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.7 }}>{adminData.email}</p>
                <span style={{ 
                  background: 'rgba(102, 126, 234, 0.3)', 
                  color: '#667eea', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  fontSize: '12px',
                  marginTop: '5px',
                  display: 'inline-block'
                }}>
                  Content Admin
                </span>
              </div>
              
              <button
                onClick={handleProfile}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  padding: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px'
                }}
              >
                <FiSettings size={16} />
                Profile Settings
              </button>
              
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#ff4757',
                  padding: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={{ padding: '40px' }}>
        {/* Enhanced Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '30px'
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            border: '3px solid rgba(255, 255, 255, 0.2)'
          }}>
            CA
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.8rem', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome back, {adminData.name}!
            </h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.8, fontSize: '1.1rem' }}>
              Content Administrator | {adminData.email}
            </p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ 
                background: 'rgba(102, 126, 234, 0.3)', 
                color: '#667eea', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(102, 126, 234, 0.5)'
              }}>
                Content Administrator
              </span>
              <span style={{ 
                background: 'rgba(76, 175, 80, 0.3)', 
                color: '#4caf50', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(76, 175, 80, 0.5)'
              }}>
                ● Active
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProfile}
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiSettings size={18} />
            Manage Profile
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}
        >
          {/* Shows Management Card */}
          <motion.div
            whileHover={{ scale: 1.02, rotateY: 2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <div style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: '12px',
                padding: '12px',
                marginRight: '15px'
              }}>
                <FiFilm size={24} style={{ color: 'white' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Shows Management</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              Manage TV shows, movies, and episodes. Review content submissions and update show information.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <span style={{ background: 'rgba(102, 126, 234, 0.2)', color: '#667eea', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                245 Shows
              </span>
              <span style={{ background: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                12 Pending
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                position: 'relative',
                zIndex: 2,
                width: '100%'
              }}
            >
              Manage Shows
            </motion.button>
          </motion.div>

          {/* Content Moderation Card */}
          <motion.div
            whileHover={{ scale: 1.02, rotateY: 2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <div style={{
                background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                borderRadius: '12px',
                padding: '12px',
                marginRight: '15px'
              }}>
                <FiEdit3 size={24} style={{ color: 'white' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Content Moderation</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              Review and moderate user-generated content including comments, reviews, and reports.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <span style={{ background: 'rgba(240, 147, 251, 0.2)', color: '#f093fb', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                89 Reviews
              </span>
              <span style={{ background: 'rgba(255, 87, 87, 0.2)', color: '#ff5757', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                7 Reports
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                position: 'relative',
                zIndex: 2,
                width: '100%'
              }}
            >
              Moderate Content
            </motion.button>
          </motion.div>

          {/* Cast & Crew Card */}
          <motion.div
            whileHover={{ scale: 1.02, rotateY: 2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <div style={{
                background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                borderRadius: '12px',
                padding: '12px',
                marginRight: '15px'
              }}>
                <FiUsers size={24} style={{ color: 'white' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Cast & Crew</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              Manage actors, directors, and crew information. Update biographies and filmographies.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <span style={{ background: 'rgba(79, 172, 254, 0.2)', color: '#4facfe', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                567 Members
              </span>
              <span style={{ background: 'rgba(0, 242, 254, 0.2)', color: '#00f2fe', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                23 New
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/actors')}
              style={{
                background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                position: 'relative',
                zIndex: 2,
                width: '100%'
              }}
            >
              Manage Cast
            </motion.button>
          </motion.div>

          {/* Awards Management Card */}
          <motion.div
            whileHover={{ scale: 1.02, rotateY: 2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 179, 71, 0.1) 100%)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <div style={{
                background: 'linear-gradient(45deg, #ffd700, #ffb347)',
                borderRadius: '12px',
                padding: '12px',
                marginRight: '15px'
              }}>
                <FiAward size={24} style={{ color: 'white' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Awards</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              Manage awards and recognitions. Add new awards and assign them to shows, actors, and directors.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <span style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#ffd700', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                43 Awards
              </span>
              <span style={{ background: 'rgba(255, 179, 71, 0.2)', color: '#ffb347', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                156 Winners
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/awards')}
              style={{
                background: 'linear-gradient(45deg, #ffd700, #ffb347)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                position: 'relative',
                zIndex: 2,
                width: '100%'
              }}
            >
              Manage Awards
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Content Overview</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>245</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Shows</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#f093fb' }}>89</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Pending Reviews</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#4facfe' }}>567</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Cast Members</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ffd700' }}>43</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Awards Listed</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ContentAdminFrontpage;
