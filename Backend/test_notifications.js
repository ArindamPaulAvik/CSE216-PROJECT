const pool = require('./db');

async function testNotifications() {
  try {
    // Testing notification system...
    
    // Check if NOTIFICATIONS table exists
    const [notifTables] = await pool.query(`
      SHOW TABLES LIKE 'NOTIFICATIONS'
    `);
    // NOTIFICATIONS table exists: notifTables.length > 0
    
    // Check if USER_NOTIFICATIONS table exists
    const [userNotifTables] = await pool.query(`
      SHOW TABLES LIKE 'USER_NOTIFICATIONS'
    `);
    // USER_NOTIFICATIONS table exists: userNotifTables.length > 0
    
    if (notifTables.length > 0) {
      // Check notifications count
      const [notifCount] = await pool.query('SELECT COUNT(*) as count FROM NOTIFICATIONS');
      // Total notifications in DB: notifCount[0].count
      
      // Show all notifications
      const [allNotifications] = await pool.query('SELECT * FROM NOTIFICATIONS LIMIT 5');
      // Sample notifications: allNotifications
    }
    
    if (userNotifTables.length > 0) {
      // Check user notifications count
      const [userNotifCount] = await pool.query('SELECT COUNT(*) as count FROM USER_NOTIFICATIONS');
      // Total user notifications in DB: userNotifCount[0].count
      
      // Show all user notifications
      const [allUserNotifications] = await pool.query('SELECT * FROM USER_NOTIFICATIONS LIMIT 5');
      // Sample user notifications: allUserNotifications
    }
    
    // Check users table
    const [users] = await pool.query(`
      SELECT u.USER_ID, p.EMAIL 
      FROM PERSON p 
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID 
      LIMIT 3
    `);
    // Sample users: users
    
  } catch (error) {
    console.error('❌ Error testing notifications:', error);
  } finally {
    process.exit(0);
  }
}

testNotifications();
