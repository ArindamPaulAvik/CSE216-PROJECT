const pool = require('../db');

// Get all publishers
async function getAllPublishers(req, res) {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can manage publishers.' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM publisher');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch publishers' });
  }
}

// Extend contract
async function extendContract(req, res) {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can manage publishers.' });
  }
  const { extendDays } = req.body;
  if (!extendDays || isNaN(extendDays) || parseInt(extendDays) <= 0) {
    return res.status(400).json({ error: 'Invalid extend days' });
  }
  try {
    await pool.query('UPDATE publisher SET CONTRACT_DURATION_DAYS = CONTRACT_DURATION_DAYS + ? WHERE PUBLISHER_ID = ?', [parseInt(extendDays), req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to extend contract' });
  }
}

// Update contract
async function updateContract(req, res) {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can manage publishers.' });
  }
  const { publisherName, contractId, contractDate, contractDurationDays, royalty, minGuarantee } = req.body;
  if (!publisherName || !contractId || !contractDate || !contractDurationDays || royalty === undefined || minGuarantee === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.query(
      'UPDATE publisher SET PUBLISHER_NAME=?, CONTRACT_ID=?, CONTRACT_DATE=?, CONTRACT_DURATION_DAYS=?, ROYALTY=?, MIN_GUARANTEE=? WHERE PUBLISHER_ID=?',
      [publisherName, contractId, contractDate, contractDurationDays, royalty, minGuarantee, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contract' });
  }
}

// Create contract renewal request
async function createContractRenewalRequest(req, res) {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  const { publisherId, renewalYears, newMinGuarantee, newRoyalty } = req.body;
  if (userType === 'admin' && adminType === 'Marketing') {
    if (!publisherId || !renewalYears || newMinGuarantee === undefined || newRoyalty === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      await pool.query(
        `INSERT INTO contract_renewal_request 
          (PUBLISHER_ID, REQUEST_DATE, STATUS, RESPONSE_DATE, RENEWAL_YEARS, NEW_MIN_GUARANTEE, NEW_ROYALTY, REQUESTED_BY, IS_SEEN_ADMIN, IS_SEEN_PUB)
         VALUES (?, CURDATE(), 'PENDING', NULL, ?, ?, ?, 'ADMIN', 0, 0)`,
        [publisherId, renewalYears, newMinGuarantee, newRoyalty]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create renewal request' });
    }
  } else if (userType === 'publisher') {
    const myPublisherId = req.user?.publisherId || publisherId;
    if (!myPublisherId || !renewalYears || newMinGuarantee === undefined || newRoyalty === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      await pool.query(
        `INSERT INTO contract_renewal_request 
          (PUBLISHER_ID, REQUEST_DATE, STATUS, RESPONSE_DATE, RENEWAL_YEARS, NEW_MIN_GUARANTEE, NEW_ROYALTY, REQUESTED_BY, IS_SEEN_ADMIN, IS_SEEN_PUB)
         VALUES (?, CURDATE(), 'PENDING', NULL, ?, ?, ?, 'PUBLISHER', 0, 0)`,
        [myPublisherId, renewalYears, newMinGuarantee, newRoyalty]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create renewal request' });
    }
  } else {
    return res.status(403).json({ error: 'Access denied. Only marketing admins or publishers can create renewal requests.' });
  }
}

// Get contract renewal requests (optionally filter by status)
async function getContractRenewalRequests(req, res) {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  const { status, requestedBy, publisherId } = req.query;
  try {
    let query = 'SELECT * FROM contract_renewal_request';
    let params = [];
    if (userType === 'publisher') {
      // Allow publisher to see their own admin-requested or publisher-requested requests
      const myPublisherId = req.user?.publisherId || publisherId;
      if (requestedBy === 'PUBLISHER') {
        query += ' WHERE REQUESTED_BY = \'PUBLISHER\'';
      } else {
        query += ' WHERE REQUESTED_BY = \'ADMIN\'';
      }
      if (myPublisherId) {
        query += ' AND PUBLISHER_ID = ?';
        params.push(myPublisherId);
      }
      if (status) {
        query += ' AND STATUS = ?';
        params.push(status);
      }
      query += ' ORDER BY REQUEST_DATE ASC';
      const [rows] = await pool.query(query, params);
      return res.json(rows);
    } else if (userType === 'admin' && adminType === 'Marketing') {
      if (status && requestedBy && publisherId) {
        query += ' WHERE STATUS = ? AND REQUESTED_BY = ? AND PUBLISHER_ID = ?';
        params.push(status, requestedBy, publisherId);
      } else if (status && requestedBy) {
        query += ' WHERE STATUS = ? AND REQUESTED_BY = ?';
        params.push(status, requestedBy);
      } else if (status) {
        query += ' WHERE STATUS = ?';
        params.push(status);
      } else if (requestedBy) {
        query += ' WHERE REQUESTED_BY = ?';
        params.push(requestedBy);
      }
      query += ' ORDER BY REQUEST_DATE ASC';
      const [rows] = await pool.query(query, params);
      return res.json(rows);
    } else {
      return res.status(403).json({ error: 'Access denied.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch renewal requests' });
  }
}

// Mark publisher-requested pending requests as seen by admin
async function markPublisherRequestedSeen(req, res) {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can update seen status.' });
  }
  try {
    await pool.query(
      `UPDATE contract_renewal_request SET IS_SEEN_ADMIN=1 WHERE STATUS='PENDING' AND REQUESTED_BY='PUBLISHER' AND IS_SEEN_ADMIN=0`
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update seen status' });
  }
}

// Mark admin-requested completed requests as seen by admin (APPROVED or REJECTED)
async function markAdminRequestedAcceptedSeen(req, res) {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can update seen status.' });
  }
  try {
    await pool.query(
      `UPDATE contract_renewal_request SET IS_SEEN_ADMIN=1 WHERE STATUS != 'PENDING' AND REQUESTED_BY='ADMIN' AND IS_SEEN_ADMIN=0`
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update seen status' });
  }
}

// Publisher rejects a contract renewal request
async function rejectContractRenewalRequest(req, res) {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  const requestId = req.params.id;
  if (userType === 'publisher') {
    const publisherId = req.user?.publisherId;
    try {
      // Only allow rejecting if the request is for this publisher and is pending
      const [rows] = await pool.query(
        'SELECT * FROM contract_renewal_request WHERE REQUEST_ID = ? AND PUBLISHER_ID = ? AND STATUS = \'PENDING\'',
        [requestId, publisherId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Pending request not found for this publisher.' });
      }
      await pool.query(
        "UPDATE contract_renewal_request SET STATUS = 'REJECTED', RESPONSE_DATE = CURDATE() WHERE REQUEST_ID = ?",
        [requestId]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to reject renewal request' });
    }
  } else if (userType === 'admin' && adminType === 'Marketing') {
    try {
      // Only allow rejecting publisher-requested pending requests
      const [rows] = await pool.query(
        "SELECT * FROM contract_renewal_request WHERE REQUEST_ID = ? AND STATUS = 'PENDING' AND REQUESTED_BY = 'PUBLISHER'",
        [requestId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Pending publisher request not found.' });
      }
      await pool.query(
        "UPDATE contract_renewal_request SET STATUS = 'REJECTED', RESPONSE_DATE = CURDATE() WHERE REQUEST_ID = ?",
        [requestId]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to reject renewal request' });
    }
  } else {
    return res.status(403).json({ error: 'Access denied. Only publishers or marketing admins can reject renewal requests.' });
  }
}

// Publisher marks their request as seen (for accepted/rejected)
async function markSeenPub(req, res) {
  const userType = req.user?.userType;
  if (userType !== 'publisher') {
    return res.status(403).json({ error: 'Access denied. Only publishers can mark as seen.' });
  }
  const requestId = req.params.id;
  const publisherId = req.user?.publisherId;
  try {
    // Only allow if the request belongs to this publisher
    const [rows] = await pool.query(
      'SELECT * FROM contract_renewal_request WHERE REQUEST_ID = ? AND PUBLISHER_ID = ?',
      [requestId, publisherId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Request not found for this publisher.' });
    }
    await pool.query(
      'UPDATE contract_renewal_request SET IS_SEEN_PUB=1 WHERE REQUEST_ID = ?',
      [requestId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update seen status' });
  }
}

// Marketing admin accepts a publisher-requested renewal request
async function acceptPublisherRequestedRenewal(req, res) {
  const userType = req.user?.userType;
  const adminType = req.user?.adminType;
  if (userType !== 'admin' || adminType !== 'Marketing') {
    return res.status(403).json({ error: 'Access denied. Only marketing admins can accept renewal requests.' });
  }
  const requestId = req.params.id;
  try {
    // Get the request and publisher
    const [rows] = await pool.query(
      `SELECT * FROM contract_renewal_request WHERE REQUEST_ID = ? AND STATUS = 'PENDING' AND REQUESTED_BY = 'PUBLISHER'`,
      [requestId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pending publisher request not found.' });
    }
    const reqRow = rows[0];
    // Update the request status
    await pool.query(
      `UPDATE contract_renewal_request SET STATUS = 'APPROVED', RESPONSE_DATE = CURDATE() WHERE REQUEST_ID = ?`,
      [requestId]
    );
    // Update the publisher contract
    const [pubRows] = await pool.query('SELECT * FROM publisher WHERE PUBLISHER_ID = ?', [reqRow.PUBLISHER_ID]);
    if (pubRows.length === 0) {
      return res.status(404).json({ error: 'Publisher not found.' });
    }
    const pub = pubRows[0];
    const newDuration = pub.CONTRACT_DURATION_DAYS + (parseInt(reqRow.RENEWAL_YEARS || 0) * 365);
    const newRoyalty = reqRow.NEW_ROYALTY !== null ? reqRow.NEW_ROYALTY : pub.ROYALTY;
    const newMinGuarantee = reqRow.NEW_MIN_GUARANTEE !== null ? reqRow.NEW_MIN_GUARANTEE : pub.MIN_GUARANTEE;
    await pool.query(
      'UPDATE publisher SET CONTRACT_DURATION_DAYS = ?, ROYALTY = ?, MIN_GUARANTEE = ? WHERE PUBLISHER_ID = ?',
      [newDuration, newRoyalty, newMinGuarantee, pub.PUBLISHER_ID]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept renewal request' });
  }
}

// Publisher accepts an admin-requested renewal request
async function acceptAdminRequestedRenewal(req, res) {
  const userType = req.user?.userType;
  if (userType !== 'publisher') {
    return res.status(403).json({ error: 'Access denied. Only publishers can accept admin renewal requests.' });
  }
  const requestId = req.params.id;
  const publisherId = req.user?.publisherId;
  try {
    // Get the request and publisher
    const [rows] = await pool.query(
      `SELECT * FROM contract_renewal_request WHERE REQUEST_ID = ? AND STATUS = 'PENDING' AND REQUESTED_BY = 'ADMIN' AND PUBLISHER_ID = ?`,
      [requestId, publisherId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pending admin request not found for this publisher.' });
    }
    const reqRow = rows[0];
    // Update the request status
    await pool.query(
      `UPDATE contract_renewal_request SET STATUS = 'APPROVED', RESPONSE_DATE = CURDATE() WHERE REQUEST_ID = ?`,
      [requestId]
    );
    // Update the publisher contract
    const [pubRows] = await pool.query('SELECT * FROM publisher WHERE PUBLISHER_ID = ?', [publisherId]);
    if (pubRows.length === 0) {
      return res.status(404).json({ error: 'Publisher not found.' });
    }
    const pub = pubRows[0];
    const newDuration = pub.CONTRACT_DURATION_DAYS + (parseInt(reqRow.RENEWAL_YEARS || 0) * 365);
    const newRoyalty = reqRow.NEW_ROYALTY !== null ? reqRow.NEW_ROYALTY : pub.ROYALTY;
    const newMinGuarantee = reqRow.NEW_MIN_GUARANTEE !== null ? reqRow.NEW_MIN_GUARANTEE : pub.MIN_GUARANTEE;
    await pool.query(
      'UPDATE publisher SET CONTRACT_DURATION_DAYS = ?, ROYALTY = ?, MIN_GUARANTEE = ? WHERE PUBLISHER_ID = ?',
      [newDuration, newRoyalty, newMinGuarantee, pub.PUBLISHER_ID]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept renewal request' });
  }
}

// Get contract details for the logged-in publisher
async function getMyContract(req, res) {
  const userType = req.user?.userType;
  const personId = req.user?.personId;
  if (userType !== 'publisher' || !personId) {
    return res.status(403).json({ error: 'Access denied. Only publishers can view their contract.' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM publisher WHERE PERSON_ID = ?', [personId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No contract found for this publisher.' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contract details' });
  }
}

// Publisher earnings analytics endpoint
async function publisherEarnings(req, res) {
  const userType = req.user?.userType;
  const publisherId = req.user?.publisherId;
  const { days } = req.body;
  if (userType !== 'publisher' || !publisherId) {
    return res.status(403).json({ error: 'Access denied. Only publishers can view their earnings.' });
  }
  const numDays = parseInt(days) || 7;
  try {
    const [rows] = await pool.query(
      'CALL GetPublisherEarningsForPeriod(?, ?)',
      [publisherId, numDays]
    );
    res.json(rows[0] || []);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch earnings',
      details: err.message
    });
  }
}

// Get all shows for a publisher with earnings calculation
async function getPublisherShows(req, res) {
  const userType = req.user?.userType;
  const publisherId = req.user?.publisherId;
  
  if (userType !== 'publisher' || !publisherId) {
    return res.status(403).json({ error: 'Access denied. Only publishers can view their shows.' });
  }
  
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.SHOW_ID,
        s.TITLE,
        s.THUMBNAIL,
        s.RATING,
        s.WATCH_COUNT,
        p.ROYALTY,
        (s.WATCH_COUNT * p.ROYALTY) as INCOME
      FROM \`SHOW\` s
      JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      WHERE s.PUBLISHER_ID = ? AND s.REMOVED = 0
      ORDER BY s.WATCH_COUNT DESC
    `, [publisherId]);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching publisher shows:', err);
    res.status(500).json({ error: 'Failed to fetch publisher shows' });
  }
}

module.exports = {
  getAllPublishers,
  extendContract,
  updateContract,
  createContractRenewalRequest,
  getContractRenewalRequests,
  markPublisherRequestedSeen,
  markAdminRequestedAcceptedSeen,
  rejectContractRenewalRequest,
  markSeenPub,
  acceptPublisherRequestedRenewal,
  acceptAdminRequestedRenewal,
  getMyContract,
  publisherEarnings,
  getPublisherShows
}; 