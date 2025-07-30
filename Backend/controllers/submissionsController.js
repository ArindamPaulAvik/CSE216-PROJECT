const pool = require('../db');

// Get all submissions with publisher information
const getAllSubmissions = async (req, res) => {
  try {
    console.log('getAllSubmissions called');
    console.log('Request user:', req.user);
    
    // Verify admin access
    const userType = req.user.userType;
    const adminType = req.user.adminType;
    
    console.log('User auth check:', { userType, adminType });
    
    if (userType !== 'admin' || adminType !== 'Content') {
      console.log('Access denied for user:', { userType, adminType });
      return res.status(403).json({ message: 'Access denied. Content admin access required.' });
    }

    console.log('Access granted, checking table existence...');

    console.log('Executing main query...');

    const query = `
      SELECT 
        s.SUBMISSION_ID,
        s.PUBLISHER_ID,
        s.SHOW_ID,
        s.LINK_TO_SHOW,
        COALESCE(s.VERDICT, 'PENDING') as VERDICT,
        s.CREATED_AT,
        s.UPDATED_AT,
        s.TYPE,
        COALESCE(p.PUBLISHER_NAME, CONCAT('Publisher #', s.PUBLISHER_ID)) as PUBLISHER_NAME
      FROM SUBMISSION s
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      ORDER BY 
        CASE COALESCE(s.VERDICT, 'PENDING')
          WHEN 'PENDING' THEN 1 
          WHEN 'APPROVED' THEN 2 
          WHEN 'REJECTED' THEN 3 
        END,
        s.CREATED_AT DESC
    `;

    const [rows] = await pool.execute(query);
    console.log('Query executed successfully, rows:', rows.length);
    console.log('Sample row:', rows[0]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error in getAllSubmissions:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

// Update submission verdict
const updateSubmissionVerdict = async (req, res) => {
  try {
    // Verify admin access
    const userType = req.user.userType;
    const adminType = req.user.adminType;
    
    if (userType !== 'admin' || adminType !== 'Content') {
      return res.status(403).json({ message: 'Access denied. Content admin access required.' });
    }

    const { id } = req.params;
    const { verdict } = req.body;
    const adminId = req.user.adminId;

    // Validate verdict
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(verdict)) {
      return res.status(400).json({ message: 'Invalid verdict. Must be APPROVED, REJECTED, or PENDING.' });
    }

    // Check if submission exists
    const [existingSubmission] = await pool.execute(
      'SELECT * FROM SUBMISSION WHERE SUBMISSION_ID = ?',
      [id]
    );

    if (existingSubmission.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update submission
    const updateQuery = `
      UPDATE SUBMISSION 
      SET VERDICT = ?, ADMIN_ID = ?, UPDATED_AT = CURRENT_TIMESTAMP
      WHERE SUBMISSION_ID = ?
    `;

    await pool.execute(updateQuery, [verdict, adminId, id]);

    // Get updated submission with publisher info
    const [updatedSubmission] = await pool.execute(`
      SELECT 
        s.SUBMISSION_ID,
        s.PUBLISHER_ID,
        s.ADMIN_ID,
        s.LINK_TO_SHOW,
        s.VERDICT,
        s.CREATED_AT,
        p.PUBLISHER_NAME,
        ca.ADMIN_ID
      FROM SUBMISSION s
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      LEFT JOIN CONTENT_ADMIN ca ON s.ADMIN_ID = ca.ADMIN_ID
      WHERE s.SUBMISSION_ID = ?
    `, [id]);

    res.json({
      message: `Submission ${verdict.toLowerCase()} successfully`,
      submission: updatedSubmission[0]
    });
  } catch (error) {
    console.error('Error updating submission verdict:', error);
    res.status(500).json({ message: 'Error updating submission verdict', error: error.message });
  }
};

// Create new submission (for publishers)
// Replace your existing createSubmission function with this:
const createSubmission = async (req, res) => {
  try {
    // Verify publisher access
    const userType = req.user.userType;
    
    if (userType !== 'publisher') {
      return res.status(403).json({ message: 'Access denied. Publisher access required.' });
    }

    const { linkToShow } = req.body;
    const publisherId = req.user.publisherId;

    if (!linkToShow) {
      return res.status(400).json({ message: 'Link to show is required' });
    }

    // Insert new submission - ADD TYPE = 'GENERAL' here
    const insertQuery = `
      INSERT INTO SUBMISSION (PUBLISHER_ID, LINK_TO_SHOW, VERDICT, CREATED_AT, TYPE)
      VALUES (?, ?, 'PENDING', CURRENT_TIMESTAMP, 'GENERAL')
    `;

    const [result] = await pool.execute(insertQuery, [publisherId, linkToShow]);

    // Get the created submission with publisher info
    const [newSubmission] = await pool.execute(`
      SELECT 
        s.SUBMISSION_ID,
        s.PUBLISHER_ID,
        s.ADMIN_ID,
        s.LINK_TO_SHOW,
        s.VERDICT,
        s.CREATED_AT,
        s.TYPE,
        p.PUBLISHER_NAME
      FROM SUBMISSION s
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      WHERE s.SUBMISSION_ID = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Submission created successfully',
      submission: newSubmission[0]
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ message: 'Error creating submission', error: error.message });
  }
};

// Create show submission (for publishers)
const createShowSubmission = async (req, res) => {
  try {
    // Verify publisher access
    const userType = req.user.userType;
    
    if (userType !== 'publisher') {
      return res.status(403).json({ message: 'Access denied. Publisher access required.' });
    }

    const publisherId = req.user.publisherId;
    const { title, description, teaser, categoryType, movieLink } = req.body;
    
    // Handle file uploads
    const bannerImg = req.files?.banner ? req.files.banner[0].filename : null;
    const thumbImg = req.files?.thumbnail ? req.files.thumbnail[0].filename : null;
    
    console.log('File uploads:', {
      banner: req.files?.banner ? req.files.banner[0] : null,
      thumbnail: req.files?.thumbnail ? req.files.thumbnail[0] : null,
      bannerImg,
      thumbImg
    });

    // Validate required fields
    if (!title || !description || !teaser || !categoryType) {
      return res.status(400).json({ message: 'Title, description, teaser, and category type are required' });
    }
    
    // Validate required files
    if (!req.files?.banner || !req.files?.thumbnail) {
      return res.status(400).json({ message: 'Both banner and thumbnail images are required' });
    }

    // Set link_to_show based on category type
    let linkToShow = null;
    if (categoryType === 'Movie' && movieLink) {
      linkToShow = movieLink;
    } else if (categoryType === 'Series') {
      linkToShow = teaser; // For series, use teaser as link
    }

    // Insert new show submission
    const insertQuery = `
      INSERT INTO SUBMISSION (
        PUBLISHER_ID, 
        LINK_TO_SHOW, 
        VERDICT, 
        CREATED_AT, 
        TYPE, 
        TITLE, 
        DESCRIPTION, 
        TEASER, 
        CATEGORY, 
        BANNER_IMG, 
        THUMB_IMG
      )
      VALUES (?, ?, 'PENDING', CURRENT_TIMESTAMP, 'SHOWS', ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(insertQuery, [
      publisherId, 
      linkToShow, 
      title, 
      description, 
      teaser, 
      categoryType, 
      bannerImg, 
      thumbImg
    ]);

    // Get the created submission with publisher info
    const [newSubmission] = await pool.execute(`
      SELECT 
        s.SUBMISSION_ID,
        s.PUBLISHER_ID,
        s.ADMIN_ID,
        s.LINK_TO_SHOW,
        s.VERDICT,
        s.CREATED_AT,
        s.TYPE,
        s.TITLE,
        s.DESCRIPTION,
        s.TEASER,
        s.CATEGORY,
        s.BANNER_IMG,
        s.THUMB_IMG,
        p.PUBLISHER_NAME
      FROM SUBMISSION s
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      WHERE s.SUBMISSION_ID = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Show submission created successfully',
      submission: newSubmission[0]
    });
  } catch (error) {
    console.error('Error creating show submission:', error);
    res.status(500).json({ message: 'Error creating show submission', error: error.message });
  }
};

// Create episode submission (for publishers)
const createEpisodeSubmission = async (req, res) => {
  try {
    const userType = req.user.userType;
    
    if (userType !== 'publisher') {
      return res.status(403).json({ message: 'Access denied. Publisher access required.' });
    }

    const publisherId = req.user.publisherId;
    const { title, description, episodeLink, showId } = req.body; // Changed from seriesId to showId
    
    // Validate required fields
    if (!title || !description || !episodeLink || !showId) {
      return res.status(400).json({ message: 'Title, description, episode link, and series are required' });
    }

    // Verify the show exists and belongs to this publisher
    const [showResult] = await pool.execute(
      'SELECT SHOW_ID, TITLE FROM SHOWS WHERE SHOW_ID = ? AND PUBLISHER_ID = ? AND REMOVED = 0',
      [showId, publisherId]
    );

    if (showResult.length === 0) {
      return res.status(404).json({ message: 'Series not found or you do not have permission to add episodes to it' });
    }

    // Insert new episode submission
    const insertQuery = `
      INSERT INTO SUBMISSION (
        PUBLISHER_ID, 
        SHOW_ID,
        LINK_TO_SHOW, 
        VERDICT, 
        CREATED_AT, 
        TYPE, 
        TITLE, 
        DESCRIPTION, 
        CATEGORY
      )
      VALUES (?, ?, ?, 'PENDING', CURRENT_TIMESTAMP, 'EPISODES', ?, ?, 'Episode')
    `;

    const [result] = await pool.execute(insertQuery, [
      publisherId, 
      showId, // Use showId directly
      episodeLink, 
      title, 
      description
    ]);

    // Get the created submission
    const [newSubmission] = await pool.execute(`
      SELECT 
        s.SUBMISSION_ID,
        s.PUBLISHER_ID,
        s.SHOW_ID,
        s.ADMIN_ID,
        s.LINK_TO_SHOW,
        s.VERDICT,
        s.CREATED_AT,
        s.TYPE,
        s.TITLE,
        s.DESCRIPTION,
        s.CATEGORY,
        p.PUBLISHER_NAME,
        sh.TITLE as SERIES_TITLE
      FROM SUBMISSION s
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      LEFT JOIN SHOWS sh ON s.SHOW_ID = sh.SHOW_ID
      WHERE s.SUBMISSION_ID = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Episode submission created successfully',
      submission: newSubmission[0]
    });
  } catch (error) {
    console.error('Error creating episode submission:', error);
    res.status(500).json({ message: 'Error creating episode submission', error: error.message });
  }
};

// Get submissions by publisher
const getPublisherSubmissions = async (req, res) => {
  try {
    // Verify publisher access
    const userType = req.user.userType;
    
    if (userType !== 'publisher') {
      return res.status(403).json({ message: 'Access denied. Publisher access required.' });
    }

    const publisherId = req.user.publisherId;

    const query = `
      SELECT 
        s.SUBMISSION_ID,
        s.PUBLISHER_ID,
        s.SHOW_ID,
        s.ADMIN_ID,
        s.LINK_TO_SHOW,
        s.VERDICT,
        s.CREATED_AT,
        s.UPDATED_AT
      FROM SUBMISSION s
      WHERE s.PUBLISHER_ID = ?
      ORDER BY s.CREATED_AT DESC
    `;

    const [rows] = await pool.execute(query, [publisherId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching publisher submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

// Get detailed submission information by ID
const getSubmissionById = async (req, res) => {
  try {
    console.log('=== GET SUBMISSION BY ID ===');
    console.log('Request params:', req.params);
    console.log('User:', req.user);
    
    // Verify admin access
    const userType = req.user.userType;
    const adminType = req.user.adminType;
    
    console.log('User auth check:', { userType, adminType });
    
    if (userType !== 'admin' || adminType !== 'Content') {
      console.log('Access denied for user:', { userType, adminType });
      return res.status(403).json({ message: 'Access denied. Content admin access required.' });
    }

    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid submission ID' });
    }

    console.log('Fetching submission with ID:', id);

    // Query without ADMIN_NAME since it doesn't exist
    const query = `
      SELECT 
        s.SUBMISSION_ID,
        s.PUBLISHER_ID,
        s.ADMIN_ID,
        s.LINK_TO_SHOW,
        COALESCE(s.VERDICT, 'PENDING') as VERDICT,
        s.CREATED_AT,
        s.UPDATED_AT,
        s.TYPE,
        s.TITLE,
        s.DESCRIPTION,
        s.TEASER,
        s.CATEGORY,
        s.BANNER_IMG,
        s.THUMB_IMG,
        s.SHOW_ID,
        COALESCE(p.PUBLISHER_NAME, CONCAT('Publisher #', s.PUBLISHER_ID)) as PUBLISHER_NAME
      FROM SUBMISSION s
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      WHERE s.SUBMISSION_ID = ?
    `;

    console.log('Executing query:', query);
    console.log('With parameters:', [id]);

    const [rows] = await pool.execute(query, [id]);
    
    console.log('Query executed successfully, rows found:', rows.length);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    console.log('Submission details:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error in getSubmissionById:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error fetching submission details', 
      error: error.message,
      stack: error.stack 
    });
  }
};

module.exports = {
  getAllSubmissions,
  updateSubmissionVerdict,
  createSubmission,
  createShowSubmission,
  createEpisodeSubmission,
  getPublisherSubmissions,
  getSubmissionById
};
