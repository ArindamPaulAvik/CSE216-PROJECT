// controllers/userController.js
const pool = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const [userRows] = await pool.query(`
      SELECT u.USER_FIRSTNAME, u.USER_LASTNAME, u.PHONE_NO, u.BIRTH_DATE, 
             u.PROFILE_PICTURE, p.EMAIL, c.COUNTRY_NAME
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      LEFT JOIN COUNTRY c ON u.COUNTRY_ID = c.COUNTRY_ID
      WHERE p.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRows[0];
    res.json({
      firstName: user.USER_FIRSTNAME,
      lastName: user.USER_LASTNAME,
      email: user.EMAIL,
      phone: user.PHONE_NO,
      birthdate: user.BIRTH_DATE,
      country: user.COUNTRY_NAME,
      profilePicture: user.PROFILE_PICTURE || ''
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const {
      USER_FIRSTNAME,
      USER_LASTNAME,
      EMAIL,
      BIRTH_DATE,
      PHONE_NO
    } = req.body;

    const profilePicture = req.file ? req.file.filename : null;

    // Format birthdate to ensure it's in YYYY-MM-DD format
    let formattedBirthDate = BIRTH_DATE;
    if (BIRTH_DATE) {
      try {
        // If it's an ISO string, extract just the date part
        if (typeof BIRTH_DATE === 'string' && BIRTH_DATE.includes('T')) {
          formattedBirthDate = BIRTH_DATE.split('T')[0];
        }
        // If it's already in YYYY-MM-DD format, keep it
        else if (typeof BIRTH_DATE === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(BIRTH_DATE)) {
          formattedBirthDate = BIRTH_DATE;
        }
        // If it's a Date object or other format, convert it
        else {
          const dateObj = new Date(BIRTH_DATE);
          if (isNaN(dateObj.getTime())) {
            throw new Error('Invalid date format');
          }
          formattedBirthDate = dateObj.toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error formatting birth date:', error);
        return res.status(400).json({ error: 'Invalid birth date format' });
      }
    }

    const [[userRow]] = await pool.query(`
      SELECT p.PERSON_ID, u.USER_ID 
      FROM PERSON p 
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID 
      WHERE p.EMAIL = ?
    `, [userEmail]);

    if (!userRow) return res.status(404).json({ error: 'User not found' });

    const { PERSON_ID, USER_ID } = userRow;

    await pool.query('UPDATE PERSON SET EMAIL = ? WHERE PERSON_ID = ?', [EMAIL, PERSON_ID]);

    const updateFields = [
      'USER_FIRSTNAME = ?',
      'USER_LASTNAME = ?',
      'BIRTH_DATE = ?',
      'PHONE_NO = ?'
    ];

    const updateParams = [
      USER_FIRSTNAME,
      USER_LASTNAME,
      formattedBirthDate, // Use formatted date
      PHONE_NO
    ];

    if (profilePicture) {
      updateFields.push('PROFILE_PICTURE = ?');
      updateParams.push(profilePicture);
    }

    updateParams.push(USER_ID);

    const updateQuery = `
      UPDATE USER 
      SET ${updateFields.join(', ')}
      WHERE USER_ID = ?
    `;

    console.log('Updating with formatted birth date:', formattedBirthDate);
    await pool.query(updateQuery, updateParams);

    res.json({
      user: {
        firstName: USER_FIRSTNAME,
        lastName: USER_LASTNAME,
        email: EMAIL,
        birthdate: formattedBirthDate,
        phone: PHONE_NO,
        profilePicture: profilePicture || null
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM USER');
    const formatted = rows.map(user => {
      if (user.BIRTH_DATE instanceof Date) {
        const d = user.BIRTH_DATE;
        user.BIRTH_DATE = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      }
      return user;
    });
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.createUser = async (req, res) => {
  let {
    PERSON_ID,
    COUNTRY_ID,
    USER_FIRSTNAME,
    USER_LASTNAME,
    PHONE_NO,
    BIRTH_DATE
  } = req.body;

  try {
    if (BIRTH_DATE) {
      const d = new Date(BIRTH_DATE);
      if (isNaN(d)) return res.status(400).json({ error: 'Invalid birth date format' });
      BIRTH_DATE = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    }

    const sql = `
      INSERT INTO USER (PERSON_ID, COUNTRY_ID, USER_FIRSTNAME, USER_LASTNAME, PHONE_NO, BIRTH_DATE)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      PERSON_ID,
      COUNTRY_ID,
      USER_FIRSTNAME,
      USER_LASTNAME,
      PHONE_NO,
      BIRTH_DATE
    ]);

    res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getUserComments = async (req, res) => {
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

    // Get all comments by this user with show and episode information
    const [comments] = await pool.query(`
      SELECT 
        c.COMMENT_ID,
        c.TEXT,
        c.TIME,
        c.IMG_LINK,
        c.LIKE_COUNT,
        c.DISLIKE_COUNT,
        c.PARENT_ID,
        c.EDITED,
        c.PINNED,
        se.SHOW_EPISODE_ID,
        se.SHOW_EPISODE_TITLE AS EPISODE_TITLE,
        s.TITLE AS SHOW_TITLE,
        s.SHOW_ID,
        s.THUMBNAIL AS SHOW_THUMBNAIL
      FROM COMMENT c
      JOIN SHOW_EPISODE se ON c.SHOW_EPISODE_ID = se.SHOW_EPISODE_ID
      JOIN \`SHOW\` s ON se.SHOW_ID = s.SHOW_ID
      WHERE c.USER_ID = ? AND c.DELETED = 0
      ORDER BY c.TIME DESC
    `, [userId]);

    res.json({ comments });
  } catch (err) {
    console.error('Error fetching user comments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePersonalDetails = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      currentPassword,
      newPassword
    } = req.body;

    // Get user details first
    const [userRows] = await pool.query(`
      SELECT u.USER_ID, u.PERSON_ID, p.EMAIL, p.PASSWORD
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      WHERE p.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRows[0];

    // If password change is requested, verify current password
    if (newPassword && currentPassword) {
      const bcrypt = require('bcrypt');
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.PASSWORD);
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password in PERSON table
      await pool.query(`
        UPDATE PERSON SET PASSWORD = ? WHERE PERSON_ID = ?
      `, [hashedNewPassword, user.PERSON_ID]);
    }

    // Update email in PERSON table if changed
    if (email && email !== userEmail) {
      await pool.query(`
        UPDATE PERSON SET EMAIL = ? WHERE PERSON_ID = ?
      `, [email, user.PERSON_ID]);
    }

    // Update user details in USER table
    await pool.query(`
      UPDATE USER SET 
        USER_FIRSTNAME = ?,
        USER_LASTNAME = ?,
        PHONE_NO = ?,
        BIRTH_DATE = ?
      WHERE USER_ID = ?
    `, [firstName, lastName, phone, dateOfBirth, user.USER_ID]);

    res.json({ message: 'Personal details updated successfully' });
  } catch (err) {
    console.error('Error updating personal details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add these methods to your userController.js file

exports.getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Get user's favorite shows
    const [favorites] = await pool.query(`
      SELECT s.SHOW_ID, s.TITLE, s.THUMBNAIL, s.RATING, s.DESCRIPTION
      FROM FAV_LIST_SHOW fls
      JOIN \`SHOW\` s ON fls.SHOW_ID = s.SHOW_ID
      WHERE fls.USER_ID = ?
      ORDER BY fls.SHOW_ID DESC
    `, [userId]);

    res.json({ favorites });
  } catch (err) {
    console.error('Error fetching user favorites:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserCommentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Get all comments by this user with show and episode information
    const [comments] = await pool.query(`
      SELECT 
        c.COMMENT_ID,
        c.TEXT,
        c.TIME,
        c.IMG_LINK,
        c.LIKE_COUNT,
        c.DISLIKE_COUNT,
        c.PARENT_ID,
        c.EDITED,
        c.PINNED,
        se.SHOW_EPISODE_ID,
        se.SHOW_EPISODE_TITLE AS EPISODE_TITLE,
        s.TITLE AS SHOW_TITLE,
        s.SHOW_ID,
        s.THUMBNAIL AS SHOW_THUMBNAIL
      FROM COMMENT c
      JOIN SHOW_EPISODE se ON c.SHOW_EPISODE_ID = se.SHOW_EPISODE_ID
      JOIN \`SHOW\` s ON se.SHOW_ID = s.SHOW_ID
      WHERE c.USER_ID = ? AND c.DELETED = 0
      ORDER BY c.TIME DESC
    `, [userId]);

    res.json({ comments });
  } catch (err) {
    console.error('Error fetching user comments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerEmail = req.user.email;
    
    // Validate userId
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Get viewer's user ID
    const [viewerRows] = await pool.query(`
      SELECT u.USER_ID
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      WHERE p.EMAIL = ?
    `, [viewerEmail]);

    if (viewerRows.length === 0) {
      return res.status(404).json({ error: 'Viewer not found' });
    }

    const viewerId = viewerRows[0].USER_ID;

    // Check if the target user allows their ratings to be shown
    const [prefsRows] = await pool.query(`
      SELECT SHOW_RATING FROM user_preferences WHERE USER_ID = ?
    `, [userId]);

    const showRatings = prefsRows.length > 0 ? prefsRows[0].SHOW_RATING === 1 : false;
    const isOwnProfile = parseInt(viewerId) === parseInt(userId);

    // Only show ratings if it's their own profile or they allow it
    if (!isOwnProfile && !showRatings) {
      return res.json({ 
        ratings: [],
        message: 'This user has chosen to keep their ratings private'
      });
    }

    // Get user's ratings
    const [ratings] = await pool.query(`
      SELECT s.SHOW_ID, s.TITLE, s.THUMBNAIL, r.RATING_VALUE, r.RATING_DATE, se.SHOW_EPISODE_TITLE
      FROM RATING r
      JOIN SHOW_EPISODE se ON r.SHOW_EPISODE_ID = se.SHOW_EPISODE_ID
      JOIN \`SHOW\` s ON se.SHOW_ID = s.SHOW_ID
      WHERE r.USER_ID = ?
      ORDER BY r.RATING_DATE DESC
    `, [userId]);

    res.json({ ratings });
  } catch (err) {
    console.error('Error fetching user ratings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateBillingInfo = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const {
      cardNumber,
      expiryDate,
      cvv,
      cardholderName,
      billingAddress,
      city,
      postalCode,
      country
    } = req.body;

    // Get user ID
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

    // Check if billing info exists
    const [existingBilling] = await pool.query(`
      SELECT * FROM USER_BILLING WHERE USER_ID = ?
    `, [userId]);

    if (existingBilling.length > 0) {
      // Update existing billing info
      await pool.query(`
        UPDATE USER_BILLING SET 
          CARD_NUMBER = ?,
          EXPIRY_DATE = ?,
          CVV = ?,
          CARDHOLDER_NAME = ?,
          BILLING_ADDRESS = ?,
          CITY = ?,
          POSTAL_CODE = ?,
          COUNTRY = ?
        WHERE USER_ID = ?
      `, [cardNumber, expiryDate, cvv, cardholderName, billingAddress, city, postalCode, country, userId]);
    } else {
      // Create new billing info
      await pool.query(`
        INSERT INTO USER_BILLING 
        (USER_ID, CARD_NUMBER, EXPIRY_DATE, CVV, CARDHOLDER_NAME, BILLING_ADDRESS, CITY, POSTAL_CODE, COUNTRY)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [userId, cardNumber, expiryDate, cvv, cardholderName, billingAddress, city, postalCode, country]);
    }

    res.json({ message: 'Billing information updated successfully' });
  } catch (err) {
    console.error('Error updating billing info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const {
      playTrailerOnHover,
      showMyRatingsToOthers
    } = req.body;

    // Get user ID
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

    // Convert boolean values to integers for the database
    const hoverTrailer = playTrailerOnHover ? 1 : 0;
    const showRating = showMyRatingsToOthers ? 1 : 0;

    // Check if preferences exist
    const [existingPrefs] = await pool.query(`
      SELECT * FROM user_preferences WHERE USER_ID = ?
    `, [userId]);

    if (existingPrefs.length > 0) {
      // Update existing preferences
      await pool.query(`
        UPDATE user_preferences SET 
          HOVER_TRAILER = ?,
          SHOW_RATING = ?
        WHERE USER_ID = ?
      `, [hoverTrailer, showRating, userId]);
    } else {
      // Create new preferences
      await pool.query(`
        INSERT INTO user_preferences 
        (USER_ID, HOVER_TRAILER, SHOW_RATING)
        VALUES (?, ?, ?)
      `, [userId, hoverTrailer, showRating]);
    }

    res.json({ message: 'Preferences updated successfully' });
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Get user ID
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

    // Get preferences
    const [prefs] = await pool.query(`
      SELECT HOVER_TRAILER, SHOW_RATING FROM user_preferences WHERE USER_ID = ?
    `, [userId]);

    if (prefs.length === 0) {
      // Return default preferences if none exist
      return res.json({
        playTrailerOnHover: false,
        showMyRatingsToOthers: false
      });
    }

    // Convert integer values back to boolean
    res.json({
      playTrailerOnHover: prefs[0].HOVER_TRAILER === 1,
      showMyRatingsToOthers: prefs[0].SHOW_RATING === 1
    });
  } catch (err) {
    console.error('Error fetching preferences:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerEmail = req.user.email;

    console.log('Getting profile for userId:', userId, 'by viewer:', viewerEmail);

    // Get viewer's user ID for privacy checks
    const [viewerRows] = await pool.query(`
      SELECT u.USER_ID
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      WHERE p.EMAIL = ?
    `, [viewerEmail]);

    if (viewerRows.length === 0) {
      console.log('Viewer not found');
      return res.status(404).json({ error: 'Viewer not found' });
    }

    const viewerId = viewerRows[0].USER_ID;

    // Get target user profile - simplified query first
    const [userRows] = await pool.query(`
      SELECT u.USER_ID, u.USER_FIRSTNAME, u.USER_LASTNAME, u.PROFILE_PICTURE, 
             p.EMAIL
      FROM USER u
      JOIN PERSON p ON u.PERSON_ID = p.PERSON_ID
      WHERE u.USER_ID = ?
      LIMIT 1
    `, [userId]);

    if (userRows.length === 0) {
      console.log('Target user not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const targetUser = userRows[0];
    const targetUserId = targetUser.USER_ID;

    console.log('Target user found:', targetUser.USER_FIRSTNAME, targetUser.USER_LASTNAME);

    // Get target user's privacy preferences with error handling
    let showRatings = false;
    try {
      const [prefsRows] = await pool.query(`
        SELECT SHOW_RATING FROM user_preferences WHERE USER_ID = ?
      `, [targetUserId]);
      showRatings = prefsRows.length > 0 ? prefsRows[0].SHOW_RATING === 1 : false;
    } catch (prefsError) {
      console.log('Error getting preferences, using default:', prefsError.message);
      showRatings = false;
    }

    // Get user's watch history with better error handling
    let watchHistoryRows = [];
    try {
      const [historyResult] = await pool.query(`
        SELECT DISTINCT s.SHOW_ID, s.TITLE, s.THUMBNAIL, s.RATING, 
               COUNT(DISTINCT ue.SHOW_EPISODE_ID) as episodes_watched
        FROM user_episode ue
        JOIN SHOW_EPISODE se ON ue.SHOW_EPISODE_ID = se.SHOW_EPISODE_ID
        JOIN \`SHOW\` s ON se.SHOW_ID = s.SHOW_ID
        WHERE ue.USER_ID = ? AND ue.WATCHED = 1
        GROUP BY s.SHOW_ID, s.TITLE, s.THUMBNAIL, s.RATING
        ORDER BY MAX(ue.TIMESTAMP) DESC
        LIMIT 20
      `, [targetUserId]);
      watchHistoryRows = historyResult || [];
    } catch (historyError) {
      console.log('Error getting watch history:', historyError.message);
      watchHistoryRows = [];
    }

    // Get user's favorite shows with error handling
    let favoritesRows = [];
    try {
      const [favResult] = await pool.query(`
        SELECT s.SHOW_ID, s.TITLE, s.THUMBNAIL, s.RATING
        FROM FAV_LIST_SHOW fls
        JOIN \`SHOW\` s ON fls.SHOW_ID = s.SHOW_ID
        WHERE fls.USER_ID = ?
        ORDER BY fls.SHOW_ID DESC
        LIMIT 20
      `, [targetUserId]);
      favoritesRows = favResult || [];
    } catch (favError) {
      console.log('Error getting favorites:', favError.message);
      favoritesRows = [];
    }

    // Get user's ratings (only if they allow it)
    let ratingsData = [];
    if (showRatings) {
      try {
        const [ratingsResult] = await pool.query(`
          SELECT s.SHOW_ID, s.TITLE, s.THUMBNAIL, r.RATING, r.REVIEW
          FROM RATING r
          JOIN \`SHOW\` s ON r.SHOW_ID = s.SHOW_ID
          WHERE r.USER_ID = ?
          ORDER BY r.RATING_ID DESC
          LIMIT 20
        `, [targetUserId]);
        ratingsData = ratingsResult || [];
      } catch (ratingsError) {
        console.log('Error getting ratings:', ratingsError.message);
        ratingsData = [];
      }
    }

    console.log('Profile data compiled successfully');

    res.json({
      profile: {
        userId: targetUser.USER_ID,
        firstName: targetUser.USER_FIRSTNAME,
        lastName: targetUser.USER_LASTNAME,
        fullName: `${targetUser.USER_FIRSTNAME} ${targetUser.USER_LASTNAME}`,
        profilePicture: targetUser.PROFILE_PICTURE || null
      },
      watchHistory: watchHistoryRows,
      favorites: favoritesRows,
      ratings: ratingsData,
      canViewRatings: showRatings,
      isOwnProfile: viewerId === targetUserId
    });

  } catch (err) {
    console.error('Error fetching user profile:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Failed to fetch user profile'
    });
  }
};
