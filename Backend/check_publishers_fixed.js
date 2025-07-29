const pool = require('./db');

async function checkPublishers() {
  try {
    console.log('Checking PUBLISHER table structure...');
    const [columns] = await pool.query('DESCRIBE PUBLISHER');
    console.log('PUBLISHER table columns:', columns);
    
    console.log('\nChecking publishers...');
    const [publishers] = await pool.query('SELECT * FROM PUBLISHER LIMIT 10');
    console.log('Publishers in database:', publishers);
    
    console.log('\nChecking which publishers have series...');
    const [publishersWithSeries] = await pool.query(`
      SELECT DISTINCT P.PUBLISHER_ID, P.PUBLISHER_NAME, COUNT(S.SHOW_ID) as SERIES_COUNT
      FROM PUBLISHER P
      LEFT JOIN SHOWS S ON P.PUBLISHER_ID = S.PUBLISHER_ID AND S.CATEGORY_ID = 2 AND S.REMOVED = 0
      GROUP BY P.PUBLISHER_ID, P.PUBLISHER_NAME
      HAVING SERIES_COUNT > 0
      ORDER BY SERIES_COUNT DESC
    `);
    console.log('Publishers with series:', publishersWithSeries);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkPublishers();
