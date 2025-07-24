import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Layout from './Layout';
import './Subscription.css';

const Subscription = () => {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [showPromoSuccess, setShowPromoSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    paymentType: '',
    paypalId: '',
    paypalEmail: '',
    providerName: '',
    mobileNumber: '',
    accountEmail: '',
    cardHolderName: '',
    cardId: '',
    cardVcc: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchSubscriptionData();
    fetchPaymentMethods();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch current subscription
      const currentResponse = await axios.get('http://localhost:5000/subscriptions/user/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch available subscription types
      const typesResponse = await axios.get('http://localhost:5000/subscriptions/types');
      
      setCurrentSubscription(currentResponse.data.subscription);
      setSubscriptionTypes(typesResponse.data.subscriptionTypes || []);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('http://localhost:5000/methods');
      setPaymentMethods(response.data.methods || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Fallback to mock data
      setPaymentMethods([
        { METHOD_ID: 1, METHOD_NAME: 'PayPal', METHOD_ICON: '💳' },
        { METHOD_ID: 2, METHOD_NAME: 'Mobile Banking', METHOD_ICON: '📱' },
        { METHOD_ID: 3, METHOD_NAME: 'Credit Card', METHOD_ICON: '💳' }
      ]);
    }
  };

  const handleGetOffer = (plan) => {
    setSelectedPlan(plan);
    
    // Check if user has an active subscription
    if (currentSubscription && currentSubscription.SUBSCRIPTION_STATUS === 1) {
      setShowWarning(true);
    } else {
      setShowPayment(true);
    }
  };

  const handleConfirmPurchase = () => {
    setShowWarning(false);
    setShowPayment(true);
  };

  const handleCancelPurchase = () => {
    setShowWarning(false);
    setSelectedPlan(null);
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.post('http://localhost:5000/subscriptions/cancel', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setModalMessage('Subscription cancelled successfully!');
        setShowSuccessModal(true);
        fetchSubscriptionData(); // Refresh data
        
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        setModalMessage('Failed to cancel subscription. Please try again.');
        setShowErrorModal(true);
      }
    }
  };

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setModalMessage('Please enter a promo code');
      setShowErrorModal(true);
      return;
    }

    if (!selectedPlan) {
      setModalMessage('Please select a subscription plan first');
      setShowErrorModal(true);
      return;
    }

    setIsValidatingPromo(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/promo/validate', {
        promoCode: promoCode.trim(),
        subscriptionTypeId: selectedPlan.SUBSCRIPTION_TYPE_ID
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAppliedPromo(response.data.promotion);
        setModalMessage(`Promo code applied! You saved ${response.data.promotion.discountRate}% on your subscription.`);
        setShowPromoSuccess(true);
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      if (error.response?.data?.error) {
        setModalMessage(error.response.data.error);
      } else {
        setModalMessage('Failed to validate promo code. Please try again.');
      }
      setShowErrorModal(true);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const calculateDiscountedPrice = () => {
    if (!selectedPlan || !selectedPlan.PRICE) return 0;
    if (!appliedPromo) return parseFloat(selectedPlan.PRICE);
    
    const originalPrice = parseFloat(selectedPlan.PRICE);
    const discount = (originalPrice * appliedPromo.discountRate) / 100;
    return originalPrice - discount;
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    let paymentType = '';
    
    // Map method names to payment types
    if (method.METHOD_NAME.toLowerCase().includes('paypal')) {
      paymentType = 'PAYPAL';
    } else if (method.METHOD_NAME.toLowerCase().includes('mobile') || method.METHOD_NAME.toLowerCase().includes('banking')) {
      paymentType = 'MOBILE_BANKING';
    } else if (method.METHOD_NAME.toLowerCase().includes('card') || method.METHOD_NAME.toLowerCase().includes('credit')) {
      paymentType = 'CARD';
    }
    
    setPaymentDetails({
      ...paymentDetails,
      paymentType
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      // Calculate the final amount (discounted price)
      const finalAmount = calculateDiscountedPrice();
      
      // Create transaction
      const transactionResponse = await axios.post('http://localhost:5000/subscriptions/transaction/create', {
        methodId: selectedPaymentMethod.METHOD_ID,
        amount: finalAmount, // Send discounted price
        paymentDetails,
        promotionId: appliedPromo ? appliedPromo.promotionId : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const transactionId = transactionResponse.data.transactionId;
      
      // Simulate payment processing (in real app, this would integrate with payment gateway)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update transaction status to completed and record promo usage
      await axios.put(`http://localhost:5000/subscriptions/transaction/${transactionId}/status`, {
        status: 'COMPLETED',
        promotionId: appliedPromo ? appliedPromo.promotionId : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Create subscription
      await axios.post('http://localhost:5000/subscriptions/create', {
        subscriptionTypeId: selectedPlan.SUBSCRIPTION_TYPE_ID,
        transactionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setModalMessage('Subscription purchased successfully!');
      setShowSuccessModal(true);
      setShowPayment(false);
      setSelectedPlan(null);
      
      // Clear promo code after successful purchase
      setAppliedPromo(null);
      setPromoCode('');
      
      fetchSubscriptionData(); // Refresh data
      
    } catch (error) {
      console.error('Error processing payment:', error);
      setModalMessage('Payment failed. Please try again.');
      setShowErrorModal(true);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <Layout activeSection="subscription">
        <div className="subscription-container">
          <div className="loading">Loading subscription details...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeSection="subscription">
      <div className="subscription-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="subscription-content"
        >
        <h1>Subscription Management</h1>
        
        {/* Current Subscription Section */}
        <motion.section 
          className="current-subscription-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Your Current Subscription</h2>
          {currentSubscription ? (
            <div className="current-subscription-card">
              <div className="subscription-info">
                <h3>{currentSubscription.DESCRIPTION}</h3>
                <div className="subscription-details">
                  <p><strong>Amount Paid:</strong> ${currentSubscription.AMOUNT}</p>
                  {parseFloat(currentSubscription.AMOUNT) < parseFloat(currentSubscription.PRICE) && (
                    <p style={{ color: '#28a745', fontSize: '0.9rem' }}>
                      <strong>💰 You saved:</strong> ${(parseFloat(currentSubscription.PRICE) - parseFloat(currentSubscription.AMOUNT)).toFixed(2)} 
                      ({(((parseFloat(currentSubscription.PRICE) - parseFloat(currentSubscription.AMOUNT)) / parseFloat(currentSubscription.PRICE)) * 100).toFixed(0)}% discount)
                    </p>
                  )}
                  <p><strong>Start Date:</strong> {formatDate(currentSubscription.START_DATE)}</p>
                  <p><strong>End Date:</strong> {formatDate(currentSubscription.END_DATE)}</p>
                  <p><strong>Payment Date:</strong> {formatDate(currentSubscription.TRANSACTION_DATE)}</p>
                  <p><strong>Days Remaining:</strong> {getDaysRemaining(currentSubscription.END_DATE)} days</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${currentSubscription.SUBSCRIPTION_STATUS ? 'active' : 'inactive'}`}>
                      {currentSubscription.SUBSCRIPTION_STATUS ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="subscription-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${Math.max(0, Math.min(100, 
                        (getDaysRemaining(currentSubscription.END_DATE) / currentSubscription.DURATION_DAYS) * 100
                      ))}%`
                    }}
                  ></div>
                </div>
              </div>
              {currentSubscription.SUBSCRIPTION_STATUS === 1 && (
                <div className="subscription-actions">
                  <button 
                    className="cancel-subscription-btn"
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-subscription">
              <div className="no-subscription-icon">📋</div>
              <h3>No Active Subscription</h3>
              <p>You don't have an active subscription. Choose a plan below to get started!</p>
            </div>
          )}
        </motion.section>

        {/* Available Plans Section */}
        <motion.section 
          className="plans-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Available Plans</h2>
          <div className="plans-grid">
            {subscriptionTypes.map((plan, index) => (
              <motion.div
                key={plan.SUBSCRIPTION_TYPE_ID}
                className={`plan-card ${currentSubscription?.SUBSCRIPTION_TYPE_ID === plan.SUBSCRIPTION_TYPE_ID ? 'current-plan' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="plan-header">
                  <h3>{plan.DESCRIPTION}</h3>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">{plan.PRICE}</span>
                    <span className="period">/{plan.DURATION_DAYS} days</span>
                  </div>
                </div>
                
                <div className="plan-features">
                  <div className="feature">
                    <span className="feature-icon">✓</span>
                    <span>Access to all premium content</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">✓</span>
                    <span>Ad-free viewing experience</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">✓</span>
                    <span>Priority customer support</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">✓</span>
                    <span>Early access to new releases</span>
                  </div>
                </div>
                
                <div className="plan-actions">
                  {currentSubscription?.SUBSCRIPTION_TYPE_ID === plan.SUBSCRIPTION_TYPE_ID ? (
                    <button className="current-plan-btn" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button 
                      className="get-offer-btn"
                      onClick={() => handleGetOffer(plan)}
                    >
                      Get This Plan
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Warning Modal */}
      {showWarning && (
        <div className="modal">
          <div className="modal-content warning-modal">
            <h3>⚠️ Existing Subscription Found</h3>
            <div className="warning-message">
              <p>You currently have an active subscription that will be replaced.</p>
              <p><strong>Important:</strong></p>
              <ul>
                <li>Your current subscription will be immediately removed</li>
                <li>No refund will be provided for the remaining time</li>
                <li>You will be charged for the new subscription</li>
              </ul>
              <p>Are you sure you want to continue?</p>
            </div>
            <div className="modal-buttons">
              <button 
                className="cancel-btn" 
                onClick={handleCancelPurchase}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={handleConfirmPurchase}
              >
                Continue Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
        {showPayment && selectedPlan && (
          <motion.div 
            className="payment-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="payment-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="payment-header">
                <h3>Complete Your Purchase</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowPayment(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="selected-plan-summary">
                <h4>{selectedPlan.DESCRIPTION}</h4>
                <div className="price-breakdown">
                  <div className="original-price">
                    <span>Original Price: ${selectedPlan.PRICE} for {selectedPlan.DURATION_DAYS} days</span>
                  </div>
                  {appliedPromo && (
                    <div className="discount-info">
                      <div className="discount-line">
                        <span>Discount ({appliedPromo.discountRate}%):</span>
                        <span style={{ color: '#28a745' }}>-${selectedPlan ? (selectedPlan.PRICE * appliedPromo.discountRate / 100).toFixed(2) : '0.00'}</span>
                      </div>
                      <div className="promo-applied">
                        <span>Promo: {appliedPromo.promoCode}</span>
                        <button 
                          type="button" 
                          onClick={removePromoCode}
                          style={{ 
                            marginLeft: '10px', 
                            background: 'transparent', 
                            border: '1px solid #e74c3c', 
                            color: '#e74c3c',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="final-price" style={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem',
                    color: appliedPromo ? '#28a745' : 'inherit'
                  }}>
                    <span>Total: ${selectedPlan ? calculateDiscountedPrice().toFixed(2) : '0.00'}</span>
                  </div>
                </div>

                {/* Promo Code Section */}
                {!appliedPromo && (
                  <div className="promo-code-section" style={{ marginTop: '20px' }}>
                    <h4>Have a Promo Code?</h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}
                      />
                      <button
                        type="button"
                        onClick={validatePromoCode}
                        disabled={isValidatingPromo || !promoCode.trim()}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          cursor: isValidatingPromo ? 'not-allowed' : 'pointer',
                          opacity: isValidatingPromo ? 0.6 : 1
                        }}
                      >
                        {isValidatingPromo ? 'Validating...' : 'Apply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <div className="payment-methods">
                  <h4>Select Payment Method</h4>
                  <div className="payment-method-options">
                    {paymentMethods.map(method => (
                      <label key={method.METHOD_ID} className="payment-method-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.METHOD_ID}
                          onChange={() => handlePaymentMethodChange(method)}
                          required
                        />
                        <span className="payment-method-label">
                          <span className="method-icon">{method.METHOD_ICON}</span>
                          {method.METHOD_NAME}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {selectedPaymentMethod && (
                  <div className="payment-details">
                    <h4>Payment Details</h4>
                    
                    {paymentDetails.paymentType === 'PAYPAL' && (
                      <>
                        <div className="form-group">
                          <label>PayPal ID:</label>
                          <input
                            type="text"
                            value={paymentDetails.paypalId}
                            onChange={(e) => setPaymentDetails({
                              ...paymentDetails,
                              paypalId: e.target.value
                            })}
                            placeholder="Enter your PayPal ID"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>PayPal Email:</label>
                          <input
                            type="email"
                            value={paymentDetails.paypalEmail}
                            onChange={(e) => setPaymentDetails({
                              ...paymentDetails,
                              paypalEmail: e.target.value
                            })}
                            placeholder="Enter your PayPal email"
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    {paymentDetails.paymentType === 'MOBILE_BANKING' && (
                      <>
                        <div className="form-group">
                          <label>Provider Name:</label>
                          <input
                            type="text"
                            value={paymentDetails.providerName}
                            onChange={(e) => setPaymentDetails({
                              ...paymentDetails,
                              providerName: e.target.value
                            })}
                            placeholder="Enter your mobile banking provider"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Mobile Number:</label>
                          <input
                            type="tel"
                            value={paymentDetails.mobileNumber}
                            onChange={(e) => setPaymentDetails({
                              ...paymentDetails,
                              mobileNumber: e.target.value
                            })}
                            placeholder="Enter your mobile number"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Account Email:</label>
                          <input
                            type="email"
                            value={paymentDetails.accountEmail}
                            onChange={(e) => setPaymentDetails({
                              ...paymentDetails,
                              accountEmail: e.target.value
                            })}
                            placeholder="Enter your account email"
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    {paymentDetails.paymentType === 'CARD' && (
                      <>
                        <div className="form-group">
                          <label>Card Holder Name:</label>
                          <input
                            type="text"
                            value={paymentDetails.cardHolderName}
                            onChange={(e) => setPaymentDetails({
                              ...paymentDetails,
                              cardHolderName: e.target.value
                            })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Card Number:</label>
                          <input
                            type="text"
                            value={paymentDetails.cardId}
                            onChange={(e) => setPaymentDetails({
                              ...paymentDetails,
                              cardId: e.target.value
                            })}
                            placeholder="Enter your card number"
                            maxLength="19"
                            required
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>CVC:</label>
                            <input
                              type="text"
                              value={paymentDetails.cardVcc}
                              onChange={(e) => setPaymentDetails({
                                ...paymentDetails,
                                cardVcc: e.target.value
                              })}
                              placeholder="CVV"
                              maxLength="4"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Expiry Date:</label>
                            <input
                              type="date"
                              value={paymentDetails.expiryDate}
                              onChange={(e) => setPaymentDetails({
                                ...paymentDetails,
                                expiryDate: e.target.value
                              })}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                <div className="payment-actions">
                  <button type="button" onClick={() => setShowPayment(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="pay-btn" disabled={!selectedPaymentMethod}>
                    Pay ${selectedPlan ? calculateDiscountedPrice().toFixed(2) : '0.00'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '30px',
                borderRadius: '12px',
                border: '1px solid #444',
                minWidth: '300px',
                textAlign: 'center'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 style={{ color: '#28a745', marginBottom: '15px', fontSize: '1.2rem' }}>
                ✓ Success
              </h3>
              <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '0.9rem' }}>
                {modalMessage}
              </p>
              <motion.button
                onClick={() => setShowSuccessModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '30px',
                borderRadius: '12px',
                border: '1px solid #444',
                minWidth: '300px',
                textAlign: 'center'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 style={{ color: '#e74c3c', marginBottom: '15px', fontSize: '1.2rem' }}>
                ✗ Error
              </h3>
              <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '0.9rem' }}>
                {modalMessage}
              </p>
              <motion.button
                onClick={() => setShowErrorModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promo Success Modal */}
      <AnimatePresence>
        {showPromoSuccess && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '30px',
                borderRadius: '12px',
                border: '1px solid #444',
                minWidth: '300px',
                textAlign: 'center'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 style={{ color: '#28a745', marginBottom: '15px', fontSize: '1.2rem' }}>
                🎉 Promo Code Applied!
              </h3>
              <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '0.9rem' }}>
                {modalMessage}
              </p>
              <motion.button
                onClick={() => setShowPromoSuccess(false)}
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Awesome!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </Layout>
  );
};

export default Subscription;
