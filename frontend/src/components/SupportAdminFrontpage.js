import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiMessageSquare, FiUsers, FiHelpCircle, FiFlag } from 'react-icons/fi';
import axios from 'axios';

function SupportAdminFrontpage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    const adminType = localStorage.getItem('admin_type');
    
    if (!token || userType !== 'admin' || adminType !== 'Support') {
      alert('Access denied. Please login as a support admin.');
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
        name: 'Support Admin',
        email: 'support@rnbdom.com',
        adminType: 'SUPPORT'
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
        background: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
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
      background: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
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
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Support Admin Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>User Support & Help Management</p>
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
                  background: 'rgba(17, 153, 142, 0.3)', 
                  color: '#11998e', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  fontSize: '12px',
                  marginTop: '5px',
                  display: 'inline-block'
                }}>
                  Support Admin
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
          {/* Support Tickets Card */}
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
              <FiMessageSquare size={24} style={{ marginRight: '15px', color: '#11998e' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Support Tickets</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Manage and respond to user support requests
            </p>
            <button style={{
              background: 'linear-gradient(45deg, #11998e, #2d1b69)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              View Tickets
            </button>
          </motion.div>

          {/* User Management Card */}
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
              <FiUsers size={24} style={{ marginRight: '15px', color: '#6c5ce7' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>User Management</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              View and manage user accounts and issues
            </p>
            <button style={{
              background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Manage Users
            </button>
          </motion.div>

          {/* FAQ Management Card */}
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
              <FiHelpCircle size={24} style={{ marginRight: '15px', color: '#00b894' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>FAQ Management</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Create and update frequently asked questions
            </p>
            <button style={{
              background: 'linear-gradient(45deg, #00b894, #00cec9)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Manage FAQ
            </button>
          </motion.div>

          {/* Report Management Card */}
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
              <FiFlag size={24} style={{ marginRight: '15px', color: '#e17055' }} />
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Reports</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Review user reports and content violations
            </p>
            <button style={{
              background: 'linear-gradient(45deg, #e17055, #fd79a8)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              View Reports
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
          <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Support Overview</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#11998e' }}>42</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Open Tickets</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#6c5ce7' }}>1,234</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Users</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#00b894' }}>156</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>FAQ Articles</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#e17055' }}>8</p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Pending Reports</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default SupportAdminFrontpage;
