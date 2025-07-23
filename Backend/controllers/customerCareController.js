const db = require('../db');

// Get all customer care requests
const getAllRequests = async (req, res) => {
  try {
    const query = `
      SELECT 
        ccr.REQUEST_ID,
        ccr.USER_ID,
        ccr.SUBJECT,
        ccr.MESSAGE,
        ccr.STATUS,
        ccr.CREATED_AT,
        ccr.UPDATED_AT,
        ccr.ADMIN_REPLY,
        ccr.REPLIED_AT,
        u.USER_FIRSTNAME,
        u.USER_LASTNAME,
        p.EMAIL
      FROM CUSTOMER_CARE_REQUEST ccr
      JOIN USER u ON ccr.USER_ID = u.USER_ID
      JOIN PERSON p ON u.PERSON_ID = p.PERSON_ID
      ORDER BY ccr.CREATED_AT DESC
    `;
    
    const [requests] = await db.execute(query);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching customer care requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Get request by ID
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        ccr.REQUEST_ID,
        ccr.USER_ID,
        ccr.SUBJECT,
        ccr.MESSAGE,
        ccr.STATUS,
        ccr.CREATED_AT,
        ccr.UPDATED_AT,
        ccr.ADMIN_REPLY,
        ccr.REPLIED_AT,
        u.USER_FIRSTNAME,
        u.USER_LASTNAME,
        p.EMAIL
      FROM CUSTOMER_CARE_REQUEST ccr
      JOIN USER u ON ccr.USER_ID = u.USER_ID
      JOIN PERSON p ON u.PERSON_ID = p.PERSON_ID
      WHERE ccr.REQUEST_ID = ?
    `;
    
    const [requests] = await db.execute(query, [id]);
    
    if (requests.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json(requests[0]);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request details' });
  }
};

// Create new customer care request (from user)
const createRequest = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user.userId; // Fix: use userId instead of user_id
    
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'User authentication required' });
    }
    
    const query = `
      INSERT INTO CUSTOMER_CARE_REQUEST (USER_ID, SUBJECT, MESSAGE, STATUS, CREATED_AT)
      VALUES (?, ?, ?, 'OPEN', NOW())
    `;
    
    const [result] = await db.execute(query, [userId, subject, message]);
    
    res.status(201).json({
      message: 'Request submitted successfully',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
};

// Reply to customer care request (admin only)
const replyToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    
    if (!reply) {
      return res.status(400).json({ error: 'Reply is required' });
    }

    // First get the request details to get the user ID
    const [requestRows] = await db.execute(
      'SELECT USER_ID FROM CUSTOMER_CARE_REQUEST WHERE REQUEST_ID = ?',
      [id]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const userId = requestRows[0].USER_ID;

    // Update the request with admin reply
    const query = `
      UPDATE CUSTOMER_CARE_REQUEST 
      SET ADMIN_REPLY = ?, STATUS = 'REPLIED', REPLIED_AT = NOW(), UPDATED_AT = NOW()
      WHERE REQUEST_ID = ?
    `;
    
    const [result] = await db.execute(query, [reply, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Create a notification for the user
    try {
      // Insert notification
      const notificationQuery = `
        INSERT INTO NOTIFICATIONS (TYPE, TITLE, MESSAGE, CREATED_AT, DATA)
        VALUES ('admin_notice', 'Customer Care Reply', 'Your support request has been answered by our team', NOW(), ?)
      `;
      
      const notificationData = JSON.stringify({ requestId: id });
      const [notifResult] = await db.execute(notificationQuery, [notificationData]);
      
      // Link notification to user
      const userNotifQuery = `
        INSERT INTO USER_NOTIFICATIONS (USER_ID, NOTIF_ID, IS_READ, CREATED_AT)
        VALUES (?, ?, FALSE, NOW())
      `;
      
      await db.execute(userNotifQuery, [userId, notifResult.insertId]);
      
      console.log(`✅ Created admin_notice notification for user ${userId} regarding request ${id}`);
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Don't fail the reply if notification creation fails
    }

    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Error replying to request:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
};

// Update request status (admin only)
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'REPLIED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const query = `
      UPDATE CUSTOMER_CARE_REQUEST 
      SET STATUS = ?, UPDATED_AT = NOW()
      WHERE REQUEST_ID = ?
    `;
    
    const [result] = await db.execute(query, [status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Get user's own requests
const getUserRequests = async (req, res) => {
  try {
    const userId = req.user.userId; // Fix: use userId instead of user_id
    
    if (!userId) {
      return res.status(400).json({ error: 'User authentication required' });
    }
    
    const query = `
      SELECT 
        REQUEST_ID,
        SUBJECT,
        MESSAGE,
        STATUS,
        CREATED_AT,
        UPDATED_AT,
        ADMIN_REPLY,
        REPLIED_AT
      FROM CUSTOMER_CARE_REQUEST 
      WHERE USER_ID = ?
      ORDER BY CREATED_AT DESC
    `;
    
    const [requests] = await db.execute(query, [userId]);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ error: 'Failed to fetch your requests' });
  }
};

// Get request statistics
const getRequestStats = async (req, res) => {
  try {
    const totalQuery = 'SELECT COUNT(*) as total FROM CUSTOMER_CARE_REQUEST';
    const openQuery = "SELECT COUNT(*) as open FROM CUSTOMER_CARE_REQUEST WHERE STATUS = 'OPEN'";
    const repliedQuery = "SELECT COUNT(*) as replied FROM CUSTOMER_CARE_REQUEST WHERE STATUS = 'REPLIED'";
    const closedQuery = "SELECT COUNT(*) as closed FROM CUSTOMER_CARE_REQUEST WHERE STATUS = 'CLOSED'";
    
    const [totalResult] = await db.execute(totalQuery);
    const [openResult] = await db.execute(openQuery);
    const [repliedResult] = await db.execute(repliedQuery);
    const [closedResult] = await db.execute(closedQuery);
    
    res.json({
      total: totalResult[0].total,
      open: openResult[0].open,
      replied: repliedResult[0].replied,
      closed: closedResult[0].closed
    });
  } catch (error) {
    console.error('Error fetching request stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  replyToRequest,
  updateRequestStatus,
  getUserRequests,
  getRequestStats
};
