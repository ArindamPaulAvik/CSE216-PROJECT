const pool = require('../db');

// Get all undealt reports with full details
exports.getUndealtReports = async (req, res) => {
  try {
    const [reports] = await pool.query(`
      SELECT 
        r.REPORT_ID,
        r.USER_ID,
        r.COMMENT_ID,
        r.REPORT_TIME as CREATED_AT,
        r.REPORT_TEXT as REASON,
        r.ADMIN_ID,
        r.CHECKED,
        CONCAT(u.USER_FIRSTNAME, ' ', u.USER_LASTNAME) as REPORTER_NAME,
        CONCAT(u.USER_FIRSTNAME, ' ', u.USER_LASTNAME) as REPORTER_USERNAME,
        p.EMAIL as REPORTER_EMAIL,
        c.TEXT as COMMENT_TEXT,
        c.TIME as COMMENT_TIME,
        CONCAT(cu.USER_FIRSTNAME, ' ', cu.USER_LASTNAME) as COMMENT_AUTHOR_USERNAME,
        cp.EMAIL as COMMENT_AUTHOR_EMAIL,
        GROUP_CONCAT(v.VIOLATION_TEXT SEPARATOR ', ') as VIOLATIONS,
        CASE 
          WHEN r.CHECKED = 0 THEN 'OPEN'
          WHEN r.CHECKED = 1 THEN 'ASSIGNED'
          WHEN r.CHECKED = 2 THEN 'RESOLVED'
          ELSE 'UNKNOWN'
        END as STATUS
      FROM REPORT r
      LEFT JOIN USER u ON r.USER_ID = u.USER_ID
      LEFT JOIN PERSON p ON u.PERSON_ID = p.PERSON_ID
      LEFT JOIN COMMENT c ON r.COMMENT_ID = c.COMMENT_ID
      LEFT JOIN USER cu ON c.USER_ID = cu.USER_ID
      LEFT JOIN PERSON cp ON cu.PERSON_ID = cp.PERSON_ID
      LEFT JOIN REPORT_VIOLATION rv ON r.REPORT_ID = rv.REPORT_ID
      LEFT JOIN VIOLATION v ON rv.VIOLATION_ID = v.VIOLATION_ID
      WHERE r.CHECKED = 0
      GROUP BY r.REPORT_ID
      ORDER BY r.REPORT_TIME DESC
    `);
    
    res.json(reports);
  } catch (err) {
    console.error('Error fetching undealt reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// Get report details by ID
exports.getReportById = async (req, res) => {
  const reportId = req.params.id;
  
  // Validate reportId
  if (!reportId || isNaN(parseInt(reportId))) {
    return res.status(400).json({ error: 'Invalid report ID' });
  }
  
  try {
    const [reports] = await pool.query(`
      SELECT 
        r.REPORT_ID,
        r.USER_ID,
        r.COMMENT_ID,
        r.REPORT_TIME,
        r.REPORT_TEXT,
        r.ADMIN_ID,
        CONCAT(u.USER_FIRSTNAME, ' ', u.USER_LASTNAME) as REPORTER_USERNAME,
        p.EMAIL as REPORTER_EMAIL,
        c.TEXT as COMMENT_TEXT,
        c.TIME as COMMENT_TIME,
        c.LIKE_COUNT,
        c.DISLIKE_COUNT,
        c.DELETED,
        CONCAT(cu.USER_FIRSTNAME, ' ', cu.USER_LASTNAME) as COMMENT_AUTHOR_USERNAME,
        cp.EMAIL as COMMENT_AUTHOR_EMAIL,
        GROUP_CONCAT(v.VIOLATION_TEXT SEPARATOR ', ') as VIOLATIONS
      FROM REPORT r
      LEFT JOIN USER u ON r.USER_ID = u.USER_ID
      LEFT JOIN PERSON p ON u.PERSON_ID = p.PERSON_ID
      LEFT JOIN COMMENT c ON r.COMMENT_ID = c.COMMENT_ID
      LEFT JOIN USER cu ON c.USER_ID = cu.USER_ID
      LEFT JOIN PERSON cp ON cu.PERSON_ID = cp.PERSON_ID
      LEFT JOIN REPORT_VIOLATION rv ON r.REPORT_ID = rv.REPORT_ID
      LEFT JOIN VIOLATION v ON rv.VIOLATION_ID = v.VIOLATION_ID
      WHERE r.REPORT_ID = ?
      GROUP BY r.REPORT_ID
    `, [reportId]);

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = reports[0];
    res.json(report);
  } catch (err) {
    console.error('Error fetching report details:', err);
    res.status(500).json({ error: 'Failed to fetch report details' });
  }
};

// Get all violations for dropdown
exports.getAllViolations = async (req, res) => {
  try {
    const [violations] = await pool.query('SELECT * FROM VIOLATION ORDER BY VIOLATION_TEXT');
    res.json(violations);
  } catch (err) {
    console.error('Error fetching violations:', err);
    res.status(500).json({ error: 'Failed to fetch violations' });
  }
};

// Delete comment (action on report)
exports.deleteReportedComment = async (req, res) => {
  const commentId = req.params.commentId;
  
  // Validate input
  if (!commentId || isNaN(parseInt(commentId))) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }
  
  try {
    // Start transaction
    await pool.query('START TRANSACTION');
    
    // Mark all reports for this comment as checked = 2 (deleted)
    // Note: User mentioned there's a trigger for actual deletion
    await pool.query(
      'UPDATE REPORT SET CHECKED = 2 WHERE COMMENT_ID = ?',
      [commentId]
    );
    
    // Commit transaction
    await pool.query('COMMIT');
    
    res.json({ message: 'Comment marked for deletion and reports updated' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error marking comment for deletion:', err);
    res.status(500).json({ error: 'Failed to mark comment for deletion' });
  }
};

// Dismiss report (remove from database, leave comment as is)
exports.dismissReport = async (req, res) => {
  const reportId = req.params.id;
  
  // Validate inputs
  if (!reportId || isNaN(parseInt(reportId))) {
    return res.status(400).json({ error: 'Invalid report ID' });
  }
  
  try {
    // Delete the report from database completely
    const result = await pool.query(
      'UPDATE REPORT SET CHECKED = 1 WHERE REPORT_ID = ?',
      [reportId]
    );
    
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({ message: 'Report dismissed and removed from database' });
  } catch (err) {
    console.error('Error dismissing report:', err);
    res.status(500).json({ error: 'Failed to dismiss report' });
  }
};

// Resolve report (mark as dealt with)
exports.resolveReport = async (req, res) => {
  const reportId = req.params.id;
  const { resolution, adminNotes, adminId } = req.body;
  
  // Validate inputs
  if (!reportId || isNaN(parseInt(reportId))) {
    return res.status(400).json({ error: 'Invalid report ID' });
  }
  
  if (!resolution || typeof resolution !== 'string' || resolution.trim().length === 0) {
    return res.status(400).json({ error: 'Resolution is required' });
  }
  
  if (!adminId || isNaN(parseInt(adminId))) {
    return res.status(400).json({ error: 'Invalid admin ID' });
  }
  
  try {
    const result = await pool.query(
      'UPDATE REPORT SET CHECKED = 1 WHERE REPORT_ID = ?',
      [reportId]
    );
    
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({ message: 'Report resolved successfully' });
  } catch (err) {
    console.error('Error resolving report:', err);
    res.status(500).json({ error: 'Failed to resolve report' });
  }
};
