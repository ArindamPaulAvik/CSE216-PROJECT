import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { FiUser, FiCreditCard, FiSettings, FiSave, FiEye, FiEyeOff, FiCheck, FiX, FiHelpCircle, FiMail, FiPhone, FiMessageSquare, FiCamera } from 'react-icons/fi';
import axios from 'axios';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerCareRef = useRef(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [highlightedRequestId, setHighlightedRequestId] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE || 'https://cse216-project.onrender.com';

  // Personal Details State
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: ''
  });

  // Profile picture state
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Billing State
  const [billingData, setBillingData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Personalization State
  const [personalizationData, setPersonalizationData] = useState({
    playTrailerOnHover: false,
    showMyRatingsToOthers: false
  });

  // FAQ State
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [faqData, setFaqData] = useState([]);

  // Customer Care State
  const [customerCareData, setCustomerCareData] = useState({
    subject: '',
    message: ''
  });
  const [userRequests, setUserRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchFAQs();
    fetchUserRequests();

    // Check for URL parameters
    const urlParams = new URLSearchParams(location.search);
    const sectionParam = urlParams.get('section');
    const customerCareParam = urlParams.get('customerCare');
    const requestId = urlParams.get('requestId');

    // Handle section parameter for routing from notifications
    if (sectionParam === 'billing') {
      setActiveSection('billing');
    } else if (sectionParam === 'personal') {
      setActiveSection('personal');
    } else if (sectionParam === 'customer-care') {
      setActiveSection('support');
      
      // Scroll to customer care section after a short delay
      setTimeout(() => {
        if (customerCareRef.current) {
          customerCareRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    } else if (customerCareParam === 'true') {
      setActiveSection('support');
      
      // Scroll to customer care section after a short delay
      setTimeout(() => {
        if (customerCareRef.current) {
          customerCareRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);

      // Highlight specific request if requestId is provided
      if (requestId) {
        setHighlightedRequestId(parseInt(requestId));
        // Remove highlight after 3 seconds
        setTimeout(() => {
          setHighlightedRequestId(null);
        }, 3000);
      }
    }
  }, [location.search]);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/faqs`);
      setFaqData(response.data.faqs || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Keep empty array if fetch fails
      setFaqData([]);
    }
  };

  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/customer-care/user/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRequests(response.data);
    } catch (error) {
      console.error('Error fetching user requests:', error);
      setUserRequests([]);
    }
  };

  const handleCustomerCareSubmit = async (e) => {
    e.preventDefault();
    if (!customerCareData.subject || !customerCareData.message) {
      showMessage('Please fill in both subject and message', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/customer-care/user/requests`, customerCareData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showMessage('Your message has been sent successfully!', 'success');
      setCustomerCareData({ subject: '', message: '' });
      setShowRequestForm(false);
      fetchUserRequests(); // Refresh the requests list
    } catch (error) {
      console.error('Error sending message:', error);
      showMessage('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerCareChange = (e) => {
    const { name, value } = e.target;
    setCustomerCareData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile data with profile picture
      const response = await axios.get(`${BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setPersonalData(prev => ({
          ...prev,
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          dateOfBirth: response.data.birthdate ? response.data.birthdate.split('T')[0] : '',
          profilePicture: response.data.profilePicture || ''
        }));

        // Set image preview if profile picture exists
        if (response.data.profilePicture) {
          setImagePreview(`${BASE_URL}/images/user/${response.data.profilePicture}`);
        }
      }

      // Fetch user preferences
      const prefsResponse = await axios.get(`${BASE_URL}/users/preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (prefsResponse.data) {
        setPersonalizationData({
          playTrailerOnHover: prefsResponse.data.playTrailerOnHover || false,
          showMyRatingsToOthers: prefsResponse.data.showMyRatingsToOthers || false
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  // Handle profile picture selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showMessage('Please select a valid image file', 'error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showMessage('Image size must be less than 5MB', 'error');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for multipart form submission
      const formData = new FormData();
      
      // Append user data
      formData.append('USER_FIRSTNAME', personalData.firstName);
      formData.append('USER_LASTNAME', personalData.lastName);
      formData.append('EMAIL', personalData.email);
      formData.append('PHONE_NO', personalData.phone);
      formData.append('BIRTH_DATE', personalData.dateOfBirth);

      // Append profile picture if selected
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      // If password change is requested
      if (personalData.newPassword) {
        if (personalData.newPassword !== personalData.confirmPassword) {
          showMessage('New passwords do not match', 'error');
          setLoading(false);
          return;
        }
        formData.append('currentPassword', personalData.currentPassword);
        formData.append('newPassword', personalData.newPassword);
      }

      const response = await axios.put(`${BASE_URL}/user/profile`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      showMessage('Personal details updated successfully!');
      
      // Update the profile picture if it was updated
      if (response.data.user && response.data.user.profilePicture) {
        setPersonalData(prev => ({
          ...prev,
          profilePicture: response.data.user.profilePicture
        }));
        setImagePreview(`${BASE_URL}/images/user/${response.data.user.profilePicture}`);
      }
      
      // Clear password fields and selected file
      setPersonalData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setSelectedFile(null);

    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update personal details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`${BASE_URL}/users/billing`, billingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showMessage('Billing information updated successfully!');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update billing information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalizationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`${BASE_URL}/users/preferences`, personalizationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showMessage('Personalization settings updated successfully!');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update personalization settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalDetails = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Personal Details</h2>
        <p>Manage your personal information and account security</p>
      </div>

      <form onSubmit={handlePersonalSubmit} className="settings-form">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <h3>Profile Picture</h3>
          <div className="profile-picture-container">
            <div className="profile-picture-preview">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="profile-picture"
                  onError={(e) => {
                    e.target.src = '/images/user/default-avatar.png';
                  }}
                />
              ) : (
                <div className="profile-picture-placeholder">
                  <FiUser size={40} />
                </div>
              )}
              
              <label className="profile-picture-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div className="upload-overlay">
                  <FiCamera size={20} />
                  <span>Change Photo</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={personalData.firstName}
              onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={personalData.lastName}
              onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={personalData.email}
              onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={personalData.phone}
              onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={personalData.dateOfBirth}
              onChange={(e) => setPersonalData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            />
          </div>
        </div>

        <div className="password-section">
          <h3>Change Password</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  value={personalData.currentPassword}
                  onChange={(e) => setPersonalData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={personalData.newPassword}
                onChange={(e) => setPersonalData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={personalData.confirmPassword}
                onChange={(e) => setPersonalData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="save-button" disabled={loading}>
          <FiSave />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );

  const renderPersonalization = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Personalization</h2>
        <p>Customize your viewing experience and privacy preferences</p>
      </div>

      <form onSubmit={handlePersonalizationSubmit} className="settings-form">
        <div className="preferences-grid">
          <div className="preference-group">
            <h3>Viewing Preferences</h3>
            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={personalizationData.playTrailerOnHover}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, playTrailerOnHover: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
                Play trailer on hover
              </label>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={personalizationData.showMyRatingsToOthers}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, showMyRatingsToOthers: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
                Show my ratings to others
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="save-button" disabled={loading}>
          <FiSave />
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );

  const renderCustomerCare = () => (
    <div className="settings-content" ref={customerCareRef}>
      <div className="settings-header">
        <h2>Customer Care</h2>
        <p>Get help and support from our customer service team</p>
      </div>

      <div className="customer-care-sections">
        {/* Send Message Section */}
        <div className="support-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Contact Support</h3>
            <button 
              className="save-button"
              onClick={() => setShowRequestForm(!showRequestForm)}
              style={{ fontSize: '0.9rem', padding: '8px 16px' }}
            >
              <FiMessageSquare />
              {showRequestForm ? 'Hide Form' : 'Send Message'}
            </button>
          </div>

          {showRequestForm && (
            <div className="contact-form-section">
              <form className="contact-form" onSubmit={handleCustomerCareSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Subject</label>
                    <select
                      name="subject"
                      value={customerCareData.subject}
                      onChange={handleCustomerCareChange}
                      required
                    >
                      <option value="">Select a subject...</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Account Issues">Account Issues</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Message</label>
                    <textarea 
                      name="message"
                      value={customerCareData.message}
                      onChange={handleCustomerCareChange}
                      rows="5" 
                      placeholder="Please describe your issue or question in detail..."
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="save-button" disabled={loading}>
                  <FiMail />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* User's Previous Requests */}
        <div className="support-section">
          <h3>Your Support Requests</h3>
          {userRequests.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              color: '#666'
            }}>
              <FiMessageSquare size={24} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>No support requests yet. Send your first message using the form above.</p>
            </div>
          ) : (
            <div className="requests-list">
              {userRequests.map((request) => (
                <div key={request.REQUEST_ID} className="request-item" style={{
                  border: highlightedRequestId === request.REQUEST_ID ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px',
                  background: highlightedRequestId === request.REQUEST_ID ? '#f8f9ff' : '#fff',
                  boxShadow: highlightedRequestId === request.REQUEST_ID ? '0 0 15px rgba(0, 123, 255, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>{request.SUBJECT}</h4>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: request.STATUS === 'OPEN' ? '#fff3cd' : 
                                request.STATUS === 'REPLIED' ? '#d1ecf1' : '#d4edda',
                      color: request.STATUS === 'OPEN' ? '#856404' : 
                             request.STATUS === 'REPLIED' ? '#0c5460' : '#155724'
                    }}>
                      {request.STATUS}
                    </span>
                  </div>
                  
                  <p style={{ margin: '10px 0', color: '#666', lineHeight: '1.5' }}>
                    {request.MESSAGE}
                  </p>
                  
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '10px' }}>
                    Sent: {new Date(request.CREATED_AT).toLocaleDateString()} at {new Date(request.CREATED_AT).toLocaleTimeString()}
                  </div>

                  {request.ADMIN_REPLY && (
                    <div style={{
                      marginTop: '15px',
                      padding: '12px',
                      background: '#f8f9fa',
                      borderLeft: '4px solid #007bff',
                      borderRadius: '0 4px 4px 0'
                    }}>
                      <strong style={{ color: '#007bff', display: 'block', marginBottom: '5px' }}>
                        Support Team Reply:
                      </strong>
                      <p style={{ margin: 0, color: '#333', lineHeight: '1.5' }}>
                        {request.ADMIN_REPLY}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '8px' }}>
                        Replied: {new Date(request.REPLIED_AT).toLocaleDateString()} at {new Date(request.REPLIED_AT).toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Frequently Asked Questions</h2>
        <p>Find quick answers to common questions</p>
      </div>

      <div className="customer-care-sections">
        {/* FAQ Section */}
        <div className="faq-section">
          <div className="faq-list">
            {faqData.map((faq) => (
              <div key={faq.FAQ_ID} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.FAQ_ID ? null : faq.FAQ_ID)}
                >
                  <span>{faq.QUESTION}</span>
                  <span className={`faq-arrow ${expandedFAQ === faq.FAQ_ID ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                {expandedFAQ === faq.FAQ_ID && (
                  <div className="faq-answer">
                    {faq.ANSWER}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="support-section">
          <h3>Still Need Help?</h3>
          <div className="help-cards">
            <div className="help-card">
              <div className="help-icon">
                <FiHelpCircle />
              </div>
              <div className="help-info">
                <h4>Contact Support</h4>
                <p>Can't find your answer? Our support team is here to help.</p>
                <button 
                  className="help-button"
                  onClick={() => setActiveSection('support')}
                >
                  Go to Customer Care
                </button>
              </div>
            </div>

            <div className="help-card">
              <div className="help-icon">
                <FiUser />
              </div>
              <div className="help-info">
                <h4>User Guide</h4>
                <p>Learn how to make the most of your account settings.</p>
                <button className="help-button">
                  View Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeSection="settings">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <button
            onClick={() => navigate('/frontpage')}
            className="back-button"
          >
            <FiUser size={20} />
            Back to Dashboard
          </button>
          <h1>Settings</h1>
        </div>

        <div className="settings-content-wrapper">
          <div className="settings-sidebar">
            <div className="settings-nav">
              <div className="nav-items">
                <div
                  className={`nav-item ${activeSection === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveSection('personal')}
                >
                  <FiUser />
                  <span>Personal Details</span>
                </div>

                <div
                  className={`nav-item ${activeSection === 'personalization' ? 'active' : ''}`}
                  onClick={() => setActiveSection('personalization')}
                >
                  <FiSettings />
                  <span>Personalization</span>
                </div>

                <div
                  className={`nav-item ${activeSection === 'support' ? 'active' : ''}`}
                  onClick={() => setActiveSection('support')}
                >
                  <FiHelpCircle />
                  <span>Customer Care</span>
                </div>

                <div
                  className={`nav-item ${activeSection === 'faq' ? 'active' : ''}`}
                  onClick={() => setActiveSection('faq')}
                >
                  <FiMessageSquare />
                  <span>FAQ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-main">
            {message && (
              <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
                {messageType === 'success' ? <FiCheck /> : <FiX />}
                {message}
              </div>
            )}

            {activeSection === 'personal' && renderPersonalDetails()}
            {activeSection === 'personalization' && renderPersonalization()}
            {activeSection === 'support' && renderCustomerCare()}
            {activeSection === 'faq' && renderFAQ()}
          </div>
        </div>
      </div>

      <style>{`
        .settings-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          color: #e0e0e0;
        }

        .settings-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #e0e0e0;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .settings-header h1 {
          color: #e0e0e0;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .settings-content-wrapper {
          display: flex;
          gap: 30px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 0;
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .settings-sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.05);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 30px 20px;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
        }

        .nav-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #e0e0e0;
        }

        .nav-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .nav-item.active {
          background: #667eea;
          color: white;
        }

        .nav-item svg {
          font-size: 18px;
        }

        .settings-main {
          flex: 1;
          padding: 30px;
          max-width: calc(100% - 310px);
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .alert-success {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #81c784;
        }

        .alert-error {
          background: rgba(229, 62, 62, 0.1);
          border: 1px solid rgba(229, 62, 62, 0.3);
          color: #ff6b6b;
        }

        .settings-content {
          max-width: 100%;
        }

        .settings-header h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #e0e0e0;
        }

        .settings-header p {
          color: #b0b0b0;
          font-size: 16px;
          margin-bottom: 30px;
        }

        .settings-form {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 30px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .profile-picture-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .profile-picture-section h3 {
          color: #e0e0e0;
          font-size: 18px;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .profile-picture-container {
          display: flex;
          justify-content: center;
        }

        .profile-picture-preview {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .profile-picture,
        .profile-picture-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          background: rgba(255, 255, 255, 0.1);
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .profile-picture-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
        }

        .profile-picture-upload {
          position: absolute;
          bottom: 0;
          right: 0;
          cursor: pointer;
        }

        .upload-overlay {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 2px solid #fff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-size: 10px;
          color: white;
          text-align: center;
          padding: 2px;
        }

        .upload-overlay:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .upload-overlay span {
          font-size: 8px;
          margin-top: 2px;
          line-height: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 600;
          color: #e0e0e0;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: #e0e0e0;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-group select option {
          background: #1a1a1a;
          color: #e0e0e0;
        }

        .password-section {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .password-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #e0e0e0;
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #b0b0b0;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #e0e0e0;
        }

        .preferences-grid {
          display: grid;
          gap: 25px;
        }

        .preference-group {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.02);
        }

        .preference-group h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #e0e0e0;
        }

        .toggle-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-weight: 500;
          color: #e0e0e0;
        }

        .toggle-label input[type="checkbox"] {
          display: none;
        }

        .toggle-slider {
          position: relative;
          width: 44px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .toggle-slider::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: all 0.3s ease;
        }

        .toggle-label input[type="checkbox"]:checked + .toggle-slider {
          background: #667eea;
        }

        .toggle-label input[type="checkbox"]:checked + .toggle-slider::before {
          transform: translateX(20px);
        }

        .save-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-button:hover:not(:disabled) {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Customer Care Styles */
        .customer-care-sections {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .support-section,
        .faq-section,
        .contact-form-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 25px;
        }

        .support-section h3,
        .faq-section h3,
        .contact-form-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #e0e0e0;
        }

        .contact-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .contact-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .contact-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .contact-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }

        .contact-info h4 {
          margin: 0 0 5px 0;
          color: #e0e0e0;
          font-size: 16px;
          font-weight: 600;
        }

        .contact-info p {
          margin: 0 0 10px 0;
          color: #b0b0b0;
          font-size: 14px;
        }

        .contact-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .contact-link:hover {
          color: #5a67d8;
        }

        .chat-button {
          background: none;
          border: none;
          padding: 0;
          font-size: inherit;
          font-weight: inherit;
          cursor: pointer;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .faq-item {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: all 0.3s ease;
          color: #e0e0e0;
          font-weight: 500;
        }

        .faq-question:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .faq-arrow {
          transition: transform 0.3s ease;
          color: #667eea;
        }

        .faq-arrow.expanded {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 20px;
          color: #b0b0b0;
          line-height: 1.6;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeInDown 0.3s ease;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .contact-form {
          margin-top: 15px;
        }

        .contact-form textarea {
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: #e0e0e0;
          font-size: 16px;
          font-family: inherit;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .contact-form textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: rgba(255, 255, 255, 0.08);
        }

        .contact-form textarea::placeholder {
          color: #666;
        }

        /* Help Cards Styles */
        .help-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .help-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .help-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .help-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(102, 126, 234, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          font-size: 18px;
        }

        .help-info h4 {
          margin: 0 0 5px 0;
          color: #e0e0e0;
          font-size: 16px;
          font-weight: 600;
        }

        .help-info p {
          margin: 0 0 12px 0;
          color: #b0b0b0;
          font-size: 14px;
        }

        .help-button {
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          color: #667eea;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .help-button:hover {
          background: rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.5);
        }

        @media (max-width: 768px) {
          .settings-container {
            padding: 15px;
          }

          .settings-content-wrapper {
            flex-direction: column;
            gap: 0;
          }

          .settings-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 20px;
          }

          .nav-items {
            flex-direction: row;
            gap: 10px;
            overflow-x: auto;
          }

          .nav-item {
            white-space: nowrap;
            min-width: auto;
          }

          .settings-main {
            max-width: 100%;
            padding: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .preference-group {
            padding: 20px;
          }

          .contact-options {
            grid-template-columns: 1fr;
          }

          .help-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Settings;
