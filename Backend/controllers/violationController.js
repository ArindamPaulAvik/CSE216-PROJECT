// controllers/violationController.js
const pool = require('../db');

const getAllViolations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT VIOLATION_ID, VIOLATION_TEXT FROM VIOLATION');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching violations:', err);
    res.status(500).json({ error: 'Failed to fetch violations' });
  }
};

const checkReportStatus = async (req, res) => {
  const { userId, commentId } = req.params;
  
  try {
    const [rows] = await pool.query(
      'SELECT REPORT_ID FROM REPORT WHERE USER_ID = ? AND COMMENT_ID = ?',
      [userId, commentId]
    );
    
    res.json({ hasReported: rows.length > 0 });
  } catch (err) {
    console.error('Error checking report status:', err);
    res.status(500).json({ error: 'Failed to check report status' });
  }
};

const submitReport = async (req, res) => {
  const { userId, commentId, reportText, violationIds } = req.body;
  
  if (!userId || !commentId || !violationIds || violationIds.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Check if this user has already reported this comment
    const [existingReport] = await connection.query(
      'SELECT REPORT_ID FROM REPORT WHERE USER_ID = ? AND COMMENT_ID = ?',
      [userId, commentId]
    );

    if (existingReport.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'You have already reported this comment' });
    }

    // Insert into REPORT table
    const [reportResult] = await connection.query(
      'INSERT INTO REPORT (USER_ID, COMMENT_ID, REPORT_TIME, REPORT_TEXT, ADMIN_ID, CHECKED) VALUES (?, ?, NOW(), ?, 3, 0)',
      [userId, commentId, reportText || null]
    );

    const reportId = reportResult.insertId;

    // Insert into REPORT_VIOLATION table for each selected violation
    for (const violationId of violationIds) {
      await connection.query(
        'INSERT INTO REPORT_VIOLATION (REPORT_ID, VIOLATION_ID) VALUES (?, ?)',
        [reportId, violationId]
      );
    }

    await connection.commit();
    
    res.json({ 
      success: true, 
      message: 'Report submitted successfully',
      reportId: reportId 
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error submitting report:', err);
    res.status(500).json({ error: 'Failed to submit report' });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllViolations,
  checkReportStatus,
  submitReport,
};
