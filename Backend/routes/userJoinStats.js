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

  console.log('=== User Join Stats Request ===');
  console.log('Request body:', req.body);
  console.log('Request method:', req.method);
  console.log('Request URL:', req.originalUrl);

  const days = parseInt(req.body.days, 10);
  console.log('Parsed days:', days);

  if (![7, 30].includes(days)) {
    console.log('Invalid days parameter');
    return res.status(400).json({ error: 'Invalid days parameter. Must be 7 or 30.' });
  }

  console.log(`Fetching user join stats for ${days} days`);

  try {
    // Test DB connection
    await pool.query('SELECT 1 as test');
    console.log('Database connection test: success');

    // Check if procedure exists
    const checkProcQuery = `
      SELECT ROUTINE_NAME 
      FROM INFORMATION_SCHEMA.ROUTINES 
      WHERE ROUTINE_SCHEMA = DATABASE() 
      AND ROUTINE_NAME = 'GetUserJoinStats'
    `;
    const [procCheck] = await pool.query(checkProcQuery);
    if (procCheck.length === 0) {
      console.log('Stored procedure GetUserJoinStats does not exist');
      return res.status(500).json({ error: 'Stored procedure GetUserJoinStats not found' });
    }
    console.log('Stored procedure check:', procCheck);
    console.log('Calling stored procedure...');

    const [results] = await pool.query('CALL GetUserJoinStats(?)', [days]);
    console.log('Raw stored procedure result:', results);
    const stats = results[0] || [];
    console.log('Extracted stats:', stats);
    res.json(stats);
  } catch (err) {
    console.error('Error in analytics backend:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
