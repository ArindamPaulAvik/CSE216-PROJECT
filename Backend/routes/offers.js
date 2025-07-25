const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// Get all offers
router.get('/', authenticateToken, async (req, res) => {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can manage offers.' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM subscription_type');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offers' });
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
      'INSERT INTO subscription_type (PRICE, DESCRIPTION, DURATION_DAYS, IS_ACTIVE) VALUES (?, ?, ?, ?)',
      [price, description, durationDays, isActive]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add offer' });
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
      'UPDATE subscription_type SET PRICE=?, DESCRIPTION=?, DURATION_DAYS=?, IS_ACTIVE=? WHERE SUBSCRIPTION_TYPE_ID=?',
      [price, description, durationDays, isActive, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update offer' });
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
    await pool.query('DELETE FROM subscription_type WHERE SUBSCRIPTION_TYPE_ID=?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete offer' });
  }
});

module.exports = router; 