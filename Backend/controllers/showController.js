// controllers/showController.js
const pool = require('../db');
const path = require('path');
const fs = require('fs').promises;

exports.getShowDetails = async (req, res) => {
  const showId = req.params.id;
  console.log('🎬 Fetching show details for ID:', showId);
  
  try {
    // Get basic show information with category, publisher, age restriction, and genres
    const [showRows] = await pool.query(`
      SELECT s.*,
             c.CATEGORY_NAME,
             p.PUBLISHER_NAME,
             a.AGE_RESTRICTION_NAME,
             st.STATUS_NAME,ss
             GROUP_CONCAT(DISTINCT g.GENRE_NAME SEPARATOR ', ') as GENRES,
             COUNT(DISTINCT fls.USER_ID) as FAVORITES_COUNT,
             COUNT(DISTINCT se.SHOW_EPISODE_ID) as TOTAL_EPISODES,
             s.WATCH_COUNT as TOTAL_VIEWS,
             CASE 
               WHEN COUNT(DISTINCT se.SHOW_EPISODE_ID) = 1 THEN 
                 CONCAT(MIN(se.SHOW_EPISODE_DURATION), ' min')
               WHEN COUNT(DISTINCT se.SHOW_EPISODE_ID) > 1 THEN 
                 CONCAT(COUNT(DISTINCT se.SHOW_EPISODE_ID), ' episodes')
               ELSE 'N/A'
             END as DURATION_DISPLAY
      FROM SHOWS s
      LEFT JOIN CATEGORY c ON s.CATEGORY_ID = c.CATEGORY_ID
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      LEFT JOIN AGE_RESTRICTION a ON s.AGE_RESTRICTION_ID = a.AGE_RESTRICTION_ID
      LEFT JOIN STATUS st ON s.STATUS_ID = st.STATUS_ID
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      LEFT JOIN FAV_LIST_SHOW fls ON s.SHOW_ID = fls.SHOW_ID
      LEFT JOIN SHOW_EPISODE se ON s.SHOW_ID = se.SHOW_ID
      WHERE s.SHOW_ID = ? AND s.REMOVED = 0
      GROUP BY s.SHOW_ID
      LIMIT 1
    `, [showId]);

    if (showRows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }

    // Get cast information for the show
    let castRows = [];
    try {
      const [cast] = await pool.query(`
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
      castRows = cast;
    } catch (castError) {
      console.error('Error fetching cast:', castError);
      castRows = [];
    }

    // Get directors information for the show
    let directorsRows = [];
    try {
      const [directors] = await pool.query(`
        SELECT d.DIRECTOR_ID,
               d.DIRECTOR_FIRSTNAME,
               d.DIRECTOR_LASTNAME,
               d.BIOGRAPHY,
               d.PICTURE as IMAGE
        FROM SHOW_DIRECTOR sd
        JOIN DIRECTOR d ON sd.DIRECTOR_ID = d.DIRECTOR_ID
        WHERE sd.SHOW_ID = ?
        ORDER BY d.DIRECTOR_FIRSTNAME, d.DIRECTOR_LASTNAME
      `, [showId]);
      
      // Format the directors data with concatenated names (like directorsController)
      directorsRows = directors.map(director => ({
        ...director,
        DIRECTOR_NAME: director.DIRECTOR_FIRSTNAME + ' ' + director.DIRECTOR_LASTNAME
      }));
      
      console.log('🎭 Directors query result for show', showId, ':', directorsRows.length, 'directors found');
    } catch (directorError) {
      console.error('Error fetching directors:', directorError);
      directorsRows = [];
    }

    // Get similar shows based on genres (fixed implementation)
    let similarShowsRows = [];
    try {
      console.log('🎭 Debug - Starting similar shows query for show ID:', showId);
      
      // First, get the genres of the current show
      const [currentShowGenres] = await pool.query(`
        SELECT DISTINCT g.GENRE_NAME
        FROM SHOW_GENRE sg
        INNER JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
        WHERE sg.SHOW_ID = ?
      `, [showId]);
      
      console.log('🎭 Debug - Current show genres:', currentShowGenres);
      
      if (currentShowGenres.length > 0) {
        const genreNames = currentShowGenres.map(row => row.GENRE_NAME);
        console.log('🎭 Debug - Genre names array:', genreNames);
        
        // Create placeholders for the IN clause
        const placeholders = genreNames.map(() => '?').join(',');
        
        // Query for shows with matching genres (similar to searchController)
        const [similarShows] = await pool.query(`
          SELECT DISTINCT s.SHOW_ID,
                 s.TITLE,
                 s.DESCRIPTION,
                 s.THUMBNAIL,
                 s.RATING,
                 s.RELEASE_DATE,
                 s.TEASER,
                 CASE 
                   WHEN COUNT(DISTINCT se.SHOW_EPISODE_ID) = 1 THEN 
                     CONCAT(MIN(se.SHOW_EPISODE_DURATION), ' min')
                   WHEN COUNT(DISTINCT se.SHOW_EPISODE_ID) > 1 THEN 
                     CONCAT(COUNT(DISTINCT se.SHOW_EPISODE_ID), ' episodes')
                   ELSE 'N/A'
                 END as DURATION
          FROM SHOWS s
          INNER JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
          INNER JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
          LEFT JOIN SHOW_EPISODE se ON s.SHOW_ID = se.SHOW_ID
          WHERE g.GENRE_NAME IN (${placeholders})
          AND s.SHOW_ID != ?
          AND s.REMOVED = 0
          GROUP BY s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING, s.RELEASE_DATE, s.TEASER
          ORDER BY s.RATING DESC
          LIMIT 8
        `, [...genreNames, showId]);
        
        console.log('🎭 Debug - Similar shows query returned:', similarShows.length, 'shows');
        
        // Format the results
        similarShowsRows = similarShows.map(show => ({
          ...show,
          YEAR: show.RELEASE_DATE ? new Date(show.RELEASE_DATE).getFullYear() : null,
          IS_FAVORITE: false
        }));
        
        console.log('🎬 Final similar shows data:', similarShowsRows);
      } else {
        console.log('🎬 No genres found for show', showId);
        // Fallback to top-rated shows if no genres found
        const [fallbackShows] = await pool.query(`
          SELECT s.SHOW_ID, 
                 s.TITLE, 
                 s.DESCRIPTION, 
                 s.THUMBNAIL, 
                 s.RATING, 
                 s.RELEASE_DATE, 
                 s.TEASER,
                 CASE 
                   WHEN COUNT(DISTINCT se.SHOW_EPISODE_ID) = 1 THEN 
                     CONCAT(MIN(se.SHOW_EPISODE_DURATION), ' min')
                   WHEN COUNT(DISTINCT se.SHOW_EPISODE_ID) > 1 THEN 
                     CONCAT(COUNT(DISTINCT se.SHOW_EPISODE_ID), ' episodes')
                   ELSE 'N/A'
                 END as DURATION
          FROM SHOWS s
          LEFT JOIN SHOW_EPISODE se ON s.SHOW_ID = se.SHOW_ID
          WHERE s.SHOW_ID != ? AND s.REMOVED = 0 
          GROUP BY s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING, s.RELEASE_DATE, s.TEASER
          ORDER BY s.RATING DESC 
          LIMIT 5
        `, [showId]);
        
        similarShowsRows = fallbackShows.map(show => ({
          ...show,
          YEAR: show.RELEASE_DATE ? new Date(show.RELEASE_DATE).getFullYear() : null,
          IS_FAVORITE: false
        }));
        console.log('🎬 Using fallback shows:', similarShowsRows.length);
      }
    } catch (similarError) {
      console.error('Error fetching similar shows:', similarError);
      console.error('Error details:', similarError.message);
      similarShowsRows = [];
    }

    // Get episodes grouped by season (if it's a series)
    let episodeRows = [];
    try {
      const [episodes] = await pool.query(`
        SELECT se.SHOW_EPISODE_ID,
               se.EPISODE_NUMBER,
               se.SHOW_EPISODE_TITLE,
               se.SHOW_EPISODE_DURATION,
               se.SHOW_EPISODE_RELEASE_DATE,
               se.SHOW_EPISODE_DESCRIPTION,
               se.VIDEO_URL
        FROM SHOW_EPISODE se
        WHERE se.SHOW_ID = ?
        ORDER BY se.EPISODE_NUMBER
      `, [showId]);
      episodeRows = episodes;
    } catch (episodeError) {
      console.error('Error fetching episodes:', episodeError);
      episodeRows = [];
    }

    // Combine the results
    const showDetails = {
      ...showRows[0],
      CAST: castRows,
      DIRECTORS: directorsRows,
      SIMILAR_SHOWS: similarShowsRows,
      EPISODES: episodeRows
    };

    // Debug logging
    console.log('📺 Show Details Response:');
    console.log('- Cast count:', castRows.length);
    console.log('- Directors count:', directorsRows.length);
    console.log('- Similar shows count:', similarShowsRows.length);
    console.log('- Episodes count:', episodeRows.length);

    res.json(showDetails);
  } catch (err) {
    console.error('Error fetching show:', err);
    console.error('Error details:', err.message);
    console.error('SQL State:', err.sqlState);
    console.error('SQL Message:', err.sqlMessage);
    res.status(500).json({ error: 'Database error', details: err.message });
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
             COUNT(DISTINCT se.SHOW_EPISODE_ID) as episodes,
             CASE 
               WHEN COUNT(DISTINCT se.SHOW_EPISODE_ID) = 1 THEN 
                 CONCAT(MIN(se.SHOW_EPISODE_DURATION), ' min')
               WHEN COUNT(DISTINCT se.SHOW_EPISODE_ID) > 1 THEN 
                 CONCAT(COUNT(DISTINCT se.SHOW_EPISODE_ID), ' episodes')
               ELSE 'N/A'
             END as duration
      FROM SHOWS s
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

    const updateQuery = `UPDATE SHOWS SET ${updateFields.join(', ')} WHERE SHOW_ID = ?`;
    
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
    await pool.query('UPDATE SHOWS SET THUMBNAIL = ? WHERE SHOW_ID = ?', [filename, showId]);
    
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
    await pool.query('UPDATE SHOWS SET BANNER = ? WHERE SHOW_ID = ?', [filename, showId]);
    
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

// Get all genres with their IDs
exports.getAllGenres = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT GENRE_ID, GENRE_NAME FROM GENRE ORDER BY GENRE_NAME');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

// Get genres for a specific show
exports.getShowGenres = async (req, res) => {
  const showId = req.params.id;
  
  try {
    const [rows] = await pool.query(`
      SELECT g.GENRE_ID, g.GENRE_NAME
      FROM SHOW_GENRE sg
      JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      WHERE sg.SHOW_ID = ?
      ORDER BY g.GENRE_NAME
    `, [showId]);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching show genres:', err);
    res.status(500).json({ error: 'Failed to fetch show genres' });
  }
};

// Update show genres
exports.updateShowGenres = async (req, res) => {
  const showId = req.params.id;
  const { genreIds } = req.body;
  
  try {
    // Start a transaction
    await pool.query('START TRANSACTION');
    
    // Delete all existing genre associations for this show
    await pool.query('DELETE FROM SHOW_GENRE WHERE SHOW_ID = ?', [showId]);
    
    // Insert new genre associations
    if (genreIds && genreIds.length > 0) {
      const values = genreIds.map(genreId => [showId, genreId]);
      await pool.query(
        'INSERT INTO SHOW_GENRE (SHOW_ID, GENRE_ID) VALUES ?',
        [values]
      );
    }
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    res.json({ message: 'Show genres updated successfully' });
  } catch (err) {
    // Rollback on error
    await pool.query('ROLLBACK');
    console.error('Error updating show genres:', err);
    res.status(500).json({ error: 'Failed to update show genres' });
  }
};

// Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Get total shows count
    const [showsCount] = await pool.query('SELECT COUNT(*) as total FROM SHOWS');
    
    // Get pending submissions count
    const [pendingSubmissions] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM SUBMISSION 
      WHERE VERDICT = 'PENDING' OR VERDICT IS NULL
    `);
    
    // Get total actors count
    const [actorsCount] = await pool.query('SELECT COUNT(*) as total FROM ACTOR');
    
    // Get total directors count
    const [directorsCount] = await pool.query('SELECT COUNT(*) as total FROM DIRECTOR');
    
    // Get total awards count
    const [awardsCount] = await pool.query('SELECT COUNT(*) as total FROM AWARD');
    
    // Get approved submissions count
    const [approvedSubmissions] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM SUBMISSION 
      WHERE VERDICT = 'APPROVED'
    `);
    
    // Get rejected submissions count
    const [rejectedSubmissions] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM SUBMISSION 
      WHERE VERDICT = 'REJECTED'
    `);
    
    // Get shows by category for additional stats
    const [showsByCategory] = await pool.query(`
      SELECT c.CATEGORY_NAME, COUNT(s.SHOW_ID) as count
      FROM CATEGORY c
      LEFT JOIN SHOWS s ON c.CATEGORY_ID = s.CATEGORY_ID
      GROUP BY c.CATEGORY_ID, c.CATEGORY_NAME
    `);
    
    const analytics = {
      totalShows: showsCount[0].total,
      pendingSubmissions: pendingSubmissions[0].total,
      approvedSubmissions: approvedSubmissions[0].total,
      rejectedSubmissions: rejectedSubmissions[0].total,
      totalSubmissions: pendingSubmissions[0].total + approvedSubmissions[0].total + rejectedSubmissions[0].total,
      totalActors: actorsCount[0].total,
      totalDirectors: directorsCount[0].total,
      totalAwards: awardsCount[0].total,
      showsByCategory: showsByCategory
    };
    
    res.json(analytics);
  } catch (err) {
    console.error('Error fetching dashboard analytics:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
};

// Get show cast
exports.getShowCast = async (req, res) => {
  const showId = req.params.id;
  
  try {
    const [castRows] = await pool.query(`
      SELECT a.ACTOR_ID,
             CONCAT(a.ACTOR_FIRSTNAME, ' ', a.ACTOR_LASTNAME) as NAME,
             a.PICTURE,
             sc.ROLE_NAME,
             sc.DESCRIPTION as ROLE_DESCRIPTION
      FROM SHOW_CAST sc
      JOIN ACTOR a ON sc.ACTOR_ID = a.ACTOR_ID
      WHERE sc.SHOW_ID = ?
      ORDER BY sc.ROLE_NAME
    `, [showId]);
    
    res.json(castRows);
  } catch (err) {
    console.error('Error fetching show cast:', err);
    res.status(500).json({ error: 'Failed to fetch show cast' });
  }
};

// Update show cast
exports.updateShowCast = async (req, res) => {
  const showId = req.params.id;
  const { cast } = req.body; // Expected format: [{ actorId, roleName, description }]
  
  try {
    // Begin transaction
    await pool.query('START TRANSACTION');
    
    // Delete existing cast for this show
    await pool.query('DELETE FROM SHOW_CAST WHERE SHOW_ID = ?', [showId]);
    
    // Insert new cast members
    if (cast && cast.length > 0) {
      const values = cast.map(member => [showId, member.actorId, member.roleName || '', member.description || '']);
      const placeholders = cast.map(() => '(?, ?, ?, ?)').join(', ');
      
      await pool.query(
        `INSERT INTO SHOW_CAST (SHOW_ID, ACTOR_ID, ROLE_NAME, DESCRIPTION) VALUES ${placeholders}`,
        values.flat()
      );
    }
    
    // Commit transaction
    await pool.query('COMMIT');
    
    res.json({ message: 'Show cast updated successfully' });
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    console.error('Error updating show cast:', err);
    res.status(500).json({ error: 'Failed to update show cast' });
  }
};

// Get show directors
exports.getShowDirectors = async (req, res) => {
  const showId = req.params.id;
  
  try {
    const [directorRows] = await pool.query(`
      SELECT 
        sd.DIRECTOR_ID,
        d.DIRECTOR_FIRSTNAME,
        d.DIRECTOR_LASTNAME,
        d.PICTURE
      FROM SHOW_DIRECTOR sd
      JOIN DIRECTOR d ON sd.DIRECTOR_ID = d.DIRECTOR_ID
      WHERE sd.SHOW_ID = ?
      ORDER BY d.DIRECTOR_FIRSTNAME, d.DIRECTOR_LASTNAME
    `, [showId]);
    
    res.json(directorRows);
  } catch (err) {
    console.error('Error fetching show directors:', err);
    res.status(500).json({ error: 'Failed to fetch show directors' });
  }
};

// Update show directors
exports.updateShowDirectors = async (req, res) => {
  const showId = req.params.id;
  const { directors } = req.body; // Expected format: [{ directorId }]
  
  try {
    // Begin transaction
    await pool.query('START TRANSACTION');
    
    // Delete existing directors for this show
    await pool.query('DELETE FROM SHOW_DIRECTOR WHERE SHOW_ID = ?', [showId]);
    
    // Insert new directors
    if (directors && directors.length > 0) {
      const values = directors.map(member => [showId, member.directorId]);
      const placeholders = directors.map(() => '(?, ?)').join(', ');
      
      await pool.query(
        `INSERT INTO SHOW_DIRECTOR (SHOW_ID, DIRECTOR_ID) VALUES ${placeholders}`,
        values.flat()
      );
    }
    
    // Commit transaction
    await pool.query('COMMIT');
    
    res.json({ message: 'Show directors updated successfully' });
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    console.error('Error updating show directors:', err);
    res.status(500).json({ error: 'Failed to update show directors' });
  }
};
