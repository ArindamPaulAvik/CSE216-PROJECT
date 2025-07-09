// controllers/showController.js
const pool = require('../db');

exports.getShowDetails = async (req, res) => {
  const showId = req.params.id;

  try {
    const [rows] = await pool.query(`
      SELECT s.*, 
             c.CATEGORY_NAME,
             p.PUBLISHER_NAME,
             a.AGE_RESTRICTION_NAME,
             GROUP_CONCAT(g.GENRE_NAME SEPARATOR ', ') as GENRES
      FROM \`SHOW\` s
      LEFT JOIN CATEGORY c ON s.CATEGORY_ID = c.CATEGORY_ID
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      LEFT JOIN AGE_RESTRICTION a ON s.AGE_RESTRICTION_ID = a.AGE_RESTRICTION_ID
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      WHERE s.SHOW_ID = ?
      GROUP BY s.SHOW_ID
      LIMIT 1
    `, [showId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching show:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
