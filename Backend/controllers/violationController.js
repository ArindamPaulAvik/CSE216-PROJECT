// controllers/violationController.js
const pool = require('../db');

const getAllViolations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT VIOLATION_ID, VIOLATION_TEXT FROM VIOLATION');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching violations:', err);
    res.status(500).json({ error: 'Failed to fetch violations' });
  }
};

module.exports = {
  getAllViolations,
};
