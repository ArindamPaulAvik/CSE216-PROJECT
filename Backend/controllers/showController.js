// controllers/showController.js
const pool = require('../db');
const path = require('path');
const fs = require('fs').promises;

exports.getShowDetails = async (req, res) => {
  const showId = req.params.id;
  
  try {
    // Get basic show information with category, publisher, age restriction, and genres
    const [showRows] = await pool.query(`
      SELECT s.*,
             c.CATEGORY_NAME,
             p.PUBLISHER_NAME,
             a.AGE_RESTRICTION_NAME,
             st.STATUS_NAME,
             GROUP_CONCAT(DISTINCT g.GENRE_NAME SEPARATOR ', ') as GENRES,
             COUNT(DISTINCT fls.USER_ID) as FAVORITES_COUNT,
             COUNT(DISTINCT se.SHOW_EPISODE_ID) as TOTAL_EPISODES,
             s.WATCH_COUNT as TOTAL_VIEWS
      FROM \`SHOW\` s
      LEFT JOIN CATEGORY c ON s.CATEGORY_ID = c.CATEGORY_ID
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      LEFT JOIN AGE_RESTRICTION a ON s.AGE_RESTRICTION_ID = a.AGE_RESTRICTION_ID
      LEFT JOIN STATUS st ON s.STATUS_ID = st.STATUS_ID
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      LEFT JOIN FAV_LIST_SHOW fls ON s.SHOW_ID = fls.SHOW_ID
      LEFT JOIN SHOW_EPISODE se ON s.SHOW_ID = se.SHOW_ID
      WHERE s.SHOW_ID = ?
      GROUP BY s.SHOW_ID
      LIMIT 1
    `, [showId]);

    if (showRows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }

    // Get cast information for the show
    const [castRows] = await pool.query(`
      SELECT a.ACTOR_ID,
             a.ACTOR_FIRSTNAME,
             a.ACTOR_LASTNAME,
             a.BIOGRAPHY,
             a.PICTURE,
             sc.ROLE_NAME,
             sc.DESCRIPTION as ROLE_DESCRIPTION
      FROM SHOW_CAST sc
      JOIN ACTOR a ON sc.ACTOR_ID = a.ACTOR_ID
      WHERE sc.SHOW_ID = ?
      ORDER BY sc.ROLE_NAME
    `, [showId]);

    // Get episodes grouped by season (if it's a series)
    const [episodeRows] = await pool.query(`
      SELECT se.EPISODE_NUMBER,
             se.SHOW_EPISODE_TITLE,
             se.SHOW_EPISODE_DURATION,
             se.SHOW_EPISODE_RELEASE_DATE,
             se.SHOW_EPISODE_DESCRIPTION
      FROM SHOW_EPISODE se
      WHERE se.SHOW_ID = ?
      ORDER BY se.EPISODE_NUMBER
    `, [showId]);

    // Combine the results
    const showDetails = {
      ...showRows[0],
      CAST: castRows,
      EPISODES: episodeRows
    };

    res.json(showDetails);
  } catch (err) {
    console.error('Error fetching show:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getAllShows = async (req, res) => {
  try {
    const [showRows] = await pool.query(`
      SELECT s.SHOW_ID as id,
             s.TITLE as title,
             s.DESCRIPTION as description,
             s.THUMBNAIL as poster,
             s.RATING as rating,
             YEAR(s.RELEASE_DATE) as year,
             s.SEASON as seasons,
             st.STATUS_NAME as status,
             c.CATEGORY_NAME as category,
             p.PUBLISHER_NAME as publisher,
             a.AGE_RESTRICTION_NAME as age_restriction,
             GROUP_CONCAT(DISTINCT g.GENRE_NAME ORDER BY g.GENRE_NAME SEPARATOR ', ') as genre,
             COUNT(DISTINCT se.SHOW_EPISODE_ID) as episodes
      FROM \`SHOW\` s
      LEFT JOIN STATUS st ON s.STATUS_ID = st.STATUS_ID
      LEFT JOIN CATEGORY c ON s.CATEGORY_ID = c.CATEGORY_ID
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      LEFT JOIN AGE_RESTRICTION a ON s.AGE_RESTRICTION_ID = a.AGE_RESTRICTION_ID
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      LEFT JOIN SHOW_EPISODE se ON s.SHOW_ID = se.SHOW_ID
      GROUP BY s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING, s.RELEASE_DATE, s.SEASON, st.STATUS_NAME, c.CATEGORY_NAME, p.PUBLISHER_NAME, a.AGE_RESTRICTION_NAME
      ORDER BY s.TITLE ASC
    `);

    res.json(showRows);
  } catch (err) {
    console.error('Error fetching all shows:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all categories for dropdown
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT CATEGORY_ID, CATEGORY_NAME FROM CATEGORY ORDER BY CATEGORY_NAME');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all publishers for dropdown
exports.getPublishers = async (req, res) => {
  try {
    const [publishers] = await pool.query('SELECT PUBLISHER_ID, PUBLISHER_NAME FROM PUBLISHER ORDER BY PUBLISHER_NAME');
    res.json(publishers);
  } catch (err) {
    console.error('Error fetching publishers:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all statuses for dropdown
exports.getStatuses = async (req, res) => {
  try {
    const [statuses] = await pool.query('SELECT STATUS_ID, STATUS_NAME FROM STATUS ORDER BY STATUS_NAME');
    res.json(statuses);
  } catch (err) {
    console.error('Error fetching statuses:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all age restrictions for dropdown
exports.getAgeRestrictions = async (req, res) => {
  try {
    const [ageRestrictions] = await pool.query('SELECT AGE_RESTRICTION_ID, AGE_RESTRICTION_NAME FROM AGE_RESTRICTION ORDER BY AGE_RESTRICTION_NAME');
    res.json(ageRestrictions);
  } catch (err) {
    console.error('Error fetching age restrictions:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update show details
exports.updateShow = async (req, res) => {
  const showId = req.params.id;
  const {
    title,
    description,
    releaseDate,
    rating,
    duration,
    season,
    thumbnail,
    banner,
    categoryId,
    publisherId,
    statusId,
    ageRestrictionId
  } = req.body;

  try {
    // Build dynamic update query based on provided fields
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('TITLE = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('DESCRIPTION = ?');
      updateValues.push(description);
    }
    if (releaseDate !== undefined) {
      updateFields.push('RELEASE_DATE = ?');
      updateValues.push(releaseDate || null);
    }
    if (rating !== undefined) {
      updateFields.push('RATING = ?');
      updateValues.push(rating || null);
    }
    if (season !== undefined) {
      updateFields.push('SEASON = ?');
      updateValues.push(season || null);
    }
    if (thumbnail !== undefined) {
      updateFields.push('THUMBNAIL = ?');
      updateValues.push(thumbnail);
    }
    if (banner !== undefined) {
      updateFields.push('BANNER = ?');
      updateValues.push(banner);
    }
    if (categoryId !== undefined) {
      updateFields.push('CATEGORY_ID = ?');
      updateValues.push(categoryId || null);
    }
    if (publisherId !== undefined) {
      updateFields.push('PUBLISHER_ID = ?');
      updateValues.push(publisherId || null);
    }
    if (statusId !== undefined) {
      updateFields.push('STATUS_ID = ?');
      updateValues.push(statusId || null);
    }
    if (ageRestrictionId !== undefined) {
      updateFields.push('AGE_RESTRICTION_ID = ?');
      updateValues.push(ageRestrictionId || null);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add the show ID to the end of values array
    updateValues.push(showId);

    const updateQuery = `UPDATE \`SHOW\` SET ${updateFields.join(', ')} WHERE SHOW_ID = ?`;
    
    await pool.query(updateQuery, updateValues);

    res.json({ message: 'Show updated successfully' });
  } catch (err) {
    console.error('Error updating show:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Upload show thumbnail
exports.uploadThumbnail = async (req, res) => {
  const showId = req.params.id;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = req.file.filename;
    
    // Update the database with the new thumbnail filename
    await pool.query('UPDATE `SHOW` SET THUMBNAIL = ? WHERE SHOW_ID = ?', [filename, showId]);
    
    res.json({ 
      message: 'Thumbnail uploaded successfully',
      filename: filename,
      path: `/shows/${filename}`
    });
  } catch (err) {
    console.error('Error uploading thumbnail:', err);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    }
    res.status(500).json({ error: 'Failed to upload thumbnail' });
  }
};

// Upload show banner
exports.uploadBanner = async (req, res) => {
  const showId = req.params.id;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = req.file.filename;
    
    // Update the database with the new banner filename
    await pool.query('UPDATE `SHOW` SET BANNER = ? WHERE SHOW_ID = ?', [filename, showId]);
    
    res.json({ 
      message: 'Banner uploaded successfully',
      filename: filename,
      path: `/banners/${filename}`
    });
  } catch (err) {
    console.error('Error uploading banner:', err);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    }
    res.status(500).json({ error: 'Failed to upload banner' });
  }
};