const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  getAllRequests,
  getRequestById,
  createRequest,
  replyToRequest,
  updateRequestStatus,
  getUserRequests,
  getRequestStats
} = require('../controllers/customerCareController');

// GET all customer care requests (admin only)
router.get('/admin/requests', authenticateToken, getAllRequests);

// GET request statistics (admin only)
router.get('/admin/stats', authenticateToken, getRequestStats);

// GET request by ID (admin only)
router.get('/admin/requests/:id', authenticateToken, getRequestById);

// POST reply to request (admin only)
router.post('/admin/requests/:id/reply', authenticateToken, replyToRequest);

// PUT update request status (admin only)
router.put('/admin/requests/:id/status', authenticateToken, updateRequestStatus);

// GET user's own requests (user only)
router.get('/user/requests', authenticateToken, getUserRequests);

// POST create new request (user only)
router.post('/user/requests', authenticateToken, createRequest);

module.exports = router;
