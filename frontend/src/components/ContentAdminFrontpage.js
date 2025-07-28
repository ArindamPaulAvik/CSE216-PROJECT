import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiFilm, FiEdit3, FiUsers, FiAward } from 'react-icons/fi';
import axios from 'axios';

function ContentAdminFrontpage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalShows: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
    totalSubmissions: 0,
    totalActors: 0,
    totalDirectors: 0,
    totalAwards: 0
  });
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';

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
    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/admin/dashboard-analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

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

  const handleManageShows = () => {
    navigate('/shows-management');
  };

  const handleContentAdmin = () => {
    navigate('/content-admin-frontpage');
  };

  if (!adminData || loading) {
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
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            background: 'rgba(255, 71, 87, 0.1)',
            border: '1px solid rgba(255, 71, 87, 0.3)',
            borderRadius: '8px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#ff4757',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <FiLogOut size={18} />
          Logout
        </motion.button>
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
              color: 'white'
            }}>
              Welcome back, {adminData.name}!
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'white', fontSize: '1.1rem', opacity: 0.9 }}>
              Content Administrator | {adminData.email}
            </p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ 
                background: 'rgba(102, 126, 234, 0.3)', 
                color: 'white', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(102, 126, 234, 0.5)'
              }}>
                Content Administrator
              </span>
              <span style={{ 
                background: 'rgba(46, 213, 115, 0.3)', 
                color: '#2ed573', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                fontSize: '14px',
                fontWeight: '600',
                border: '2px solid #2ed573',
                boxShadow: '0 0 10px rgba(46, 213, 115, 0.3)'
              }}>
                ● Active
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '20px',
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', position: 'relative', zIndex: 2 }}>
              
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleManageShows}
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

          {/* Submissions Card */}
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
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <div style={{
                background: 'linear-gradient(45deg, #ff9800, #ffc107)',
                borderRadius: '12px',
                padding: '12px',
                marginRight: '15px'
              }}>
                <FiEdit3 size={24} style={{ color: 'white' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Submissions</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              Review and manage new show and episode submissions from publishers. Approve or reject content.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/submissions-management')}
              style={{
                background: 'linear-gradient(45deg, #ff9800, #ffc107)',
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
              Review Submissions
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
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/actors-management')}
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

          {/* Directors Management Card */}
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
              background: 'linear-gradient(135deg, rgba(46, 213, 115, 0.1) 0%, rgba(0, 184, 148, 0.1) 100%)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              <div style={{
                background: 'linear-gradient(45deg, #2ed573, #00b894)',
                borderRadius: '12px',
                padding: '12px',
                marginRight: '15px'
              }}>
                <FiUser size={24} style={{ color: 'white' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Directors</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px', position: 'relative', zIndex: 2 }}>
              Manage directors and their filmographies. Update director profiles, biographies, and career information.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/directors-management')}
              style={{
                background: 'linear-gradient(45deg, #2ed573, #00b894)',
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
              Manage Directors
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
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/awards-management')}
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
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#4a90e2' }}>{analytics.totalShows}</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Shows</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ff9800' }}>{analytics.pendingSubmissions}</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Pending Submissions</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#4facfe' }}>{analytics.totalActors}</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Cast Members</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#2ed573' }}>{analytics.totalDirectors}</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Directors</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ffd700' }}>{analytics.totalAwards}</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Awards Listed</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ContentAdminFrontpage;
