import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle, 
  FiExternalLink,
  FiUser,
  FiCalendar,
  FiFilter,
  FiTag,
  FiX,
  FiLink,
  FiFileText
} from 'react-icons/fi';
import axios from 'axios';

function SubmissionsManagement() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ submissionId: null, verdict: null });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    const adminType = localStorage.getItem('admin_type');
    
    console.log('Auth check - Token:', token ? 'exists' : 'missing');
    console.log('Auth check - User Type:', userType);
    console.log('Auth check - Admin Type:', adminType);
    
    if (!token) {
      alert('No authentication token found. Please login.');
      navigate('/');
      return;
    }
    
    if (userType !== 'admin') {
      alert('Access denied. Admin access required.');
      navigate('/');
      return;
    }
    
    if (adminType !== 'Content') {
      alert('Access denied. Content admin access required.');
      navigate('/');
      return;
    }

    fetchSubmissions();
  }, [navigate]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching submissions with token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('Making request to:', `${BASE_URL}/api/submissions`);
      
      const response = await axios.get(`${BASE_URL}/api/submissions`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Submissions response status:', response.status);
      console.log('Submissions response data:', response.data);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Check if backend is running.';
      } else {
        // Something else happened
        errorMessage = error.message;
      }
      
      console.error('Final error message:', errorMessage);
      alert(`Error fetching submissions: ${errorMessage}`);
      
      if (error.response?.status === 403) {
        navigate('/');
      } else if (error.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionVerdict = async (submissionId, verdict) => {
    // Show custom modal instead of browser confirm
    setConfirmAction({ submissionId, verdict });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    const { submissionId, verdict } = confirmAction;
    setShowConfirmModal(false);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/submissions/${submissionId}/verdict`,
        { verdict },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Check if the response was successful
      if (response.status === 200) {
        // Reload the page instead of just fetching submissions
        window.location.reload();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      
      // Only show error alert if there was actually an error
      let errorMessage = 'Error updating submission';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setConfirmAction({ submissionId: null, verdict: null });
  };

  const fetchSubmissionDetails = async (submissionId) => {
    try {
      setDetailsLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Fetching submission details for ID:', submissionId);
      console.log('Using token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${BASE_URL}/api/submissions/${submissionId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Submission details fetched successfully:', response.data);
      setSubmissionDetails(response.data);
      setShowDetailsModal(true);
      
    } catch (error) {
      console.error('Error fetching submission details:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Error fetching submission details';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message;
        const serverError = error.response.data?.error;
        const serverCode = error.response.data?.code;
        
        console.log('Server error details:', {
          status,
          message: serverMessage,
          error: serverError,
          code: serverCode
        });
        
        switch (status) {
          case 403:
            errorMessage = 'Access denied. Please check your permissions.';
            break;
          case 404:
            errorMessage = 'Submission not found.';
            break;
          case 500:
            if (serverCode === 'ER_NO_SUCH_TABLE') {
              errorMessage = 'Database configuration error. Please contact administrator.';
            } else if (serverCode === 'ER_BAD_FIELD_ERROR') {
              errorMessage = 'Database schema error. Please contact administrator.';
            } else if (serverMessage) {
              errorMessage = `Server error: ${serverMessage}`;
            } else {
              errorMessage = 'Internal server error occurred.';
            }
            break;
          default:
            errorMessage = serverMessage || `Server error (${status})`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      // Show user-friendly error message
      alert(errorMessage);
      
      // For debugging, also log the technical details
      console.error('Technical error details:', {
        originalError: error.message,
        serverMessage: error.response?.data?.message,
        serverCode: error.response?.data?.code,
        sqlMessage: error.response?.data?.sqlMessage,
        userFriendlyMessage: errorMessage
      });
      
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCheckSubmission = (submission) => {
    console.log('Checking submission:', submission);
    
    if (!submission || !submission.SUBMISSION_ID) {
      alert('Invalid submission data');
      return;
    }
    
    fetchSubmissionDetails(submission.SUBMISSION_ID);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSubmissionDetails(null);
  };

  const filteredSubmissions = submissions.filter(submission => {
    return submission.VERDICT === activeTab;
  });

  const getTabStats = (verdict) => {
    return submissions.filter(sub => sub.VERDICT === verdict).length;
  };

  const getStatusColor = (verdict) => {
    switch (verdict) {
      case 'APPROVED': return '#2ed573';
      case 'PENDING': return '#ffc107';
      case 'REJECTED': return '#e74c3c';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (verdict) => {
    switch (verdict) {
      case 'APPROVED': return <FiCheckCircle />;
      case 'PENDING': return <FiClock />;
      case 'REJECTED': return <FiXCircle />;
      default: return <FiClock />;
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          Loading submissions...
        </div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/content-admin-frontpage')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FiArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>Submissions Management</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>Review and manage content submissions</p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main style={{ padding: '40px' }}>
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '15px 20px',
                background: activeTab === tab 
                  ? `linear-gradient(45deg, ${getStatusColor(tab)}, ${getStatusColor(tab)}dd)`
                  : 'transparent',
                border: activeTab === tab 
                  ? `1px solid ${getStatusColor(tab)}`
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontWeight: activeTab === tab ? '600' : '400',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              {getStatusIcon(tab)}
              {tab}
              <span style={{
                background: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {getTabStats(tab)}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Submissions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredSubmissions.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <FiFilter size={48} style={{ opacity: 0.5, marginBottom: '20px' }} />
              <h3 style={{ margin: '0 0 10px 0', opacity: 0.8 }}>No submissions found</h3>
              <p style={{ margin: 0, opacity: 0.6 }}>
                {`No ${activeTab.toLowerCase()} submissions available`}
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <motion.div
                key={submission.SUBMISSION_ID}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => setSelectedSubmission(submission)}
              >
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: getStatusColor(submission.VERDICT),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {getStatusIcon(submission.VERDICT)}
                  {submission.VERDICT}
                </div>

                <div style={{ marginTop: '10px' }}>
                  <h3 style={{ 
                    margin: '0 0 15px 0', 
                    fontSize: '1.2rem',
                    paddingRight: '100px' // Space for status badge
                  }}>
                    Submission #{submission.SUBMISSION_ID}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiUser size={16} style={{ opacity: 0.7 }} />
                      <span style={{ fontSize: '14px', opacity: 0.8 }}>Publisher:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {submission.PUBLISHER_NAME || `Publisher #${submission.PUBLISHER_ID}`}
                      </span>
                    </div>

                    {submission.CREATED_AT && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiCalendar size={16} style={{ opacity: 0.7 }} />
                        <span style={{ fontSize: '14px', opacity: 0.8 }}>Submitted:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {new Date(submission.CREATED_AT).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {submission.TYPE && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiTag size={16} style={{ opacity: 0.7 }} />
                        <span style={{ fontSize: '14px', opacity: 0.8 }}>Type:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {submission.TYPE}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons for pending submissions */}
                  {submission.VERDICT === 'PENDING' && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      marginTop: '20px',
                      paddingTop: '20px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSubmissionVerdict(submission.SUBMISSION_ID, 'APPROVED');
                        }}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(45deg, #2ed573, #00b894)',
                          border: 'none',
                          color: 'white',
                          padding: '10px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiCheckCircle size={16} />
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckSubmission(submission);
                        }}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(45deg, #4f8cff, #1e3a8a)',
                          border: 'none',
                          color: 'white',
                          padding: '10px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiExternalLink size={16} />
                        CHECK
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSubmissionVerdict(submission.SUBMISSION_ID, 'REJECTED');
                        }}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
                          border: 'none',
                          color: 'white',
                          padding: '10px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiXCircle size={16} />
                        Reject
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: '40px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Submissions Overview</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ffc107' }}>
                {getTabStats('PENDING')}
              </p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Pending Review</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#2ed573' }}>
                {getTabStats('APPROVED')}
              </p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Approved</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#e74c3c' }}>
                {getTabStats('REJECTED')}
              </p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Rejected</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#667eea' }}>
                {submissions.length}
              </p>
              <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Total Submissions</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* CSS for spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'rgba(20, 20, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center'
            }}
          >
            <h2 style={{ 
              margin: '0 0 20px 0', 
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Confirm Action
            </h2>
            <p style={{ 
              margin: '0 0 30px 0', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              {confirmAction.verdict === 'APPROVED' 
                ? 'Are you sure you want to approve this submission?' 
                : 'Are you sure you want to reject this submission?'}
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={handleCancelAction}
                style={{
                  padding: '12px 30px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                style={{
                  padding: '12px 30px',
                  background: confirmAction.verdict === 'APPROVED' ? '#2ed573' : '#e74c3c',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                }}
              >
                {confirmAction.verdict === 'APPROVED' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Submission Details Modal */}
      {showDetailsModal && submissionDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'rgba(20, 20, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '900px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '20px'
            }}>
              <h2 style={{ 
                margin: 0, 
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '600'
              }}>
                Submission Details
              </h2>
              <button
                onClick={closeDetailsModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                }}
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Submission ID and Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>
                    Submission #{submissionDetails.SUBMISSION_ID}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      background: getStatusColor(submissionDetails.VERDICT),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {getStatusIcon(submissionDetails.VERDICT)}
                      {submissionDetails.VERDICT}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div style={{
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#4f8cff' }}>
                  <FiFileText size={16} style={{ marginRight: '8px' }} />
                  Basic Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {submissionDetails.TYPE && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiTag size={16} style={{ opacity: 0.7 }} />
                      <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Type:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {submissionDetails.TYPE}
                      </span>
    </div>
                  )}
                  
                  {submissionDetails.CATEGORY && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiFileText size={16} style={{ opacity: 0.7 }} />
                      <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Category:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {submissionDetails.CATEGORY}
                      </span>
                    </div>
                  )}

                  {submissionDetails.SHOW_ID && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiFileText size={16} style={{ opacity: 0.7 }} />
                      <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Show ID:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {submissionDetails.SHOW_ID}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Details - Different based on TYPE */}
              {submissionDetails.TYPE === 'SHOWS' && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#4f8cff' }}>
                    <FiFileText size={16} style={{ marginRight: '8px' }} />
                    Show Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {submissionDetails.TITLE && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <FiFileText size={16} style={{ opacity: 0.7, marginTop: '2px' }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Title:</span>
                          <p style={{ fontSize: '14px', fontWeight: '500', margin: '5px 0 0 0', lineHeight: '1.4' }}>
                            {submissionDetails.TITLE}
                          </p>
                        </div>
                      </div>
                    )}

                    {submissionDetails.DESCRIPTION && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <FiFileText size={16} style={{ opacity: 0.7, marginTop: '2px' }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Description:</span>
                          <p style={{ fontSize: '14px', fontWeight: '500', margin: '5px 0 0 0', lineHeight: '1.4' }}>
                            {submissionDetails.DESCRIPTION}
                          </p>
                        </div>
                      </div>
                    )}

                    {submissionDetails.TEASER && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <FiFileText size={16} style={{ opacity: 0.7, marginTop: '2px' }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Teaser:</span>
                          <p style={{ fontSize: '14px', fontWeight: '500', margin: '5px 0 0 0', lineHeight: '1.4' }}>
                            {submissionDetails.TEASER}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {submissionDetails.TYPE === 'EPISODES' && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#4f8cff' }}>
                    <FiFileText size={16} style={{ marginRight: '8px' }} />
                    Episode Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {submissionDetails.TITLE && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <FiFileText size={16} style={{ opacity: 0.7, marginTop: '2px' }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Episode Title:</span>
                          <p style={{ fontSize: '14px', fontWeight: '500', margin: '5px 0 0 0', lineHeight: '1.4' }}>
                            {submissionDetails.TITLE}
                          </p>
                        </div>
                      </div>
                    )}

                    {submissionDetails.DESCRIPTION && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <FiFileText size={16} style={{ opacity: 0.7, marginTop: '2px' }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Description:</span>
                          <p style={{ fontSize: '14px', fontWeight: '500', margin: '5px 0 0 0', lineHeight: '1.4' }}>
                            {submissionDetails.DESCRIPTION}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Media Files - Only for SHOWS */}
              {submissionDetails.TYPE === 'SHOWS' && (submissionDetails.BANNER_IMG || submissionDetails.THUMB_IMG) && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#4f8cff' }}>
                    <FiFileText size={16} style={{ marginRight: '8px' }} />
                    Media Files
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {submissionDetails.BANNER_IMG && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiFileText size={16} style={{ opacity: 0.7 }} />
                        <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Banner Image:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {submissionDetails.BANNER_IMG}
                        </span>
                      </div>
                    )}

                    {submissionDetails.THUMB_IMG && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiFileText size={16} style={{ opacity: 0.7 }} />
                        <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Thumbnail Image:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {submissionDetails.THUMB_IMG}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Links */}
              {submissionDetails.LINK_TO_SHOW && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#4f8cff' }}>
                    <FiLink size={16} style={{ marginRight: '8px' }} />
                    {submissionDetails.TYPE === 'SHOWS' ? 'Movie Link' : 'Episode Link'}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiLink size={16} style={{ opacity: 0.7 }} />
                    <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>
                      {submissionDetails.TYPE === 'SHOWS' ? 'Link to movie:' : 'Episode link:'}
                    </span>
                    <a 
                      href={submissionDetails.LINK_TO_SHOW}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#4f8cff',
                        textDecoration: 'none',
                        wordBreak: 'break-all'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = 'none';
                      }}
                    >
                      {submissionDetails.LINK_TO_SHOW}
                    </a>
                  </div>
                </div>
              )}

              {/* User Information */}
              <div style={{
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#4f8cff' }}>
                  <FiUser size={16} style={{ marginRight: '8px' }} />
                  User Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiUser size={16} style={{ opacity: 0.7 }} />
                    <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Publisher:</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {submissionDetails.PUBLISHER_NAME || `Publisher #${submissionDetails.PUBLISHER_ID}`}
                    </span>
                  </div>

                  {submissionDetails.ADMIN_ID && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiUser size={16} style={{ opacity: 0.7 }} />
                      <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Admin ID:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {submissionDetails.ADMIN_ID}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div style={{
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#4f8cff' }}>
                  <FiCalendar size={16} style={{ marginRight: '8px' }} />
                  Timestamps
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {submissionDetails.CREATED_AT && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiCalendar size={16} style={{ opacity: 0.7 }} />
                      <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Created:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {new Date(submissionDetails.CREATED_AT).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {submissionDetails.UPDATED_AT && submissionDetails.UPDATED_AT !== submissionDetails.CREATED_AT && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiCalendar size={16} style={{ opacity: 0.7 }} />
                      <span style={{ fontSize: '14px', opacity: 0.8, minWidth: '100px' }}>Updated:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {new Date(submissionDetails.UPDATED_AT).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons for Pending Submissions */}
              {submissionDetails.VERDICT === 'PENDING' && (
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      updateSubmissionVerdict(submissionDetails.SUBMISSION_ID, 'APPROVED');
                      closeDetailsModal();
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(45deg, #2ed573, #00b894)',
                      border: 'none',
                      color: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <FiCheckCircle size={16} />
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      updateSubmissionVerdict(submissionDetails.SUBMISSION_ID, 'REJECTED');
                      closeDetailsModal();
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
                      border: 'none',
                      color: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <FiXCircle size={16} />
                    Reject
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default SubmissionsManagement;
