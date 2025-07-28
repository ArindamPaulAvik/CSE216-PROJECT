const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// Get all offers
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Debug logging
    console.log('=== OFFERS ROUTE DEBUG ===');
    console.log('req.user:', req.user);
    console.log('userType:', req.user?.userType);
    console.log('adminType:', req.user?.adminType);
    console.log('========================');

    const userType = req.user?.userType;
    const adminType = req.user?.adminType;
    
    if (userType !== 'admin' || adminType !== 'Marketing') {
      console.log('Access denied - User type:', userType, 'Admin type:', adminType);
      return res.status(403).json({ error: 'Access denied. Only marketing admins can manage offers.' });
    }
    
    console.log('Executing database query...');
    const [rows] = await pool.query('SELECT * FROM SUBSCRIPTION_TYPE');
    console.log('Query successful, rows:', rows.length);
    
    res.json(rows);
  } catch (err) {
    console.error('Error in offers route:', err);
    res.status(500).json({ error: 'Failed to fetch offers', details: err.message });
  }
});

// Add new offer
router.post('/', authenticateToken, async (req, res) => {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can manage offers.' });
  }
  const { price, description, durationDays, isActive } = req.body;
  if (!price || !description || !durationDays) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO SUBSCRIPTION_TYPE (PRICE, DESCRIPTION, DURATION_DAYS, IS_ACTIVE) VALUES (?, ?, ?, ?)',
      [price, description, durationDays, isActive]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Error adding offer:', err);
    res.status(500).json({ error: 'Failed to add offer', details: err.message });
  }
});

// Edit offer
router.put('/:id', authenticateToken, async (req, res) => {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can manage offers.' });
  }
  const { price, description, durationDays, isActive } = req.body;
  const { id } = req.params;
  if (!price || !description || !durationDays) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.query(
      'UPDATE SUBSCRIPTION_TYPE SET PRICE=?, DESCRIPTION=?, DURATION_DAYS=?, IS_ACTIVE=? WHERE SUBSCRIPTION_TYPE_ID=?',
      [price, description, durationDays, isActive, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating offer:', err);
    res.status(500).json({ error: 'Failed to update offer', details: err.message });
  }
});

// Delete offer
router.delete('/:id', authenticateToken, async (req, res) => {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can manage offers.' });
  }
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM SUBSCRIPTION_TYPE WHERE SUBSCRIPTION_TYPE_ID=?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting offer:', err);
    res.status(500).json({ error: 'Failed to delete offer', details: err.message });
  }
});

module.exports = router;