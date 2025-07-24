const db = require('../db');

// Get all payment methods
const getAllMethods = async (req, res) => {
  try {
    const query = 'SELECT * FROM method ORDER BY METHOD_ID';
    const [methods] = await db.execute(query);
    
    res.json({
      success: true,
      methods
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment methods'
    });
  }
};

module.exports = {
  getAllMethods
};
