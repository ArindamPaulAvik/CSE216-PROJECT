const pool = require('../db');

// Get all directors
exports.getAllDirectors = async (req, res) => {
  try {
    const [directors] = await pool.query('SELECT * FROM DIRECTOR');
    res.json(directors);
  } catch (err) {
    console.error('Error fetching directors:', err);
    res.status(500).json({ error: 'Failed to fetch directors' });
  }
};

// Get a single director by ID, including their shows
exports.getDirectorById = async (req, res) => {
  const directorId = req.params.directorId;
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.DIRECTOR_ID, 
        d.DIRECTOR_FIRSTNAME,
        d.DIRECTOR_LASTNAME,
        d.BIOGRAPHY, 
        d.PICTURE,
        s.SHOW_ID, 
        s.TITLE, 
        s.THUMBNAIL, 
        s.RATING
      FROM DIRECTOR d
      LEFT JOIN SHOW_DIRECTOR sd ON d.DIRECTOR_ID = sd.DIRECTOR_ID
      LEFT JOIN \`SHOW\` s ON sd.SHOW_ID = s.SHOW_ID
      WHERE d.DIRECTOR_ID = ?
    `, [directorId]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Director not found' });
    }

    // Group shows
    const director = {
      DIRECTOR_ID: rows[0].DIRECTOR_ID,
      DIRECTOR_NAME: rows[0].DIRECTOR_FIRSTNAME + ' ' + rows[0].DIRECTOR_LASTNAME,
      BIO: rows[0].BIOGRAPHY,
      PICTURE: rows[0].PICTURE,
      SHOWS: []
    };
    for (const row of rows) {
      if (row.SHOW_ID) {
        director.SHOWS.push({
          SHOW_ID: row.SHOW_ID,
          TITLE: row.TITLE,
          THUMBNAIL: row.THUMBNAIL,
          RATING: row.RATING
        });
      }
    }
    res.json(director);
  } catch (err) {
    console.error('Error fetching director:', err);
    res.status(500).json({ error: 'Failed to fetch director' });
  }
};

// Get all shows for a director
exports.getShowsByDirector = async (req, res) => {
  const directorId = req.params.directorId;
  try {
    const [shows] = await pool.query(
      `SELECT s.* FROM \`SHOW\` s
       JOIN SHOW_DIRECTOR sd ON s.SHOW_ID = sd.SHOW_ID
       WHERE sd.DIRECTOR_ID = ?`,
      [directorId]
    );
    res.json(shows);
  } catch (err) {
    console.error('Error fetching shows for director:', err);
    res.status(500).json({ error: 'Failed to fetch shows for director' });
  }
};
