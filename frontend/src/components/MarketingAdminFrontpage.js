import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiTrendingUp, FiTarget, FiBell, FiBarChart } from 'react-icons/fi';
import axios from 'axios';

function MarketingAdminFrontpage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    const adminType = localStorage.getItem('admin_type');
    const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';
    
    if (!token || userType !== 'admin' || adminType !== 'Marketing') {
      alert('Access denied. Please login as a marketing admin.');
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
        name: 'Marketing Admin',
        email: 'marketing@rnbdom.com',
        adminType: 'MARKETING'
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
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Marketing Admin Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Campaigns & Analytics Management</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
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
          <FiLogOut size={20} />
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
          {/* Manage Publishers Card (was Campaigns) */}
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
              <FiUser size={24} style={{ marginRight: '15px', color: '#42a5f5' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Manage Publishers</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Add, edit, and manage publisher accounts and permissions
            </p>
            <button style={{
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
              onClick={() => navigate('/admin-publishers')}
            >
              Manage Publishers
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
              <FiBarChart size={24} style={{ marginRight: '15px', color: '#ffa726' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Analytics</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              View detailed marketing analytics and insights
            </p>
            <button style={{
              background: 'linear-gradient(45deg, #ffa726, #ff7043)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
              onClick={() => navigate('/admin-analytics')}
            >
              View Analytics
            </button>
          </motion.div>

          {/* Promotions Card */}
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
              <FiTrendingUp size={24} style={{ marginRight: '15px', color: '#66bb6a' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Promotions</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Manage promotional content and featured shows
            </p>
            <button
              style={{
                background: 'linear-gradient(45deg, #66bb6a, #4caf50)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              onClick={() => navigate('/admin-promotions')}
            >
              Manage Promotions
            </button>
          </motion.div>

          {/* Manage Offers Card (was Notifications) */}
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
              <FiBell size={24} style={{ marginRight: '15px', color: '#ab47bc' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Manage Offers</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Create and manage special offers and marketing deals
            </p>
            <button style={{
              background: 'linear-gradient(45deg, #ab47bc, #9c27b0)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
              onClick={() => navigate('/admin-offers')}
            >
              Manage Offers
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
          <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Marketing Overview</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ff6b6b' }}>15</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Active Campaigns</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ffa726' }}>89.3%</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Engagement Rate</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#66bb6a' }}>234</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Promoted Shows</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ab47bc' }}>1.2M</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Notifications Sent</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default MarketingAdminFrontpage;
