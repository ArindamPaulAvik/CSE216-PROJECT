import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiMessageSquare, FiUsers, FiHelpCircle, FiFlag } from 'react-icons/fi';
import axios from 'axios';

function SupportAdminFrontpage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    openRequests: 0,
    totalUsers: 0,
    faqArticles: 0,
    pendingReports: 0
  });
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

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
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch customer care stats
      const customerCareResponse = await axios.get(`${BASE_URL}/customer-care/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch FAQ count
      const faqResponse = await axios.get(`${BASE_URL}/faqs`);
      
      // Fetch user count
      const userResponse = await axios.get(`${BASE_URL}/user-management/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch reports count
        const reportsResponse = await axios.get(`${BASE_URL}/reports/undealt`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        openRequests: customerCareResponse.data.open || 0,
        totalUsers: userResponse.data.totalUsers || 0,
        faqArticles: faqResponse.data.faqs?.length || 0,
        pendingReports: reportsResponse.data.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values if fetch fails
    } finally {
      setLoading(false);
    }
  };

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
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          style={{
            background: 'rgba(255, 71, 87, 0.2)',
            border: '1px solid rgba(255, 71, 87, 0.3)',
            borderRadius: '10px',
            padding: '12px 20px',
            color: '#ff4757',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}
        >
          <FiLogOut size={16} />
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
          {/* View Requests Card */}
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
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>View Requests</h3>
            </div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              View and respond to user customer care requests
            </p>
            <button 
              onClick={() => navigate('/customer-care-requests')}
              style={{
              background: 'linear-gradient(45deg, #11998e, #2d1b69)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              View Requests
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
            <button 
              onClick={() => navigate('/users-management')}
              style={{
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
            <button 
              onClick={() => navigate('/faq-management')}
              style={{
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
            <button
              onClick={() => navigate('/reports-management')}
              style={{
                background: 'linear-gradient(45deg, #e17055, #fd79a8)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
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
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#11998e' }}>
                {loading ? '...' : stats.openRequests}
              </p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Open Requests</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#6c5ce7' }}>
                {loading ? '...' : stats.totalUsers}
              </p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Users</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#00b894' }}>
                {loading ? '...' : stats.faqArticles}
              </p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>FAQ Articles</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#e17055' }}>
                {loading ? '...' : stats.pendingReports}
              </p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Pending Reports</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default SupportAdminFrontpage;
