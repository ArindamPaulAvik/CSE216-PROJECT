// controllers/searchController.js
const pool= require('../db');

exports.searchShows = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: 'Missing search query' });
  }

  try {
    const [results] = await pool.query(
      `SELECT * FROM \`show\` WHERE TITLE LIKE ? OR DESCRIPTION LIKE ? LIMIT 20`,
      [`%${query}%`, `%${query}%`]
    );

    res.json({ results });
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.searchShows = async (req, res) => {
  const query = req.query.query;
  console.log('🔍 Search query received:', query);

  if (!query) {
    return res.status(400).json({ message: 'Missing search query' });
  }

  try {
    const [results] = await pool.query(
      `SELECT * FROM \`show\` WHERE TITLE LIKE ? OR DESCRIPTION LIKE ? LIMIT 20`,
      [`%${query}%`, `%${query}%`]
    );

    console.log('✅ Results found:', results.length);
    res.json({ results });
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 