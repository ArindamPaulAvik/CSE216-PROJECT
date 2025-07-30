// controllers/searchController.js
const pool = require('../db');

// GET /genres
exports.getGenres = async (req, res) => {
  try {
    console.log('🎭 Fetching genres...');
    const [rows] = await pool.execute('SELECT GENRE_NAME FROM GENRE');
    const genres = rows.map(row => row.GENRE_NAME);
    console.log('✅ Genres fetched:', genres);
    res.json({ genres });
  } catch (err) {
    console.error('❌ Error fetching genres:', err);
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
      whereClauses.push('S.CATEGORY_ID = 1');
    } else if (!movie && series) {
      whereClauses.push('S.CATEGORY_ID = 2');
    } else if (!movie && !series) {
      // Return empty array if no category selected
      return res.json({ results: [] });
    }
    // if both are true, skip category filter to show both movies and series

    // Search query logic - Handle empty query and special characters
    const cleanQuery = query.trim();
    if (cleanQuery !== '' && cleanQuery !== '*') {
      whereClauses.push('(S.TITLE LIKE ? OR S.DESCRIPTION LIKE ?)');
      params.push(`%${cleanQuery}%`, `%${cleanQuery}%`);
    }

    // Genre filter logic - Shows must have ALL selected genres
    let genreJoin = '';
    let genreHaving = '';
    if (genres.trim() !== '') {
      const genreList = genres.split(',').map(g => g.trim()).filter(g => g !== '');
      if (genreList.length > 0) {
        genreJoin = `
          INNER JOIN SHOW_GENRE SG ON S.SHOW_ID = SG.SHOW_ID
          INNER JOIN GENRE G ON SG.GENRE_ID = G.GENRE_ID
        `;
        
        // Create placeholders for genre names
        const genrePlaceholders = genreList.map(() => '?').join(',');
        whereClauses.push(`G.GENRE_NAME IN (${genrePlaceholders})`);
        params.push(...genreList);
        
        // Use HAVING to ensure the show has ALL selected genres
        genreHaving = `HAVING COUNT(DISTINCT G.GENRE_NAME) = ${genreList.length}`;
      }
    }

    // Construct full query
    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    // Determine limit based on search type
    const isEmptySearch = cleanQuery === '' || cleanQuery === '*';
    const limit = isEmptySearch ? 50 : 20;
    
    // Use DISTINCT to avoid duplicates when joining with genres
    const sql = `
  SELECT DISTINCT S.*, 
         GROUP_CONCAT(DISTINCT G2.GENRE_NAME ORDER BY G2.GENRE_NAME SEPARATOR ', ') AS GENRES,
         CASE 
           WHEN COUNT(DISTINCT SE.SHOW_EPISODE_ID) = 1 THEN 
             CONCAT(MIN(SE.SHOW_EPISODE_DURATION), ' min')
           WHEN COUNT(DISTINCT SE.SHOW_EPISODE_ID) > 1 THEN 
             CONCAT(COUNT(DISTINCT SE.SHOW_EPISODE_ID), ' episodes')
           ELSE 'N/A'
         END as DURATION
  FROM SHOWS S
  ${genreJoin}
  LEFT JOIN SHOW_GENRE SG2 ON S.SHOW_ID = SG2.SHOW_ID
  LEFT JOIN GENRE G2 ON SG2.GENRE_ID = G2.GENRE_ID
  LEFT JOIN SHOW_EPISODE SE ON S.SHOW_ID = SE.SHOW_ID
  ${whereSQL} ${whereSQL ? 'AND' : 'WHERE'} S.REMOVED = 0
  GROUP BY S.SHOW_ID
  ${genreHaving}
  ORDER BY ${isEmptySearch ? 'S.TITLE' : 'CASE WHEN S.TITLE LIKE ? THEN 0 ELSE 1 END, S.TITLE'}
  LIMIT ${limit}
`;


    // Add search term for ORDER BY if not empty search
    let finalParams = params;
    if (!isEmptySearch) {
      finalParams = [...params, `%${cleanQuery}%`];
    }

    console.log('📄 Executing SQL:', sql);
    console.log('🔧 Parameters:', finalParams);
    
    [results] = await pool.execute(sql, finalParams);

    console.log('✅ Results found:', results.length);
    
    // Add YEAR field to search results (extract from RELEASE_DATE)
    const resultsWithYear = results.map(show => ({
      ...show,
      YEAR: show.RELEASE_DATE ? new Date(show.RELEASE_DATE).getFullYear() : null
    }));
    
    // Add some debugging info
    if (results.length === 0) {
      console.log('⚠️  No results found with current filters');
      console.log('🔍 Query:', cleanQuery);
      console.log('🎬 Movie filter:', movie);
      console.log('📺 Series filter:', series);
      console.log('🎭 Genre filter:', genres);
    }

    res.json({ results: resultsWithYear });
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};