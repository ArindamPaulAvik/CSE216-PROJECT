const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getUserSubscription,
  getAllSubscriptionTypes,
  createSubscription,
  getSubscriptionById,
  updateSubscriptionStatus,
  cancelSubscription,
  getTransactionDetails,
  createTransaction,
  updateTransactionStatus
} = require('../controllers/subscriptionController');

// GET user's current subscription
router.get('/user/current', authenticateToken, getUserSubscription);

// GET all available subscription types
router.get('/types', getAllSubscriptionTypes);

// GET subscription by ID
router.get('/:id', authenticateToken, getSubscriptionById);

// POST create new subscription
router.post('/create', authenticateToken, createSubscription);

// PUT update subscription status
router.put('/:id/status', authenticateToken, updateSubscriptionStatus);

// POST cancel current subscription
router.post('/cancel', authenticateToken, cancelSubscription);

// Transaction routes
router.get('/transaction/:id', authenticateToken, getTransactionDetails);
router.post('/transaction/create', authenticateToken, createTransaction);
router.put('/transaction/:id/status', authenticateToken, updateTransactionStatus);

module.exports = router;
