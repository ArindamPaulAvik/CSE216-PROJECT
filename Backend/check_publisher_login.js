const pool = require('./db');

async function checkPersonPublisher() {
  try {
    console.log('Checking PERSON and PUBLISHER relationships...');
    
    const [publisherPersons] = await pool.query(`
      SELECT P.PUBLISHER_ID, P.PUBLISHER_NAME, P.PERSON_ID, PE.EMAIL, PE.FIRST_NAME, PE.LAST_NAME
      FROM PUBLISHER P
      JOIN PERSON PE ON P.PERSON_ID = PE.PERSON_ID
      WHERE P.IS_ACTIVE = 1
      ORDER BY P.PUBLISHER_ID
    `);
    
    console.log('Publisher-Person relationships:');
    publisherPersons.forEach(p => {
      console.log(`Publisher ID ${p.PUBLISHER_ID} (${p.PUBLISHER_NAME}): Person ID ${p.PERSON_ID}, Email: ${p.EMAIL}, Name: ${p.FIRST_NAME} ${p.LAST_NAME}`);
    });
    
    // Show series count for each publisher
    console.log('\nSeries count per publisher:');
    const [seriesCounts] = await pool.query(`
      SELECT P.PUBLISHER_ID, P.PUBLISHER_NAME, COUNT(S.SHOW_ID) as SERIES_COUNT
      FROM PUBLISHER P
      LEFT JOIN SHOWS S ON P.PUBLISHER_ID = S.PUBLISHER_ID AND S.CATEGORY_ID = 2 AND S.REMOVED = 0
      GROUP BY P.PUBLISHER_ID, P.PUBLISHER_NAME
      ORDER BY SERIES_COUNT DESC, P.PUBLISHER_ID
    `);
    
    seriesCounts.forEach(p => {
      console.log(`Publisher ID ${p.PUBLISHER_ID} (${p.PUBLISHER_NAME}): ${p.SERIES_COUNT} series`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkPersonPublisher();
