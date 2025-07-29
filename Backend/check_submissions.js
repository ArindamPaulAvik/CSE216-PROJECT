const pool = require('./db');

async function checkSubmissions() {
  try {
    console.log('Checking SUBMISSION table structure...');
    const [columns] = await pool.query('DESCRIBE SUBMISSION');
    console.log('SUBMISSION table columns:', columns);
    
    console.log('\nChecking first few submissions...');
    const [submissions] = await pool.query('SELECT * FROM SUBMISSION ORDER BY SUBMISSION_ID DESC LIMIT 5');
    console.log('Recent submissions:', submissions);
    
    console.log('\nChecking series specifically in SHOWS...');
    const [seriesShows] = await pool.query('SELECT SHOW_ID, TITLE, CATEGORY_ID, PUBLISHER_ID FROM SHOWS WHERE CATEGORY_ID = 2 AND REMOVED = 0');
    console.log('Series in SHOWS table:', seriesShows);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkSubmissions();
