// controllers/searchController.js
const pool = require('../db');

// GET /genres
exports.getGenres = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT GENRE_NAME FROM GENRE');
    const genres = rows.map(row => row.GENRE_NAME);
    res.json({ genres });
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

exports.searchShows = async (req, res) => {
  const query = req.query.query || '';
  const movie = req.query.movie === 'true';
  const series = req.query.series === 'true';
  const genres = req.query.genres || '';

  console.log('🔍 Search query received:', query);
  console.log('🎬 Movie:', movie, '📺 Series:', series);
  console.log('🎭 Genres:', genres);

  try {
    let results;
    let whereClauses = [];
    let params = [];

    // Category filter logic - FIXED: Default to showing both if neither is explicitly false
    if (movie && !series) {
      whereClauses.push('s.CATEGORY_ID = 1');
    } else if (!movie && series) {
      whereClauses.push('s.CATEGORY_ID = 2');
    } else if (!movie && !series) {
      // Return empty array if no category selected
      return res.json({ results: [] });
    }
    // if both are true, skip category filter to show both movies and series

    // Search query logic - Handle empty query and special characters
    const cleanQuery = query.trim();
    if (cleanQuery !== '' && cleanQuery !== '*') {
      whereClauses.push('(s.TITLE LIKE ? OR s.DESCRIPTION LIKE ?)');
      params.push(`%${cleanQuery}%`, `%${cleanQuery}%`);
    }

    // Genre filter logic - Shows must have ALL selected genres
    let genreJoin = '';
    let genreHaving = '';
    if (genres.trim() !== '') {
      const genreList = genres.split(',').map(g => g.trim()).filter(g => g !== '');
      if (genreList.length > 0) {
        genreJoin = `
          INNER JOIN show_genre sg ON s.SHOW_ID = sg.SHOW_ID
          INNER JOIN genre g ON sg.GENRE_ID = g.GENRE_ID
        `;
        
        // Create placeholders for genre names
        const genrePlaceholders = genreList.map(() => '?').join(',');
        whereClauses.push(`g.GENRE_NAME IN (${genrePlaceholders})`);
        params.push(...genreList);
        
        // Use HAVING to ensure the show has ALL selected genres
        genreHaving = `HAVING COUNT(DISTINCT g.GENRE_NAME) = ${genreList.length}`;
      }
    }

    // Construct full query
    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    // Determine limit based on search type
    const isEmptySearch = cleanQuery === '' || cleanQuery === '*';
    const limit = isEmptySearch ? 50 : 20;
    
    // Use DISTINCT to avoid duplicates when joining with genres
    const sql = `
      SELECT DISTINCT s.*, 
             GROUP_CONCAT(DISTINCT g2.GENRE_NAME ORDER BY g2.GENRE_NAME SEPARATOR ', ') AS GENRES
      FROM \`show\` s
      ${genreJoin}
      LEFT JOIN show_genre sg2 ON s.SHOW_ID = sg2.SHOW_ID
      LEFT JOIN genre g2 ON sg2.GENRE_ID = g2.GENRE_ID
      ${whereSQL}
      GROUP BY s.SHOW_ID
      ${genreHaving}
      ORDER BY ${isEmptySearch ? 's.TITLE' : 'CASE WHEN s.TITLE LIKE ? THEN 0 ELSE 1 END, s.TITLE'}
      LIMIT ${limit}
    `;

    // Add search term for ORDER BY if not empty search
    let finalParams = params;
    if (!isEmptySearch) {
      finalParams = [...params, `%${cleanQuery}%`];
    }

    console.log('📄 Executing SQL:', sql);
    console.log('🔧 Parameters:', finalParams);
    
    [results] = await pool.query(sql, finalParams);

    console.log('✅ Results found:', results.length);
    
    // Add some debugging info
    if (results.length === 0) {
      console.log('⚠️  No results found with current filters');
      console.log('🔍 Query:', cleanQuery);
      console.log('🎬 Movie filter:', movie);
      console.log('📺 Series filter:', series);
      console.log('🎭 Genre filter:', genres);
    }

    res.json({ results });
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};