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
        s.LINK_TO_SHOW,
        COALESCE(s.VERDICT, 'PENDING') as VERDICT,
        s.CREATED_AT,
        s.UPDATED_AT,
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
        s.UPDATED_AT,
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

    // Insert new submission
    const insertQuery = `
      INSERT INTO SUBMISSION (PUBLISHER_ID, LINK_TO_SHOW, VERDICT, CREATED_AT)
      VALUES (?, ?, 'PENDING', CURRENT_TIMESTAMP)
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

module.exports = {
  getAllSubmissions,
  updateSubmissionVerdict,
  createSubmission,
  getPublisherSubmissions
};
