const pool = require('./db');

async function checkData() {
  try {
    console.log('Checking SHOWS table...');
    const [shows] = await pool.query('SELECT SHOW_ID, TITLE, CATEGORY_ID, PUBLISHER_ID, REMOVED FROM SHOWS LIMIT 10');
    console.log('Shows in database:', shows);
    
    console.log('\nChecking CATEGORIES...');
    const [categories] = await pool.query('SELECT * FROM CATEGORY');
    console.log('Categories:', categories);
    
    console.log('\nChecking SUBMISSIONS...');
    const [submissions] = await pool.query('SELECT SUBMISSION_ID, TITLE, CATEGORY, STATUS, PUBLISHER_ID FROM SUBMISSION WHERE STATUS != "REJECTED" ORDER BY SUBMISSION_ID DESC LIMIT 10');
    console.log('Recent non-rejected submissions:', submissions);
    
    console.log('\nChecking series specifically...');
    const [seriesShows] = await pool.query('SELECT SHOW_ID, TITLE, CATEGORY_ID, PUBLISHER_ID FROM SHOWS WHERE CATEGORY_ID = 2 AND REMOVED = 0');
    console.log('Series in SHOWS table:', seriesShows);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkData();
