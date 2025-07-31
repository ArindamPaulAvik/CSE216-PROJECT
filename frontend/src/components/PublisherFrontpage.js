import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiUpload, FiBarChart, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';

function PublisherFrontpage() {
  const navigate = useNavigate();
  const [publisherData, setPublisherData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const BASE_URL = 'https://cse216-project.onrender.com';

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
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '10px 22px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontWeight: '600',
            fontSize: '1rem',
            gap: '10px'
          }}
        >
          <FiLogOut size={20} />
          Logout
        </motion.button>
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
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Content Management</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '22px' }}>
              Upload and manage your shows, movies, and episodes
            </p>
            <button 
              onClick={() => navigate('/manage-content')}
              style={{
                background: 'linear-gradient(45deg, #00d4ff, #0077be)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
              Manage Content
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


      </main>
    </div>
  );
}

export default PublisherFrontpage;
