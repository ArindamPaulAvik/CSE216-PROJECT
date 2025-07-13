// controllers/searchController.js
const pool = require('../db');

exports.searchShows = async (req, res) => {
  const query = req.query.query;
  console.log('🔍 Search query received:', query);

  try {
    let results;
    
    // If no query or empty query, return all shows
    if (!query || query.trim() === '') {
      console.log('📋 Fetching all shows (no search query)');
      [results] = await pool.query(
        `SELECT * FROM \`show\` ORDER BY TITLE LIMIT 50`
      );
    } else {
      // Search with the provided query
      console.log('🔍 Searching with query:', query);
      [results] = await pool.query(
        `SELECT * FROM \`show\` WHERE TITLE LIKE ? OR DESCRIPTION LIKE ? ORDER BY TITLE LIMIT 20`,
        [`%${query}%`, `%${query}%`]
      );
    }

    console.log('✅ Results found:', results.length);
    res.json({ results });
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};