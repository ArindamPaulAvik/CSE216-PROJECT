import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiSearch, 
  FiArrowLeft, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiMapPin,
  FiUser
} from 'react-icons/fi';
import axios from 'axios';

function UsersManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    const adminType = localStorage.getItem('admin_type');
    
    if (!token || userType !== 'admin' || adminType !== 'Support') {
      alert('Access denied. Please login as a support admin.');
      navigate('/');
      return;
    }

    fetchUsers();
    fetchStats();
  }, [navigate]);

  useEffect(() => {
    // Filter users based on search term
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.USER_FIRSTNAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.USER_LASTNAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.EMAIL.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.USER_FIRSTNAME} ${user.USER_LASTNAME}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/user-management', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/user-management/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user-details/${userId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        Loading users...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
      color: 'white',
      padding: '20px'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/support-admin-frontpage')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '12px',
            marginRight: '20px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <FiArrowLeft size={20} />
        </motion.button>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '700' }}>
            <FiUsers style={{ marginRight: '15px', verticalAlign: 'middle' }} />
            User Management
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
            Manage and view user accounts
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}
      >
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <FiUsers size={24} style={{ color: '#6c5ce7', marginBottom: '10px' }} />
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
            {stats.totalUsers || 0}
          </p>
          <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Users</p>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <FiMapPin size={24} style={{ color: '#00b894', marginBottom: '10px' }} />
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
            {stats.countries || 0}
          </p>
          <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Countries</p>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <FiUser size={24} style={{ color: '#e17055', marginBottom: '10px' }} />
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
            {filteredUsers.length}
          </p>
          <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Filtered Results</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div style={{ position: 'relative' }}>
          <FiSearch 
            size={20} 
            style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.6)'
            }}
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 15px 15px 50px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
            Users ({filteredUsers.length})
          </h3>
        </div>
        
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredUsers.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              opacity: 0.7
            }}>
              {searchTerm ? 'No users found matching your search.' : 'No users found.'}
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <motion.div
                key={user.USER_ID}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onClick={() => handleUserClick(user.USER_ID)}
                style={{
                  padding: '20px',
                  borderBottom: index < filteredUsers.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 200px 200px 150px',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <div>
                    <h4 style={{ 
                      margin: '0 0 5px 0', 
                      fontSize: '1.1rem',
                      color: '#74b9ff'
                    }}>
                      {user.USER_FIRSTNAME} {user.USER_LASTNAME}
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      opacity: 0.8,
                      fontSize: '0.9rem'
                    }}>
                      <FiMail size={14} style={{ marginRight: '8px' }} />
                      {user.EMAIL}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      opacity: 0.8,
                      fontSize: '0.9rem'
                    }}>
                      <FiPhone size={14} style={{ marginRight: '8px' }} />
                      {user.PHONE_NO || 'Not provided'}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      opacity: 0.8,
                      fontSize: '0.9rem'
                    }}>
                      <FiMapPin size={14} style={{ marginRight: '8px' }} />
                      {user.COUNTRY_NAME}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      opacity: 0.8,
                      fontSize: '0.9rem'
                    }}>
                      <FiCalendar size={14} style={{ marginRight: '8px' }} />
                      {formatDate(user.BIRTH_DATE)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default UsersManagement;
