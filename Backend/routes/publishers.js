const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const publishersController = require('../controllers/publishersController');

router.get('/', authenticateToken, publishersController.getAllPublishers);
router.put('/:id/extend', authenticateToken, publishersController.extendContract);
router.put('/:id', authenticateToken, publishersController.updateContract);
router.post('/contract-renewal-requests', authenticateToken, publishersController.createContractRenewalRequest);
router.get('/contract-renewal-requests', authenticateToken, publishersController.getContractRenewalRequests);
router.put('/contract-renewal-requests/mark-seen', authenticateToken, publishersController.markPublisherRequestedSeen);
router.put('/contract-renewal-requests/mark-seen-accepted', authenticateToken, publishersController.markAdminRequestedAcceptedSeen);
router.put('/contract-renewal-requests/:id/reject', authenticateToken, publishersController.rejectContractRenewalRequest);
router.put('/contract-renewal-requests/:id/mark-seen-pub', authenticateToken, publishersController.markSeenPub);
router.put('/contract-renewal-requests/:id/accept', authenticateToken, publishersController.acceptPublisherRequestedRenewal);
router.put('/contract-renewal-requests/:id/accept-pub', authenticateToken, publishersController.acceptAdminRequestedRenewal);
router.get('/my-contract', authenticateToken, publishersController.getMyContract);
router.post('/publisher-earnings', authenticateToken, publishersController.publisherEarnings);
router.get('/my-shows', authenticateToken, publishersController.getPublisherShows);

module.exports = router; 