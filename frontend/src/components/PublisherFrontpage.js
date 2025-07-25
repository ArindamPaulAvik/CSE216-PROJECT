import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiUpload, FiBarChart, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';

function PublisherFrontpage() {
  const navigate = useNavigate();
  const [publisherData, setPublisherData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    if (!token || userType !== 'publisher') {
      alert('Access denied. Please login as a publisher.');
      navigate('/');
      return;
    }
    fetchPublisherData();
  }, [navigate]);

  const fetchPublisherData = async () => {
    try {
      const token = localStorage.getItem('token');
      setPublisherData({
        name: 'Publisher Name',
        contractId: 'PUB-12345',
        email: 'publisher@example.com'
      });
    } catch (error) {
      console.error('Error fetching publisher data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/publisher-profile');
  };

  const handleViewContract = () => {
    navigate('/publisher-contract');
  };

  const handleContractDetails = () => {
    navigate('/publisher-contract');
  };

  if (!publisherData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Publisher Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Content Management Portal</p>
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
                <p style={{ margin: 0, fontWeight: '600' }}>{publisherData.name}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.7 }}>{publisherData.email}</p>
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
          {/* Content Upload Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FiUpload size={24} style={{ marginRight: '15px', color: '#00d4ff' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Content Upload</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Upload and manage your shows, movies, and episodes
            </p>
            <button style={{
              background: 'linear-gradient(45deg, #00d4ff, #0077be)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Upload Content
            </button>
          </motion.div>

          {/* Analytics Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FiBarChart size={24} style={{ marginRight: '15px', color: '#7b68ee' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Analytics</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              View detailed analytics and performance metrics
            </p>
            <button
              onClick={() => navigate('/publisher-analytics')}
              style={{
                background: 'linear-gradient(45deg, #7b68ee, #6a5acd)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              View Analytics
            </button>
          </motion.div>

          {/* Revenue Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FiDollarSign size={24} style={{ marginRight: '15px', color: '#32cd32' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Revenue</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Track your earnings and revenue streams
            </p>
            <button style={{
              background: 'linear-gradient(45deg, #32cd32, #228b22)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              View Revenue
            </button>
          </motion.div>

          {/* Contract Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <FiTrendingUp size={24} style={{ marginRight: '15px', color: '#ff6b6b' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Contract</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              View your contract details and status
            </p>
            <button
              onClick={handleContractDetails}
              style={{
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                marginTop: '23px'
              }}
            >
              Contract details
            </button>
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
          <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Quick Overview</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#00d4ff' }}>12</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Shows</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#7b68ee' }}>1.2M</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Views</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#32cd32' }}>$12,345</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Monthly Revenue</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ff6b6b' }}>98%</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Satisfaction Rate</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default PublisherFrontpage;
