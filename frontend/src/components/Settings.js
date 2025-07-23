import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { FiUser, FiCreditCard, FiSettings, FiSave, FiEye, FiEyeOff, FiCheck, FiX, FiHelpCircle, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerCareRef = useRef(null);
  const userRequestsRef = useRef(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [highlightedRequestId, setHighlightedRequestId] = useState(null);

  // Personal Details State
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
    emailNotifications: true,
    pushNotifications: true,
    autoplay: true,
    subtitles: false,
    parentalControl: true
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

    // Check for customerCare URL parameter
    const urlParams = new URLSearchParams(location.search);
    const customerCareParam = urlParams.get('customerCare');
    const requestId = urlParams.get('requestId');

    if (customerCareParam === 'true') {
      // Set active section to support (which renders customer care)
      setActiveSection('support');
      
      // Scroll to the user requests section and highlight specific request
      setTimeout(() => {
        if (requestId && userRequestsRef.current) {
          // Scroll to user requests section
          userRequestsRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300);
      
      // Highlight specific request if requestId is provided
      if (requestId) {
        setHighlightedRequestId(parseInt(requestId));
        // Remove highlight after 5 seconds
        setTimeout(() => {
          setHighlightedRequestId(null);
        }, 5000);
      }
    }
  }, [location.search]);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/faqs');
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
      const response = await axios.get('http://localhost:5000/customer-care/user/requests', {
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
      await axios.post('http://localhost:5000/customer-care/user/requests', customerCareData, {
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
      const response = await axios.get('http://localhost:5000/frontpage', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setPersonalData(prev => ({
          ...prev,
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          dateOfBirth: response.data.dateOfBirth || ''
        }));
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

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Update personal details
      const updateData = {
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        email: personalData.email,
        phone: personalData.phone,
        dateOfBirth: personalData.dateOfBirth
      };

      // If password change is requested
      if (personalData.newPassword) {
        if (personalData.newPassword !== personalData.confirmPassword) {
          showMessage('New passwords do not match', 'error');
          setLoading(false);
          return;
        }
        updateData.currentPassword = personalData.currentPassword;
        updateData.newPassword = personalData.newPassword;
      }

      await axios.put('http://localhost:5000/users/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showMessage('Personal details updated successfully!');
      
      // Clear password fields
      setPersonalData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

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
      
      await axios.put('http://localhost:5000/users/billing', billingData, {
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
      
      await axios.put('http://localhost:5000/users/preferences', personalizationData, {
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

  const renderBillingPayment = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Billing & Payment</h2>
        <p>Manage your payment methods and billing information</p>
      </div>

      <form onSubmit={handleBillingSubmit} className="settings-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              value={billingData.cardholderName}
              onChange={(e) => setBillingData(prev => ({ ...prev, cardholderName: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              value={billingData.cardNumber}
              onChange={(e) => setBillingData(prev => ({ ...prev, cardNumber: e.target.value }))}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              value={billingData.expiryDate}
              onChange={(e) => setBillingData(prev => ({ ...prev, expiryDate: e.target.value }))}
              placeholder="MM/YY"
              required
            />
          </div>

          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              value={billingData.cvv}
              onChange={(e) => setBillingData(prev => ({ ...prev, cvv: e.target.value }))}
              placeholder="123"
              maxLength="4"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Billing Address</label>
            <input
              type="text"
              value={billingData.billingAddress}
              onChange={(e) => setBillingData(prev => ({ ...prev, billingAddress: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={billingData.city}
              onChange={(e) => setBillingData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              value={billingData.postalCode}
              onChange={(e) => setBillingData(prev => ({ ...prev, postalCode: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <select
              value={billingData.country}
              onChange={(e) => setBillingData(prev => ({ ...prev, country: e.target.value }))}
              required
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="BR">Brazil</option>
              <option value="IN">India</option>
            </select>
          </div>
        </div>

        <button type="submit" className="save-button" disabled={loading}>
          <FiSave />
          {loading ? 'Saving...' : 'Save Payment Info'}
        </button>
      </form>
    </div>
  );

  const renderPersonalization = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Personalization</h2>
        <p>Customize your viewing experience and preferences</p>
      </div>

      <form onSubmit={handlePersonalizationSubmit} className="settings-form">
        <div className="preferences-grid">
          <div className="preference-group">
            <h3>Notifications</h3>
            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={personalizationData.emailNotifications}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
                Email Notifications
              </label>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={personalizationData.pushNotifications}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
                Push Notifications
              </label>
            </div>
          </div>

          <div className="preference-group">
            <h3>Playback</h3>
            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={personalizationData.autoplay}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, autoplay: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
                Autoplay
              </label>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={personalizationData.subtitles}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, subtitles: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
                Default Subtitles
              </label>
            </div>
          </div>

          <div className="preference-group">
            <h3>Parental Control</h3>
            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={personalizationData.parentalControl}
                  onChange={(e) => setPersonalizationData(prev => ({ ...prev, parentalControl: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
                Enable Parental Control
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
<div className="support-section" ref={userRequestsRef}>
  <h3 style={{ color: 'white' }}>Your Support Requests</h3>
  {userRequests.length === 0 ? (
    <div style={{ 
      padding: '1.5rem', 
      textAlign: 'center', 
      background: 'linear-gradient(135deg, rgba(75, 85, 110, 0.9), rgba(77, 64, 105, 0.9))',
      borderRadius: '0.5rem',
      color: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <FiMessageSquare size={24} style={{ marginBottom: '0.75rem', opacity: 0.7, color: 'white' }} />
      <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
        No support requests yet. Send your first message using the form above.
      </p>
    </div>
  ) : (
    <div className="requests-list">
      {userRequests.map((request) => (
        <div key={request.REQUEST_ID} className="request-item" style={{
          border: highlightedRequestId === request.REQUEST_ID ? '2px solid rgba(138, 147, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem',
          background: highlightedRequestId === request.REQUEST_ID 
            ? 'linear-gradient(135deg, rgba(85, 95, 125, 0.95), rgba(128, 112, 160, 0.95))' 
            : 'linear-gradient(135deg, rgba(75, 85, 110, 0.9), rgba(108, 92, 140, 0.9))',
          boxShadow: highlightedRequestId === request.REQUEST_ID 
            ? '0 0 1rem rgba(138, 147, 255, 0.4)' 
            : '0 0.25rem 0.5rem rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>{request.SUBJECT}</h4>
            <span style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              background: request.STATUS === 'OPEN' ? 'rgba(255, 193, 7, 0.2)' : 
                        request.STATUS === 'REPLIED' ? 'rgba(13, 202, 240, 0.2)' : 'rgba(25, 135, 84, 0.2)',
              color: request.STATUS === 'OPEN' ? '#ffc107' : 
                     request.STATUS === 'REPLIED' ? '#0dcaf0' : '#198754',
              border: `1px solid ${request.STATUS === 'OPEN' ? '#ffc107' : 
                                 request.STATUS === 'REPLIED' ? '#0dcaf0' : '#198754'}`
            }}>
              {request.STATUS}
            </span>
          </div>
          
          <p style={{ margin: '0.75rem 0', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.5' }}>
            {request.MESSAGE}
          </p>
          
          <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.75rem' }}>
            Sent: {new Date(request.CREATED_AT).toLocaleDateString()} at {new Date(request.CREATED_AT).toLocaleTimeString()}
          </div>

          {request.ADMIN_REPLY && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderLeft: '4px solid rgba(138, 147, 255, 0.8)',
              borderRadius: '0 0.25rem 0.25rem 0',
              backdropFilter: 'blur(10px)'
            }}>
              <strong style={{ color: 'rgba(138, 147, 255, 0.9)', display: 'block', marginBottom: '0.5rem' }}>
                Support Team Reply:
              </strong>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
                {request.ADMIN_REPLY}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.5rem' }}>
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
                  className={`nav-item ${activeSection === 'billing' ? 'active' : ''}`}
                  onClick={() => setActiveSection('billing')}
                >
                  <FiCreditCard />
                  <span>Billing & Payment</span>
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
            {activeSection === 'billing' && renderBillingPayment()}
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
