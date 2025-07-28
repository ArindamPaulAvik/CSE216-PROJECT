import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiMessageSquare,
  FiUser,
  FiMail,
  FiClock,
  FiSend,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiSearch
} from 'react-icons/fi';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function CustomerCareRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stats, setStats] = useState({});
  const [userRequests, setUserRequests] = useState([]);
  const [expandedUserRequest, setExpandedUserRequest] = useState(null);
  const [showUserRequests, setShowUserRequests] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    const adminType = localStorage.getItem('admin_type');

    if (!token || userType !== 'admin' || adminType !== 'Support') {
      alert('Access denied. Please login as a support admin.');
      navigate('/');
      return;
    }

    fetchRequests();
    fetchStats();
    fetchUserRequests();
  }, [navigate]);

  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/customer-care/user/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRequests(response.data);
    } catch (error) {
      console.error('Error fetching user requests:', error);
      // Don't show alert for user requests as it's optional
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/customer-care/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('Failed to fetch customer care requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/customer-care/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleReply = async (requestId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    setSendingReply(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/customer-care/admin/requests/${requestId}/reply`,
        { reply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Reply sent successfully!');
      setReplyText('');
      setSelectedRequest(null);
      fetchRequests();
      fetchStats();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const updateStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/customer-care/admin/requests/${requestId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return '#dc3545';
      case 'IN_PROGRESS': return '#ffc107';
      case 'REPLIED': return '#17a2b8';
      case 'CLOSED': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.USER_FIRSTNAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.USER_LASTNAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.EMAIL.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.SUBJECT.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || request.STATUS === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        Loading customer care requests...
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
            <FiMessageSquare style={{ marginRight: '15px', verticalAlign: 'middle' }} />
            Customer Care Requests
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
            Manage and respond to user support requests
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { fetchRequests(); fetchStats(); fetchUserRequests(); }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '12px',
            marginLeft: 'auto',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <FiRefreshCw size={16} />
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#17a2b8' }}>
            {stats.total || 0}
          </p>
          <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total</p>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#dc3545' }}>
            {stats.open || 0}
          </p>
          <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Open</p>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#17a2b8' }}>
            {stats.replied || 0}
          </p>
          <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Replied</p>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#28a745' }}>
            {stats.closed || 0}
          </p>
          <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Closed</p>
        </div>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}
      >
      </motion.div>

      {/* Filters - Only show for All Requests */}
      {!showUserRequests && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '1.5rem', // Use rem for scaling
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            gap: '1.5rem', // Use rem for consistent spacing
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div style={{
            position: 'relative',
            flex: '1',
            minWidth: '12.5rem', // 200px in rem
            display: 'flex',
            alignItems: 'center'
          }}>
            <FiSearch
              size={20}
              style={{
                position: 'absolute',
                left: '1rem', // Use rem
                color: 'rgba(255, 255, 255, 0.6)',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search by user, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 3rem', // Use rem
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.625rem', // 10px in rem
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.75rem', // Use rem
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.625rem', // 10px in rem
              color: 'white',
              outline: 'none',
              minWidth: '10rem', // Minimum width to prevent shrinking
              fontSize: '1rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          >
            <option
              value="ALL"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              All Status
            </option>
            <option
              value="OPEN"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              Open
            </option>
            <option
              value="IN_PROGRESS"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              In Progress
            </option>
            <option
              value="REPLIED"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              Replied
            </option>
            <option
              value="CLOSED"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              Closed
            </option>
          </select>
        </motion.div>
      )}

      {/* Requests List */}
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
            {showUserRequests ? `My Requests (${userRequests.length})` : `All Requests (${filteredRequests.length})`}
          </h3>
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {showUserRequests ? (
            // User requests view
            userRequests.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                opacity: 0.7
              }}>
                You haven't submitted any support requests yet.
              </div>
            ) : (
              userRequests.map((request, index) => (
                <motion.div
                  key={request.REQUEST_ID}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    padding: '20px',
                    borderBottom: index < userRequests.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedUserRequest(expandedUserRequest === request.REQUEST_ID ? null : request.REQUEST_ID)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: '0 0 8px 0',
                        fontSize: '1.2rem',
                        color: '#74b9ff'
                      }}>
                        {request.SUBJECT}
                      </h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.8,
                        fontSize: '0.9rem'
                      }}>
                        <FiClock size={14} style={{ marginRight: '8px' }} />
                        {formatDate(request.CREATED_AT)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: getStatusColor(request.STATUS),
                        color: 'white'
                      }}>
                        {request.STATUS.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p style={{
                    margin: '10px 0',
                    opacity: 0.9,
                    lineHeight: 1.5,
                    fontSize: '0.95rem'
                  }}>
                    {request.MESSAGE}
                  </p>

                  {/* Expandable admin reply */}
                  {expandedUserRequest === request.REQUEST_ID && request.ADMIN_REPLY && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        marginTop: '15px',
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '10px',
                        fontSize: '0.9rem',
                        opacity: 0.8
                      }}>
                        <FiUser size={14} style={{ marginRight: '8px' }} />
                        Admin Reply
                        <span style={{ marginLeft: '15px' }}>
                          <FiClock size={14} style={{ marginRight: '5px' }} />
                          {formatDate(request.REPLIED_AT)}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        opacity: 0.9,
                        lineHeight: 1.5,
                        fontSize: '0.95rem'
                      }}>
                        {request.ADMIN_REPLY}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )
          ) : (
            // All requests view (existing code)
            filteredRequests.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                opacity: 0.7
              }}>
                {searchTerm || statusFilter !== 'ALL' ? 'No requests found matching your filters.' : 'No customer care requests yet.'}
              </div>
            ) : (
              filteredRequests.map((request, index) => (
                <motion.div
                  key={request.REQUEST_ID}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    padding: '20px',
                    borderBottom: index < filteredRequests.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: '0 0 8px 0',
                        fontSize: '1.2rem',
                        color: '#74b9ff'
                      }}>
                        {request.SUBJECT}
                      </h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.8,
                        fontSize: '0.9rem',
                        marginBottom: '5px'
                      }}>
                        <FiUser size={14} style={{ marginRight: '8px' }} />
                        {request.USER_FIRSTNAME} {request.USER_LASTNAME}
                        <FiMail size={14} style={{ marginLeft: '15px', marginRight: '8px' }} />
                        {request.EMAIL}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.8,
                        fontSize: '0.9rem'
                      }}>
                        <FiClock size={14} style={{ marginRight: '8px' }} />
                        {formatDate(request.CREATED_AT)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: getStatusColor(request.STATUS),
                        color: 'white'
                      }}>
                        {request.STATUS}
                      </span>

                      <select
                        value={request.STATUS}
                        onChange={(e) => updateStatus(request.REQUEST_ID, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option
                          value="OPEN"
                          style={{
                            backgroundColor: 'rgba(30, 30, 30, 0.95)',
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}
                        >
                          Open
                        </option>
                        <option
                          value="IN_PROGRESS"
                          style={{
                            backgroundColor: 'rgba(30, 30, 30, 0.95)',
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}
                        >
                          In Progress
                        </option>
                        <option
                          value="REPLIED"
                          style={{
                            backgroundColor: 'rgba(30, 30, 30, 0.95)',
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}
                        >
                          Replied
                        </option>
                        <option
                          value="CLOSED"
                          style={{
                            backgroundColor: 'rgba(30, 30, 30, 0.95)',
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}
                        >
                          Closed
                        </option>
                      </select>
                    </div>
                  </div>

                  <p style={{
                    margin: '10px 0 15px 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.5',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '8px'
                  }}>
                    {request.MESSAGE}
                  </p>

                  {request.ADMIN_REPLY && (
                    <div style={{
                      marginTop: '15px',
                      padding: '12px',
                      background: 'rgba(23, 162, 184, 0.2)',
                      borderLeft: '4px solid #17a2b8',
                      borderRadius: '0 8px 8px 0'
                    }}>
                      <strong style={{ color: '#17a2b8', display: 'block', marginBottom: '5px' }}>
                        Your Reply:
                      </strong>
                      <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
                        {request.ADMIN_REPLY}
                      </p>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '8px' }}>
                        Replied: {formatDate(request.REPLIED_AT)}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  {selectedRequest === request.REQUEST_ID ? (
                    <div style={{
                      marginTop: '15px',
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        style={{
                          width: '100%',
                          minHeight: '100px',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                          onClick={() => handleReply(request.REQUEST_ID)}
                          disabled={sendingReply}
                          style={{
                            background: 'linear-gradient(45deg, #17a2b8, #138496)',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FiSend size={14} />
                          {sendingReply ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button
                          onClick={() => setSelectedRequest(null)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedRequest(request.REQUEST_ID)}
                      style={{
                        background: 'linear-gradient(45deg, #28a745, #20c997)',
                        border: 'none',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginTop: '10px'
                      }}
                    >
                      <FiMessageSquare size={14} />
                      Reply
                    </button>
                  )}
                </motion.div>
              ))
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default CustomerCareRequests;
