// controllers/searchController.js
const pool = require('../db');

exports.searchShows = async (req, res) => {
  const query = req.query.query || '';
  const movie = req.query.movie === 'true';
  const series = req.query.series === 'true';

  console.log('🔍 Search query received:', query);
  console.log('🎬 Movie:', movie, '📺 Series:', series);

  try {
    let results;
    let whereClauses = [];
    let params = [];

    // Category filter logic
    if (movie && !series) {
      whereClauses.push('CATEGORY_ID = 1');
    } else if (!movie && series) {
      whereClauses.push('CATEGORY_ID = 2');
    } else if (!movie && !series) {
      // Return empty array if no category selected
      return res.json({ results: [] });
    } // if both are true, skip category filter

    // Search query logic
    if (query.trim() !== '') {
      whereClauses.push('(TITLE LIKE ? OR DESCRIPTION LIKE ?)');
      params.push(`%${query}%`, `%${query}%`);
    }

    // Construct full query
    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const sql = `
      SELECT * FROM \`show\`
      ${whereSQL}
      ORDER BY TITLE
      LIMIT ${query.trim() === '' ? 50 : 20}
    `;

    console.log('📄 Executing SQL:', sql);
    [results] = await pool.query(sql, params);

    console.log('✅ Results found:', results.length);
    res.json({ results });
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
