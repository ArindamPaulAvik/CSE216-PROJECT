import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiMapPin,
  FiInfo,
  FiGlobe
} from 'react-icons/fi';
import axios from 'axios';

function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'https://cse216-project.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    const adminType = localStorage.getItem('admin_type');
    
    if (!token || userType !== 'admin' || adminType !== 'Support') {
      alert('Access denied. Please login as a support admin.');
      navigate('/');
      return;
    }

    fetchUserDetails();
  }, [navigate, id]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user-management/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error.response?.status === 404) {
        alert('User not found');
        navigate('/users-management');
      } else {
        alert('Failed to fetch user details');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
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
        Loading user details...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        User not found
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
          onClick={() => navigate('/users-management')}
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
            <FiUser style={{ marginRight: '15px', verticalAlign: 'middle' }} />
            User Details
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
            Detailed information for {user.USER_FIRSTNAME} {user.USER_LASTNAME}
          </p>
        </div>
      </motion.div>

      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden',
          marginBottom: '30px'
        }}
      >
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '2.5rem'
          }}>
            <FiUser />
          </div>
          <h2 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            {user.USER_FIRSTNAME} {user.USER_LASTNAME}
          </h2>
          <p style={{
            margin: 0,
            opacity: 0.9,
            fontSize: '1.1rem'
          }}>
            User ID: {user.USER_ID}
          </p>
        </div>

        {/* Details Grid */}
        <div style={{
          padding: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {/* Personal Information */}
          <div>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              color: '#74b9ff'
            }}>
              <FiInfo style={{ marginRight: '10px' }} />
              Personal Information
            </h3>
            
            <div style={{ space: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  opacity: 0.8
                }}>
                  <FiUser size={16} style={{ marginRight: '8px' }} />
                  <strong>Full Name</strong>
                </div>
                <div style={{ paddingLeft: '24px', fontSize: '1.1rem' }}>
                  {user.USER_FIRSTNAME} {user.USER_LASTNAME}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  opacity: 0.8
                }}>
                  <FiCalendar size={16} style={{ marginRight: '8px' }} />
                  <strong>Birth Date</strong>
                </div>
                <div style={{ paddingLeft: '24px', fontSize: '1.1rem' }}>
                  {formatDate(user.BIRTH_DATE)}
                  {user.BIRTH_DATE && (
                    <span style={{ opacity: 0.7, marginLeft: '10px' }}>
                      (Age: {calculateAge(user.BIRTH_DATE)})
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  opacity: 0.8
                }}>
                  <FiMapPin size={16} style={{ marginRight: '8px' }} />
                  <strong>Country</strong>
                </div>
                <div style={{ paddingLeft: '24px', fontSize: '1.1rem' }}>
                  <FiGlobe size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  {user.COUNTRY_NAME} ({user.COUNTRY_ID})
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              color: '#00b894'
            }}>
              <FiMail style={{ marginRight: '10px' }} />
              Contact Information
            </h3>

            <div style={{ space: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  opacity: 0.8
                }}>
                  <FiMail size={16} style={{ marginRight: '8px' }} />
                  <strong>Email Address</strong>
                </div>
                <div style={{ 
                  paddingLeft: '24px', 
                  fontSize: '1.1rem',
                  wordBreak: 'break-word'
                }}>
                  {user.EMAIL}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  opacity: 0.8
                }}>
                  <FiPhone size={16} style={{ marginRight: '8px' }} />
                  <strong>Phone Number</strong>
                </div>
                <div style={{ paddingLeft: '24px', fontSize: '1.1rem' }}>
                  {user.PHONE_NO || (
                    <span style={{ opacity: 0.6, fontStyle: 'italic' }}>
                      Not provided
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '30px',
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            color: '#e17055'
          }}>
            <FiInfo style={{ marginRight: '10px' }} />
            Account Information
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <div style={{ opacity: 0.8, marginBottom: '5px' }}>
                <strong>User ID</strong>
              </div>
              <div style={{ fontSize: '1.1rem' }}>{user.USER_ID}</div>
            </div>

            <div>
              <div style={{ opacity: 0.8, marginBottom: '5px' }}>
                <strong>Person ID</strong>
              </div>
              <div style={{ fontSize: '1.1rem' }}>{user.PERSON_ID}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default UserDetails;
