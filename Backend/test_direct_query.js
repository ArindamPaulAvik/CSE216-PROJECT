const pool = require('./db');

async function testQuery() {
  try {
    console.log('Testing direct database query for publisher ID 1...');
    
    const query = `
      SELECT 
        S.SHOW_ID,
        S.TITLE,
        S.THUMBNAIL,
        S.RATING,
        S.WATCH_COUNT,
        S.CATEGORY_ID,
        S.STATUS_ID,
        S.PUBLISHER_ID,
        S.AGE_RESTRICTION_ID,
        S.DESCRIPTION,
        S.TEASER,
        S.RELEASE_DATE,
        S.SEASON,
        S.LICENSE,
        S.ADMIN_ID,
        S.BANNER,
        S.REMOVED,
        P.ROYALTY,
        (S.WATCH_COUNT * P.ROYALTY) as INCOME
      FROM SHOWS S
      JOIN PUBLISHER P ON S.PUBLISHER_ID = P.PUBLISHER_ID
      WHERE S.PUBLISHER_ID = ? AND S.REMOVED = 0
      ORDER BY S.WATCH_COUNT DESC
    `;
    
    console.log('Executing query with publisherId: 1');
    const [rows] = await pool.query(query, [1]);
    
    console.log('Query result - number of rows:', rows.length);
    console.log('All rows with full details:');
    rows.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });
    
    // Test filtering
    console.log('\nFiltering for series (CATEGORY_ID === 2):');
    const series = rows.filter(show => show.CATEGORY_ID === 2);
    console.log('Filtered series:', series);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testQuery();
