import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiAlertTriangle, 
  FiUser, 
  FiMessageSquare,
  FiClock,
  FiCheck,
  FiX,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import axios from 'axios';

function ReportsManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [violations, setViolations] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success'); // 'success' or 'error'
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    const adminType = localStorage.getItem('admin_type');
    
    if (!token || userType !== 'admin' || adminType !== 'Support') {
      showModalMessage('Access denied. Please login as a support admin.', 'error');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    fetchReports();
    fetchViolations();
    fetchStats();
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/reports/undealt', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      showModalMessage('Failed to fetch reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchViolations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/reports/violations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setViolations(response.data);
    } catch (error) {
      console.error('Error fetching violations:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/reports/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const showModalMessage = (message, type = 'success') => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const showConfirmDialog = (message, action) => {
    setModalMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleDeleteComment = async (reportId, commentId) => {
    showConfirmDialog(
      'Are you sure you want to delete this reported comment?',
      async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/reports/comment/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          showModalMessage('Comment deleted successfully!');
          fetchReports();
          fetchStats();
        } catch (error) {
          console.error('Error deleting comment:', error);
          showModalMessage('Failed to delete comment', 'error');
        }
      }
    );
  };

  const handleDismissReport = async (reportId) => {
    showConfirmDialog(
      'Are you sure you want to dismiss this report? This will remove it from the database.',
      async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:5000/reports/${reportId}/dismiss`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          showModalMessage('Report dismissed successfully!');
          fetchReports();
          fetchStats();
        } catch (error) {
          console.error('Error dismissing report:', error);
          showModalMessage('Failed to dismiss report', 'error');
        }
      }
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return '#dc3545';
      case 'ASSIGNED': return '#ffc107';
      case 'RESOLVED': return '#28a745';
      default: return '#6c757d';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.REPORTER_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.REASON?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.COMMENT_TEXT?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.VIOLATIONS?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || report.STATUS === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
        Loading reports management...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          onClick={() => navigate('/content-admin-frontpage')}
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
            <FiAlertTriangle style={{ marginRight: '15px', verticalAlign: 'middle' }} />
            Reports Management
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
            Manage user reports and content violations
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { fetchReports(); fetchViolations(); fetchStats(); }}
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

      {/* Filters */}
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
      placeholder="Search reports..."
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
      minWidth: '9rem', // Minimum width to prevent shrinking
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
      value="ASSIGNED" 
      style={{ 
        backgroundColor: 'rgba(30, 30, 30, 0.95)', 
        color: 'rgba(255, 255, 255, 0.9)' 
      }}
    >
      Assigned
    </option>
    <option 
      value="RESOLVED" 
      style={{ 
        backgroundColor: 'rgba(30, 30, 30, 0.95)', 
        color: 'rgba(255, 255, 255, 0.9)' 
      }}
    >
      Resolved
    </option>
  </select>
</motion.div>

      {/* Reports List */}
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
            Reports ({filteredReports.length})
          </h3>
        </div>
        
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredReports.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              opacity: 0.7
            }}>
              {searchTerm || statusFilter !== 'ALL' ? 'No reports found matching your filters.' : 'No reports to review.'}
            </div>
          ) : (
            filteredReports.map((report, index) => (
              <motion.div
                key={report.REPORT_ID}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: '20px',
                  borderBottom: index < filteredReports.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
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
                      color: '#ff6b6b'
                    }}>
                      Report #{report.REPORT_ID}
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      opacity: 0.8,
                      fontSize: '0.9rem',
                      marginBottom: '5px'
                    }}>
                      <FiUser size={14} style={{ marginRight: '8px' }} />
                      Reporter: {report.REPORTER_NAME}
                      <FiClock size={14} style={{ marginLeft: '15px', marginRight: '8px' }} />
                      {formatDate(report.CREATED_AT)}
                    </div>
                    <div style={{ 
                      opacity: 0.8,
                      fontSize: '0.9rem'
                    }}>
                      Reason: <strong>{report.REASON}</strong>
                    </div>
                    {report.VIOLATIONS && (
                      <div style={{ 
                        opacity: 0.8,
                        fontSize: '0.9rem',
                        marginTop: '5px'
                      }}>
                        Violations: <strong style={{ color: '#ff6b6b' }}>{report.VIOLATIONS}</strong>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: getStatusColor(report.STATUS),
                      color: 'white'
                    }}>
                      {report.STATUS}
                    </span>
                  </div>
                </div>

                {report.COMMENT_TEXT && (
                  <div style={{
                    marginTop: '15px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderLeft: '4px solid #ff6b6b',
                    borderRadius: '0 8px 8px 0'
                  }}>
                    <strong style={{ color: '#ff6b6b', display: 'block', marginBottom: '5px' }}>
                      Reported Comment:
                    </strong>
                    <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
                      {report.COMMENT_TEXT}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleDismissReport(report.REPORT_ID)}
                    style={{
                      background: 'linear-gradient(45deg, #6c757d, #5a6268)',
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
                    <FiX size={14} />
                    Dismiss Report
                  </button>
                  
                  {report.COMMENT_ID && (
                    <button
                      onClick={() => handleDeleteComment(report.REPORT_ID, report.COMMENT_ID)}
                      style={{
                        background: 'linear-gradient(45deg, #dc3545, #c82333)',
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
                      <FiTrash2 size={14} />
                      Delete Comment
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Success/Error Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px'
            }}>
              {modalType === 'success' ? '✅' : '❌'}
            </div>
            <h3 style={{
              margin: '0 0 20px 0',
              color: 'white',
              fontSize: '1.5rem'
            }}>
              {modalType === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p style={{
              margin: '0 0 30px 0',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.5'
            }}>
              {modalMessage}
            </p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                padding: '12px 30px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowConfirmModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '20px'
            }}>
              ⚠️
            </div>
            <h3 style={{
              margin: '0 0 20px 0',
              color: 'white',
              fontSize: '1.5rem'
            }}>
              Confirm Action
            </h3>
            <p style={{
              margin: '0 0 30px 0',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.5'
            }}>
              {modalMessage}
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 30px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  if (confirmAction) {
                    confirmAction();
                  }
                }}
                style={{
                  background: 'linear-gradient(45deg, #dc3545, #c82333)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 30px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default ReportsManagement;
