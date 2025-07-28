import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiHelpCircle, 
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiRefreshCw,
  FiSearch
} from 'react-icons/fi';
import axios from 'axios';

function FAQManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFaq, setEditingFaq] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
    const adminType = localStorage.getItem('admin_type');
    
    if (!token || userType !== 'admin' || adminType !== 'Support') {
      alert('Access denied. Please login as a support admin.');
      navigate('/');
      return;
    }

    fetchFAQs();
  }, [navigate]);

  const fetchFAQs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/faqs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaqs(response.data.faqs || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setSuccessMessage('Failed to fetch FAQs');
      setShowSuccessModal(true);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      setSuccessMessage('Please fill in both question and answer');
      setShowSuccessModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (editingFaq) {
        // Update existing FAQ
        await axios.put(`${BASE_URL}/faqs/${editingFaq.FAQ_ID}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage('FAQ updated successfully!');
      } else {
        // Create new FAQ
        await axios.post(`${BASE_URL}/faqs`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage('FAQ created successfully!');
      }
      
      setShowSuccessModal(true);
      resetForm();
      fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setSuccessMessage('Failed to save FAQ: ' + (error.response?.data?.error || error.message));
      setShowSuccessModal(true);
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.QUESTION,
      answer: faq.ANSWER
    });
    setShowAddForm(true);
  };

  const handleDelete = async (faqId) => {
    setFaqToDelete(faqId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/faqs/${faqToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage('FAQ deleted successfully!');
      setShowSuccessModal(true);
      setShowDeleteModal(false);
      setFaqToDelete(null);
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setSuccessMessage('Failed to delete FAQ');
      setShowSuccessModal(true);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFaqToDelete(null);
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '' });
    setEditingFaq(null);
    setShowAddForm(false);
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.QUESTION?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.ANSWER?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Loading FAQ management...
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
            <FiHelpCircle style={{ marginRight: '15px', verticalAlign: 'middle' }} />
            FAQ Management
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
            Manage frequently asked questions
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchFAQs}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '12px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FiRefreshCw size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            style={{
              background: 'linear-gradient(45deg, #00b894, #00a085)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <FiPlus size={16} />
            Add FAQ
          </motion.button>
        </div>
      </motion.div>

      {/* Search */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  style={{
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    padding: '1.5rem', // Use rem instead of px
    marginBottom: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }}
>
  <div style={{ 
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  }}>
    <FiSearch 
      size={20} 
      style={{
        position: 'absolute',
        left: '1rem', // Use rem instead of px
        color: 'rgba(255, 255, 255, 0.6)',
        zIndex: 1,
        pointerEvents: 'none' // Prevent icon from interfering with input
      }}
    />
    <input
      type="text"
      placeholder="Search FAQs..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        width: '100%',
        padding: '0.75rem 0.75rem 0.75rem 3rem', // Use rem units
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '0.625rem', // 10px in rem
        color: 'white',
        outline: 'none',
        boxSizing: 'border-box', // Ensures padding is included in width
        fontSize: '1rem', // Makes text scale with zoom
        fontFamily: 'inherit'
      }}
    />
  </div>
</motion.div>

      {/* FAQs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
            FAQs ({filteredFAQs.length})
          </h3>
        </div>
        
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredFAQs.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              opacity: 0.7
            }}>
              {searchTerm ? 'No FAQs found matching your search.' : 'No FAQs created yet. This feature may need backend implementation.'}
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.FAQ_ID}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: '20px',
                  borderBottom: index < filteredFAQs.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '1.2rem',
                    color: '#74b9ff',
                    flex: 1
                  }}>
                    {faq.QUESTION}
                  </h4>
                  
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => handleEdit(faq)}
                      style={{
                        background: 'linear-gradient(45deg, #0984e3, #74b9ff)',
                        border: 'none',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <FiEdit size={14} />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(faq.FAQ_ID)}
                      style={{
                        background: 'linear-gradient(45deg, #d63031, #e84393)',
                        border: 'none',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
                
                <p style={{ 
                  margin: 0, 
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '12px',
                  borderRadius: '8px'
                }}>
                  {faq.ANSWER}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
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
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', color: '#ff6b6b' }}>
              Confirm Delete
            </h3>
            <p style={{ margin: '0 0 25px 0', lineHeight: '1.5' }}>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelDelete}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  background: 'linear-gradient(45deg, #d63031, #e84393)',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success/Error Modal */}
      {showSuccessModal && (
        <div style={{
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
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '15px',
              color: successMessage.includes('Failed') || successMessage.includes('Error') ? '#ff6b6b' : '#00b894'
            }}>
              {successMessage.includes('Failed') || successMessage.includes('Error') ? '❌' : '✅'}
            </div>
            <h3 style={{ 
              margin: '0 0 15px 0', 
              fontSize: '1.3rem',
              color: successMessage.includes('Failed') || successMessage.includes('Error') ? '#ff6b6b' : '#00b894'
            }}>
              {successMessage.includes('Failed') || successMessage.includes('Error') ? 'Error' : 'Success'}
            </h3>
            <p style={{ margin: '0 0 25px 0', lineHeight: '1.5' }}>
              {successMessage}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                background: 'linear-gradient(45deg, #00b894, #00a085)',
                border: 'none',
                color: 'white',
                padding: '10px 25px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              OK
            </button>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          overflow: 'auto'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              margin: '20px'
            }}
          >
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem' }}>
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Question *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter the question..."
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Answer *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Enter the answer..."
                  rows="4"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FiX size={16} />
                  Cancel
                </button>
                
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(45deg, #00b894, #00a085)',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '600'
                  }}
                >
                  <FiSave size={16} />
                  {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default FAQManagement;
