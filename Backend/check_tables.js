const pool = require('./db');

async function checkTables() {
  try {
    console.log('Checking PERSON table structure...');
    const [personColumns] = await pool.query('DESCRIBE PERSON');
    console.log('PERSON table columns:', personColumns);
    
    console.log('\nChecking PUBLISHER-PERSON relationship...');
    const [publisherPersons] = await pool.query(`
      SELECT P.PUBLISHER_ID, P.PUBLISHER_NAME, P.PERSON_ID, PE.EMAIL
      FROM PUBLISHER P
      JOIN PERSON PE ON P.PERSON_ID = PE.PERSON_ID
      WHERE P.IS_ACTIVE = 1
      ORDER BY P.PUBLISHER_ID
    `);
    
    console.log('Publisher-Person relationships:');
    publisherPersons.forEach(p => {
      console.log(`Publisher ID ${p.PUBLISHER_ID} (${p.PUBLISHER_NAME}): Person ID ${p.PERSON_ID}, Email: ${p.EMAIL}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkTables();
