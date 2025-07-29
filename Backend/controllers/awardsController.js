const pool = require('../db');
const fs = require('fs');
const path = require('path');

// Get all awards with optional search
exports.getAllAwards = async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = `
      SELECT 
        a.AWARD_ID,
        a.AWARD_NAME,
        a.AWARDING_BODY,
        a.IMG,
        a.DESCRIPTION,
        (
          SELECT COUNT(*)
          FROM (
            SELECT aa.ACTOR_ID as recipient_id FROM ACTOR_AWARD aa WHERE aa.AWARD_ID = a.AWARD_ID
            UNION ALL
            SELECT da.DIRECTOR_ID as recipient_id FROM DIRECTOR_AWARD da WHERE da.AWARD_ID = a.AWARD_ID
            UNION ALL
            SELECT sa.SHOW_ID as recipient_id FROM SHOW_AWARD sa WHERE sa.AWARD_ID = a.AWARD_ID
          ) all_recipients
        ) as RECIPIENT_COUNT
      FROM AWARD a
    `;
    
    const params = [];
    
    if (search) {
      query += ' WHERE a.AWARD_NAME LIKE ? OR a.AWARDING_BODY LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY a.AWARD_NAME';
    
    const [results] = await pool.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error fetching awards:', error);
    res.status(500).json({ message: 'Failed to fetch awards' });
  }
};

// Get award by ID with recipients
exports.getAwardById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get award details
    const awardQuery = `
      SELECT 
        AWARD_ID,
        AWARD_NAME,
        AWARDING_BODY,
        IMG,
        DESCRIPTION
      FROM AWARD 
      WHERE AWARD_ID = ?
    `;
    
    const [awardResults] = await pool.execute(awardQuery, [id]);
    
    if (awardResults.length === 0) {
      return res.status(404).json({ message: 'Award not found' });
    }
    
    const award = awardResults[0];
    
    // Get actor recipients
    const actorQuery = `
      SELECT 
        a.ACTOR_ID,
        CONCAT(a.ACTOR_FIRSTNAME, ' ', a.ACTOR_LASTNAME) as NAME,
        a.PICTURE,
        aa.YEAR
      FROM ACTOR a
      INNER JOIN ACTOR_AWARD aa ON a.ACTOR_ID = aa.ACTOR_ID
      WHERE aa.AWARD_ID = ?
      ORDER BY a.ACTOR_FIRSTNAME, a.ACTOR_LASTNAME
    `;
    
    const [actorResults] = await pool.execute(actorQuery, [id]);
    
    // Get director recipients
    const directorQuery = `
      SELECT 
        d.DIRECTOR_ID,
        CONCAT(d.DIRECTOR_FIRSTNAME, ' ', d.DIRECTOR_LASTNAME) as NAME,
        d.PICTURE,
        da.YEAR
      FROM DIRECTOR d
      INNER JOIN DIRECTOR_AWARD da ON d.DIRECTOR_ID = da.DIRECTOR_ID
      WHERE da.AWARD_ID = ?
      ORDER BY d.DIRECTOR_FIRSTNAME, d.DIRECTOR_LASTNAME
    `;
    
    const [directorResults] = await pool.execute(directorQuery, [id]);
    
    // Get show recipients
    const showQuery = `
      SELECT 
        s.SHOW_ID,
        s.TITLE,
        s.RATING,
        s.THUMBNAIL,
        sa.YEAR
      FROM SHOWS s
      INNER JOIN SHOW_AWARD sa ON s.SHOW_ID = sa.SHOW_ID
      WHERE sa.AWARD_ID = ? AND s.REMOVED = 0
      ORDER BY s.TITLE
    `;
    
    const [showResults] = await pool.execute(showQuery, [id]);
    
    // Combine all data
    const response = {
      ...award,
      ACTORS: actorResults,
      DIRECTORS: directorResults,
      SHOWS: showResults
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching award by ID:', error);
    res.status(500).json({ message: 'Failed to fetch award details' });
  }
};

// Create new award
exports.createAward = async (req, res) => {
  try {
    const { name, awardingBody, description } = req.body;
    
    if (!name || !awardingBody || !description) {
      return res.status(400).json({ 
        message: 'Award name, awarding body, and description are required' 
      });
    }

    let imageName = null;
    
    // Handle image upload
    if (req.file) {
      imageName = req.file.filename;
    }

    const query = `
      INSERT INTO AWARD (AWARD_NAME, AWARDING_BODY, DESCRIPTION, IMG)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      name,
      awardingBody,
      description,
      imageName
    ]);

    res.status(201).json({
      message: 'Award created successfully',
      awardId: result.insertId
    });
  } catch (error) {
    console.error('Error creating award:', error);
    
    // Clean up uploaded file if database insertion fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Failed to create award' });
  }
};

// Update award
exports.updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, awardingBody, description } = req.body;
    
    if (!name || !awardingBody || !description) {
      return res.status(400).json({ 
        message: 'Award name, awarding body, and description are required' 
      });
    }

    // Check if award exists
    const checkQuery = 'SELECT * FROM AWARD WHERE AWARD_ID = ?';
    const [existingAward] = await pool.execute(checkQuery, [id]);
    
    if (existingAward.length === 0) {
      // Clean up uploaded file if award doesn't exist
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Award not found' });
    }

    let updateQuery = `
      UPDATE AWARD 
      SET AWARD_NAME = ?, AWARDING_BODY = ?, DESCRIPTION = ?
    `;
    let params = [name, awardingBody, description];

    // Handle image upload
    if (req.file) {
      const oldImage = existingAward[0].IMG;
      
      // Delete old image if it exists (from frontend/public/awards)
      if (oldImage) {
        const oldImagePath = path.join(__dirname, '../../frontend/public/awards', oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      updateQuery += ', IMG = ?';
      params.push(req.file.filename);
    }

    updateQuery += ' WHERE AWARD_ID = ?';
    params.push(id);

    await pool.execute(updateQuery, params);

    res.json({ message: 'Award updated successfully' });
  } catch (error) {
    console.error('Error updating award:', error);
    
    // Clean up uploaded file if database update fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Failed to update award' });
  }
};

// Delete award
exports.deleteAward = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;

    // Start transaction
    await connection.beginTransaction();

    try {
      // Get award details to delete image
      const awardQuery = 'SELECT IMG FROM AWARD WHERE AWARD_ID = ?';
      const [awardResults] = await connection.execute(awardQuery, [id]);
      
      if (awardResults.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Award not found' });
      }

      // Delete related records first (foreign key constraints)
      
      // Delete actor award associations
      await connection.execute('DELETE FROM ACTOR_AWARD WHERE AWARD_ID = ?', [id]);
      
      // Delete director award associations
      await connection.execute('DELETE FROM DIRECTOR_AWARD WHERE AWARD_ID = ?', [id]);
      
      // Delete show award associations
      await connection.execute('DELETE FROM SHOW_AWARD WHERE AWARD_ID = ?', [id]);

      // Delete the award
      await connection.execute('DELETE FROM AWARD WHERE AWARD_ID = ?', [id]);

      // Commit transaction
      await connection.commit();

      // Delete image file if it exists (from frontend/public/awards)
      const imageName = awardResults[0].IMG;
      if (imageName) {
        const imagePath = path.join(__dirname, '../../frontend/public/awards', imageName);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.json({ message: 'Award deleted successfully' });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting award:', error);
    res.status(500).json({ message: 'Failed to delete award' });
  } finally {
    connection.release();
  }
};
