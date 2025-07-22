// controllers/actorsController.js
const pool = require('../db');
const fs = require('fs');
const path = require('path');

// Helper function to convert image to JPG
const convertToJpg = async (inputPath, outputPath) => {
  try {
    // For now, if the file is not already jpg, we'll rename it
    // In production, you might want to use sharp library for actual conversion
    const ext = path.extname(inputPath).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg') {
      // Copy file with .jpg extension
      fs.copyFileSync(inputPath, outputPath);
      // Remove original file
      fs.unlinkSync(inputPath);
      return path.basename(outputPath);
    }
    return path.basename(inputPath);
  } catch (error) {
    console.error('Error converting image:', error);
    return path.basename(inputPath);
  }
};

exports.getAllActors = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.ACTOR_ID, 
        a.ACTOR_FIRSTNAME, 
        a.ACTOR_LASTNAME, 
        a.PICTURE, 
        a.BIOGRAPHY,
        COUNT(sc.SHOW_ID) as SHOW_COUNT
      FROM ACTOR a
      LEFT JOIN SHOW_CAST sc ON a.ACTOR_ID = sc.ACTOR_ID
      GROUP BY a.ACTOR_ID, a.ACTOR_FIRSTNAME, a.ACTOR_LASTNAME, a.PICTURE, a.BIOGRAPHY
    `);

    const actors = rows.map(a => ({
      ACTOR_ID: a.ACTOR_ID,
      NAME: a.ACTOR_FIRSTNAME + ' ' + a.ACTOR_LASTNAME,
      PICTURE: a.PICTURE,
      BIOGRAPHY: a.BIOGRAPHY,
      SHOW_COUNT: a.SHOW_COUNT
    }));

    res.json(actors);
  } catch (err) {
    console.error('Error fetching actors:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getActorById = async (req, res) => {
  const actorId = req.params.id;

  try {
    const [[actor]] = await pool.query(`
      SELECT ACTOR_FIRSTNAME, ACTOR_LASTNAME, BIOGRAPHY, PICTURE
      FROM ACTOR
      WHERE ACTOR_ID = ?
    `, [actorId]);

    if (!actor) return res.status(404).json({ error: 'Actor not found' });

    const [shows] = await pool.query(
      `SELECT s.SHOW_ID, s.TITLE, s.THUMBNAIL
       FROM \`SHOW\` s
       JOIN SHOW_CAST sa ON s.SHOW_ID = sa.SHOW_ID
       WHERE sa.ACTOR_ID = ?`,
      [actorId]
    );

    res.json({
      NAME: actor.ACTOR_FIRSTNAME + ' ' + actor.ACTOR_LASTNAME,
      BIOGRAPHY: actor.BIOGRAPHY,
      PICTURE: actor.PICTURE,
      SHOWS: shows
    });
  } catch (err) {
    console.error('Error fetching actor:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Admin-specific endpoints
exports.createActor = async (req, res) => {
  const { firstName, lastName, biography } = req.body;
  let picture = null;

  try {
    if (req.file) {
      const originalPath = req.file.path;
      const ext = path.extname(req.file.filename);
      
      if (ext.toLowerCase() !== '.jpg') {
        // Convert to JPG
        const jpgFilename = path.basename(req.file.filename, ext) + '.jpg';
        const jpgPath = path.join(path.dirname(originalPath), jpgFilename);
        picture = await convertToJpg(originalPath, jpgPath);
      } else {
        picture = req.file.filename;
      }
    }

    const [result] = await pool.query(`
      INSERT INTO ACTOR (ACTOR_FIRSTNAME, ACTOR_LASTNAME, BIOGRAPHY, PICTURE)
      VALUES (?, ?, ?, ?)
    `, [firstName, lastName, biography, picture]);

    res.status(201).json({
      message: 'Actor created successfully',
      actorId: result.insertId
    });
  } catch (err) {
    console.error('Error creating actor:', err);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateActor = async (req, res) => {
  const actorId = req.params.id;
  const { firstName, lastName, biography } = req.body;
  let picture = null;

  try {
    // Check if actor exists
    const [[existingActor]] = await pool.query(
      'SELECT ACTOR_ID, PICTURE FROM ACTOR WHERE ACTOR_ID = ?',
      [actorId]
    );

    if (!existingActor) {
      // Clean up uploaded file if actor doesn't exist
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Actor not found' });
    }

    if (req.file) {
      const originalPath = req.file.path;
      const ext = path.extname(req.file.filename);
      
      if (ext.toLowerCase() !== '.jpg') {
        // Convert to JPG
        const jpgFilename = path.basename(req.file.filename, ext) + '.jpg';
        const jpgPath = path.join(path.dirname(originalPath), jpgFilename);
        picture = await convertToJpg(originalPath, jpgPath);
      } else {
        picture = req.file.filename;
      }

      // Delete old picture if it exists
      if (existingActor.PICTURE) {
        const oldPicturePath = path.join(__dirname, '../../frontend/public/actors', existingActor.PICTURE);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }
    }

    // Build update query dynamically
    let updateQuery = 'UPDATE ACTOR SET ACTOR_FIRSTNAME = ?, ACTOR_LASTNAME = ?, BIOGRAPHY = ?';
    let queryParams = [firstName, lastName, biography];

    if (picture) {
      updateQuery += ', PICTURE = ?';
      queryParams.push(picture);
    }

    updateQuery += ' WHERE ACTOR_ID = ?';
    queryParams.push(actorId);

    await pool.query(updateQuery, queryParams);

    res.json({ message: 'Actor updated successfully' });
  } catch (err) {
    console.error('Error updating actor:', err);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Database error' });
  }
};

exports.deleteActor = async (req, res) => {
  const actorId = req.params.id;

  try {
    // Check if actor exists and get picture filename
    const [[existingActor]] = await pool.query(
      'SELECT ACTOR_ID, PICTURE FROM ACTOR WHERE ACTOR_ID = ?',
      [actorId]
    );

    if (!existingActor) {
      return res.status(404).json({ error: 'Actor not found' });
    }

    // Delete related records first (if needed)
    await pool.query('DELETE FROM SHOW_CAST WHERE ACTOR_ID = ?', [actorId]);
    
    // Delete the actor
    await pool.query('DELETE FROM ACTOR WHERE ACTOR_ID = ?', [actorId]);

    // Delete the picture file if it exists
    if (existingActor.PICTURE) {
      const picturePath = path.join(__dirname, '../../frontend/public/actors', existingActor.PICTURE);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    }

    res.json({ message: 'Actor deleted successfully' });
  } catch (err) {
    console.error('Error deleting actor:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
