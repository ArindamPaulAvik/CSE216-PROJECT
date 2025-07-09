// controllers/favoritesController.js
const pool = require('../db');

exports.toggleFavorite = async (req, res) => {
  const userEmail = req.user.email;
  const showId = req.params.showId;

  try {
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
      LIMIT 1
    `, [userEmail]);

    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const userId = userRows[0].USER_ID;

    const [rows] = await pool.query(
      'SELECT * FROM FAV_LIST_SHOW WHERE USER_ID = ? AND SHOW_ID = ?',
      [userId, showId]
    );

    if (rows.length > 0) {
      await pool.query(
        'DELETE FROM FAV_LIST_SHOW WHERE USER_ID = ? AND SHOW_ID = ?',
        [userId, showId]
      );
      return res.json({ favorite: false });
    } else {
      await pool.query(
        'INSERT INTO FAV_LIST_SHOW (USER_ID, SHOW_ID, ADD_DATE, WATCHED) VALUES (?, ?, CURDATE(), 0)',
        [userId, showId]
      );
      return res.json({ favorite: true });
    }
  } catch (err) {
    console.error('Favorite toggle error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
};

exports.getFavorites = async (req, res) => {
  const userEmail = req.user.email;

  try {
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
      LIMIT 1
    `, [userEmail]);

    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const userId = userRows[0].USER_ID;

    const [favorites] = await pool.query(`
      SELECT s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING,
             GROUP_CONCAT(g.GENRE_NAME SEPARATOR ', ') AS GENRES
      FROM FAV_LIST_SHOW f
      JOIN \`SHOW\` s ON f.SHOW_ID = s.SHOW_ID
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      WHERE f.USER_ID = ?
      GROUP BY s.SHOW_ID
      ORDER BY f.ADD_DATE DESC
    `, [userId]);

    res.json({ favorites });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.checkFavorite = async (req, res) => {
  const userEmail = req.user.email;
  const showId = req.params.showId;

  try {
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
      LIMIT 1
    `, [userEmail]);

    if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

    const userId = userRows[0].USER_ID;

    const [rows] = await pool.query(
      'SELECT * FROM FAV_LIST_SHOW WHERE USER_ID = ? AND SHOW_ID = ?',
      [userId, showId]
    );

    res.json({ favorite: rows.length > 0 });
  } catch (err) {
    console.error('Error checking favorite status:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
