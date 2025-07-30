import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiHelpCircle, 
  FiChevronDown,
  FiChevronRight,
  FiRefreshCw,
  FiSearch
} from 'react-icons/fi';
import axios from 'axios';

function SimpleFAQManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const BASE_URL = 'https://cse216-project.onrender.com';

  // Sample FAQs for demonstration (replace with actual API call)
  const sampleFAQs = [
    {
      id: 1,
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button on the homepage. Fill in your details including name, email, and password. You'll receive a confirmation email to verify your account."
    },
    {
      id: 2,
      question: "How can I reset my password?",
      answer: "If you've forgotten your password, click on 'Forgot Password' on the login page. Enter your email address and we'll send you a link to reset your password."
    },
    {
      id: 3,
      question: "How do I add shows to my favorites?",
      answer: "When viewing a show's details page, click on the heart icon or 'Add to Favorites' button. You can view all your favorite shows in your profile under the 'Favorites' section."
    },
    {
      id: 4,
      question: "Can I submit my own show for review?",
      answer: "Yes! Users can submit shows for review through the submission system. Navigate to the submissions page and fill out the required information about your show."
    },
    {
      id: 5,
      question: "How do I report inappropriate content?",
      answer: "If you encounter inappropriate content, use the report button located near comments or content. Select the reason for reporting and our moderation team will review it."
    },
    {
      id: 6,
      question: "What types of shows can be added to the platform?",
      answer: "We accept various types of shows including TV series, movies, documentaries, web series, and other video content. All submissions are reviewed by our content team."
    },
    {
      id: 7,
      question: "How do I contact customer support?",
      answer: "You can contact our customer support team through the customer care system in your profile, or by sending an email to support@movieplatform.com."
    },
    {
      id: 8,
      question: "Can I edit my profile information?",
      answer: "Yes, you can edit your profile information by going to your profile page and clicking on the 'Edit Profile' or 'Settings' button."
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // This component can be viewed by any logged-in user
    if (!token) {
      alert('Please login to view FAQs.');
      navigate('/');
      return;
    }

    fetchFAQs();
  }, [navigate]);

  const fetchFAQs = async () => {
    try {
      // No token needed for public FAQ access
      const response = await axios.get(`${BASE_URL}/faqs`);
      
      // Use database FAQs if available, otherwise use sample data
      if (response.data.faqs && response.data.faqs.length > 0) {
        setFaqs(response.data.faqs);
      } else {
        setFaqs(sampleFAQs);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Use sample data if API fails
      setFaqs(sampleFAQs);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const filteredFAQs = faqs.filter(faq => 
    (faq.QUESTION || faq.question)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (faq.ANSWER || faq.answer)?.toLowerCase().includes(searchTerm.toLowerCase())
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
        Loading FAQs...
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
          onClick={() => navigate(-1)}
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
            Frequently Asked Questions
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
            Find answers to commonly asked questions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchFAQs}
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

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 50px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: 'white',
              outline: 'none'
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
            Questions and Answers ({filteredFAQs.length})
          </h3>
        </div>
        
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredFAQs.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              opacity: 0.7
            }}>
              {searchTerm ? 'No FAQs found matching your search.' : 'No FAQs available.'}
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.FAQ_ID || faq.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  borderBottom: index < filteredFAQs.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  onClick={() => toggleFAQ(faq.FAQ_ID || faq.id)}
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '1.1rem',
                    color: '#74b9ff',
                    flex: 1
                  }}>
                    {faq.QUESTION || faq.question}
                  </h4>
                  
                  <motion.div
                    animate={{ rotate: expandedFAQ === (faq.FAQ_ID || faq.id) ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ marginLeft: '15px' }}
                  >
                    <FiChevronRight size={20} />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedFAQ === (faq.FAQ_ID || faq.id) ? 'auto' : 0,
                    opacity: expandedFAQ === (faq.FAQ_ID || faq.id) ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.03)'
                  }}
                >
                  {expandedFAQ === (faq.FAQ_ID || faq.id) && (
                    <div style={{ padding: '0 20px 20px 20px' }}>
                      <p style={{ 
                        margin: 0, 
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: '1.6',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '15px',
                        borderRadius: '8px',
                        borderLeft: '4px solid #74b9ff'
                      }}>
                        {faq.ANSWER || faq.answer}
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '25px',
          marginTop: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.3rem', color: '#74b9ff' }}>
          Still need help?
        </h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.8, lineHeight: '1.6' }}>
          If you can't find the answer you're looking for, feel free to contact our support team.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/customer-care-requests')}
          style={{
            background: 'linear-gradient(45deg, #00b894, #00a085)',
            border: 'none',
            color: 'white',
            padding: '12px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          Contact Support
        </motion.button>
      </motion.div>
    </div>
  );
}

export default SimpleFAQManagement;
