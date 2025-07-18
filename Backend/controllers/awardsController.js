// controllers/awardsController.js
const pool = require('../db');

exports.getAllAwards = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT AWARD_ID, AWARD_NAME, AWARDING_BODY, IMG, DESCRIPTION FROM AWARD
    `);

    const awards = rows.map(a => ({
      AWARD_ID: a.AWARD_ID,
      AWARD_NAME: a.AWARD_NAME,
      AWARDING_BODY: a.AWARDING_BODY,
      IMG: a.IMG,
      DESCRIPTION: a.DESCRIPTION,
    }));

    res.json(awards);
  } catch (err) {
    console.error('Error fetching awards:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getAwardById = async (req, res) => {
  const awardId = req.params.id;

  try {
    const [[award]] = await pool.query(`
      SELECT AWARD_NAME, AWARDING_BODY, IMG, DESCRIPTION
      FROM AWARD
      WHERE AWARD_ID = ?
    `, [awardId]);

    if (!award) return res.status(404).json({ error: 'Award not found' });

    // Get shows that have won this award
    const [shows] = await pool.query(
      `SELECT s.SHOW_ID, s.TITLE, s.THUMBNAIL, sa.YEAR
       FROM \`SHOW\` s
       JOIN SHOW_AWARD sa ON s.SHOW_ID = sa.SHOW_ID
       WHERE sa.AWARD_ID = ?
       ORDER BY sa.YEAR DESC`,
      [awardId]
    );

    // Get actors that have won this award
    const [actors] = await pool.query(
      `SELECT a.ACTOR_ID, CONCAT(a.ACTOR_FIRSTNAME, ' ', a.ACTOR_LASTNAME) as NAME, 
              a.PICTURE, aa.YEAR, aa.DESCRIPTION
       FROM ACTOR a
       JOIN ACTOR_AWARD aa ON a.ACTOR_ID = aa.ACTOR_ID
       WHERE aa.AWARD_ID = ?
       ORDER BY aa.YEAR DESC`,
      [awardId]
    );

    // Get directors that have won this award
    const [directors] = await pool.query(
      `SELECT d.DIRECTOR_ID, CONCAT(d.DIRECTOR_FIRSTNAME, ' ', d.DIRECTOR_LASTNAME) as NAME,
              d.PICTURE, da.YEAR, da.DESCRIPTION
       FROM DIRECTOR d
       JOIN DIRECTOR_AWARD da ON d.DIRECTOR_ID = da.DIRECTOR_ID
       WHERE da.AWARD_ID = ?
       ORDER BY da.YEAR DESC`,
      [awardId]
    );

    res.json({
      AWARD_NAME: award.AWARD_NAME,
      AWARDING_BODY: award.AWARDING_BODY,
      IMG: award.IMG,
      DESCRIPTION: award.DESCRIPTION,
      SHOWS: shows,
      ACTORS: actors,
      DIRECTORS: directors
    });
  } catch (err) {
    console.error('Error fetching award:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
