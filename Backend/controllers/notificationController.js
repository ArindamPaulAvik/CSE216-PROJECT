// controllers/notificationController.js
const pool = require('../db');

exports.getUserNotifications = async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log('🔔 Fetching notifications for user:', userEmail);
    
    // First check if notifications table has any data
    const [allNotifications] = await pool.query('SELECT COUNT(*) as total FROM NOTIFICATIONS');
    console.log('📊 Total notifications in database:', allNotifications[0].total);
    
    // First get the user ID from email
    const [userRows] = await pool.query(`
      SELECT u.USER_ID 
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      WHERE p.EMAIL = ?
    `, [userEmail]);

    console.log('👤 User query result:', userRows);

    if (userRows.length === 0) {
      console.log('❌ User not found for email:', userEmail);
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;
    console.log('✅ Found user ID:', userId);

    // Check if user has any notification associations
    const [userNotifCount] = await pool.query(`
      SELECT COUNT(*) as count FROM USER_NOTIFICATIONS WHERE USER_ID = ?
    `, [userId]);
    console.log('📊 User notification associations:', userNotifCount[0].count);

    // If no associations exist, create some sample ones for this user
    if (userNotifCount[0].count === 0) {
      console.log('🔧 No user notification associations found, creating sample ones...');
      
      // Get first 5 notifications
      const [sampleNotifications] = await pool.query('SELECT NOTIF_ID FROM NOTIFICATIONS LIMIT 5');
      
      for (const notif of sampleNotifications) {
        await pool.query(`
          INSERT INTO USER_NOTIFICATIONS (USER_ID, NOTIF_ID, IS_READ) 
          VALUES (?, ?, ?)
        `, [userId, notif.NOTIF_ID, Math.random() > 0.5]); // Random read status
      }
      
      console.log('✅ Created', sampleNotifications.length, 'notification associations');
    }

    // Get user's notifications with read status
    const [notifications] = await pool.query(`
      SELECT 
        n.NOTIF_ID,
        n.MESSAGE,
        n.TYPE,
        n.DATA,
        n.CREATED_AT,
        un.IS_READ
      FROM NOTIFICATIONS n
      JOIN USER_NOTIFICATIONS un ON n.NOTIF_ID = un.NOTIF_ID
      WHERE un.USER_ID = ?
      ORDER BY n.CREATED_AT DESC
    `, [userId]);

    console.log('📬 Notification query result:', notifications);
    console.log('📊 Found', notifications.length, 'notifications');

    res.json(notifications);
  } catch (err) {
    console.error('❌ Error fetching user notifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { notificationId } = req.params;
    
    // First get the user ID from email
    const [userRows] = await pool.query(`
      SELECT u.USER_ID 
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      WHERE p.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Mark notification as read
    const [result] = await pool.query(`
      UPDATE USER_NOTIFICATIONS 
      SET IS_READ = TRUE 
      WHERE USER_ID = ? AND NOTIF_ID = ?
    `, [userId, notificationId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    // First get the user ID from email
    const [userRows] = await pool.query(`
      SELECT u.USER_ID 
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      WHERE p.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Mark all notifications as read for this user
    await pool.query(`
      UPDATE USER_NOTIFICATIONS 
      SET IS_READ = TRUE 
      WHERE USER_ID = ?
    `, [userId]);

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    // First get the user ID from email
    const [userRows] = await pool.query(`
      SELECT u.USER_ID 
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      WHERE p.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Count unread notifications
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as unread_count
      FROM USER_NOTIFICATIONS 
      WHERE USER_ID = ? AND IS_READ = FALSE
    `, [userId]);

    res.json({ unreadCount: countResult[0].unread_count });
  } catch (err) {
    console.error('Error getting unread notification count:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { notificationId } = req.params;
    
    // First get the user ID from email
    const [userRows] = await pool.query(`
      SELECT u.USER_ID 
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      WHERE p.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Delete the user-notification association
    const [result] = await pool.query(`
      DELETE FROM USER_NOTIFICATIONS 
      WHERE USER_ID = ? AND NOTIF_ID = ?
    `, [userId, notificationId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
