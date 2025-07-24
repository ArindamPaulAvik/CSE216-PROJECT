// Updated promotions routes with better error handling
const express = require('express');
const router = express.Router();
const { 
  getPromotions, 
  addPromotion, 
  updatePromotion, 
  deletePromotion, 
  getSubscriptionTypes
} = require('../controllers/promotionsController');

// Add middleware to log all requests
router.use((req, res, next) => {
  // Logging request method and URL
  next();
});

router.get('/', getPromotions);
router.post('/', addPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

// Main subscription types endpoint
router.get('/subscription-types', getSubscriptionTypes);

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({ message: 'Route is working', timestamp: new Date().toISOString() });
});

module.exports = router;