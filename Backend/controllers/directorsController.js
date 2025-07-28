const pool = require('../db');

// Get all directors with show count from filmography
exports.getAllDirectors = async (req, res) => {
  try {
    const [directors] = await pool.query(`
      SELECT 
        d.DIRECTOR_ID,
        d.DIRECTOR_FIRSTNAME,
        d.DIRECTOR_LASTNAME,
        d.BIOGRAPHY,
        d.PICTURE,
        COUNT(DISTINCT sd.SHOW_ID) as SHOW_COUNT
      FROM DIRECTOR d
      LEFT JOIN SHOW_DIRECTOR sd ON d.DIRECTOR_ID = sd.DIRECTOR_ID
      GROUP BY d.DIRECTOR_ID, d.DIRECTOR_FIRSTNAME, d.DIRECTOR_LASTNAME, d.BIOGRAPHY, d.PICTURE
      ORDER BY d.DIRECTOR_FIRSTNAME, d.DIRECTOR_LASTNAME
    `);
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
        s.RATING,
        s.RELEASE_DATE,
        s.REMOVED,
        GROUP_CONCAT(g.GENRE_NAME SEPARATOR ', ') AS GENRES,
        s.DESCRIPTION,
        s.RELEASE_DATE,
        c.CATEGORY_NAME
      FROM DIRECTOR d
      LEFT JOIN SHOW_DIRECTOR sd ON d.DIRECTOR_ID = sd.DIRECTOR_ID
      LEFT JOIN SHOWS s ON sd.SHOW_ID = s.SHOW_ID
      LEFT JOIN CATEGORY c ON s.CATEGORY_ID = c.CATEGORY_ID
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      WHERE d.DIRECTOR_ID = ?
      GROUP BY s.SHOW_ID, d.DIRECTOR_ID, d.DIRECTOR_FIRSTNAME, d.DIRECTOR_LASTNAME, d.BIOGRAPHY, d.PICTURE, s.TITLE, s.THUMBNAIL, s.RATING, s.RELEASE_DATE, s.DESCRIPTION, s.RELEASE_DATE, c.CATEGORY_NAME, s.REMOVED
      ORDER BY s.RELEASE_DATE DESC
    `, [directorId]);

    if (!rows.length) {
      // Try to fetch just the director (no shows at all)
      const [directorRows] = await pool.query(
        'SELECT DIRECTOR_ID, DIRECTOR_FIRSTNAME, DIRECTOR_LASTNAME, BIOGRAPHY, PICTURE FROM DIRECTOR WHERE DIRECTOR_ID = ?',
        [directorId]
      );
      if (!directorRows.length) {
        return res.status(404).json({ error: 'Director not found' });
      }
      const director = {
        DIRECTOR_ID: directorRows[0].DIRECTOR_ID,
        DIRECTOR_FIRSTNAME: directorRows[0].DIRECTOR_FIRSTNAME,
        DIRECTOR_LASTNAME: directorRows[0].DIRECTOR_LASTNAME,
        DIRECTOR_NAME: directorRows[0].DIRECTOR_FIRSTNAME + ' ' + directorRows[0].DIRECTOR_LASTNAME,
        BIO: directorRows[0].BIOGRAPHY,
        PICTURE: directorRows[0].PICTURE,
        SHOWS: []
      };
      return res.json(director);
    }

    // Group shows
    const director = {
      DIRECTOR_ID: rows[0].DIRECTOR_ID,
      DIRECTOR_FIRSTNAME: rows[0].DIRECTOR_FIRSTNAME,
      DIRECTOR_LASTNAME: rows[0].DIRECTOR_LASTNAME,
      DIRECTOR_NAME: rows[0].DIRECTOR_FIRSTNAME + ' ' + rows[0].DIRECTOR_LASTNAME,
      BIO: rows[0].BIOGRAPHY,
      PICTURE: rows[0].PICTURE,
      SHOWS: []
    };
    for (const row of rows) {
      if (row.SHOW_ID && row.REMOVED === 0) {
        director.SHOWS.push({
          SHOW_ID: row.SHOW_ID,
          TITLE: row.TITLE,
          THUMBNAIL: row.THUMBNAIL,
          RATING: row.RATING,
          RELEASE_DATE: row.RELEASE_DATE,
          GENRES: row.GENRES,
          DESCRIPTION: row.DESCRIPTION,
          CATEGORY_NAME: row.CATEGORY_NAME
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
      `SELECT s.* FROM SHOWS s
       JOIN SHOW_DIRECTOR sd ON s.SHOW_ID = sd.SHOW_ID
       WHERE sd.DIRECTOR_ID = ? AND s.REMOVED = 0`,
      [directorId]
    );
    res.json(shows);
  } catch (err) {
    console.error('Error fetching shows for director:', err);
    res.status(500).json({ error: 'Failed to fetch shows for director' });
  }
};

// Create a new director
exports.createDirector = async (req, res) => {
  try {
    const { firstName, lastName, biography } = req.body;
    const picture = req.file ? req.file.filename : null;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO DIRECTOR (DIRECTOR_FIRSTNAME, DIRECTOR_LASTNAME, BIOGRAPHY, PICTURE) VALUES (?, ?, ?, ?)',
      [firstName, lastName, biography || null, picture]
    );

    const [newDirector] = await pool.query(
      'SELECT * FROM DIRECTOR WHERE DIRECTOR_ID = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Director created successfully',
      director: newDirector[0]
    });
  } catch (err) {
    console.error('Error creating director:', err);
    res.status(500).json({ error: 'Failed to create director' });
  }
};

// Update an existing director
exports.updateDirector = async (req, res) => {
  try {
    const directorId = req.params.directorId;
    const { firstName, lastName, biography } = req.body;
    const picture = req.file ? req.file.filename : null;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    // Build the update query dynamically
    let updateQuery = 'UPDATE DIRECTOR SET DIRECTOR_FIRSTNAME = ?, DIRECTOR_LASTNAME = ?, BIOGRAPHY = ?';
    let updateValues = [firstName, lastName, biography || null];

    if (picture) {
      updateQuery += ', PICTURE = ?';
      updateValues.push(picture);
    }

    updateQuery += ' WHERE DIRECTOR_ID = ?';
    updateValues.push(directorId);

    const [result] = await pool.query(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Director not found' });
    }

    const [updatedDirector] = await pool.query(
      'SELECT * FROM DIRECTOR WHERE DIRECTOR_ID = ?',
      [directorId]
    );

    res.json({
      message: 'Director updated successfully',
      director: updatedDirector[0]
    });
  } catch (err) {
    console.error('Error updating director:', err);
    res.status(500).json({ error: 'Failed to update director' });
  }
};

// Delete a director
exports.deleteDirector = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const directorId = req.params.directorId;

    // Start transaction
    await connection.beginTransaction();

    // First check if director exists
    const [director] = await connection.query(
      'SELECT * FROM DIRECTOR WHERE DIRECTOR_ID = ?',
      [directorId]
    );

    if (director.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Director not found' });
    }

    // Delete all related records in the correct order
    // 1. Delete director-award relationships
    await connection.query(
      'DELETE FROM DIRECTOR_AWARD WHERE DIRECTOR_ID = ?',
      [directorId]
    );

    // 2. Delete director-show relationships
    await connection.query(
      'DELETE FROM SHOW_DIRECTOR WHERE DIRECTOR_ID = ?',
      [directorId]
    );

    // 3. Finally delete the director
    await connection.query(
      'DELETE FROM DIRECTOR WHERE DIRECTOR_ID = ?',
      [directorId]
    );

    // Commit transaction
    await connection.commit();
    
    res.json({ message: 'Director deleted successfully' });
  } catch (err) {
    // Rollback transaction on error
    await connection.rollback();
    console.error('Error deleting director:', err);
    res.status(500).json({ error: 'Failed to delete director', details: err.message });
  } finally {
    connection.release();
  }
};
