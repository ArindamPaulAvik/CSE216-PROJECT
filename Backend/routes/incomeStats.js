const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/', authenticateToken, async (req, res) => {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;

  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can view analytics.' });
  }

  const days = parseInt(req.body.days, 10);
  if (![7, 30].includes(days)) {
    return res.status(400).json({ error: 'Invalid days parameter. Must be 7 or 30.' });
  }

  try {
    // Test DB connection
    await pool.query('SELECT 1 as test');

    // Check if procedure exists
    const checkProcQuery = `
      SELECT ROUTINE_NAME 
      FROM INFORMATION_SCHEMA.ROUTINES 
      WHERE ROUTINE_SCHEMA = DATABASE() 
      AND ROUTINE_NAME = 'GetIncomeForDays'
    `;
    const [procCheck] = await pool.query(checkProcQuery);
    if (procCheck.length === 0) {
      return res.status(500).json({ error: 'Stored procedure GetIncomeForDays not found' });
    }

    const [results] = await pool.query('CALL GetIncomeForDays(?)', [days]);
    const stats = results[0] || [];
    res.json(stats);
  } catch (err) {
    console.error('Error in income analytics backend:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 