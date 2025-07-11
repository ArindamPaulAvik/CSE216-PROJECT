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
      PHONE_NO,
      COUNTRY_NAME
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
      'PHONE_NO = ?',
      'COUNTRY_ID = (SELECT COUNTRY_ID FROM COUNTRY WHERE COUNTRY_NAME = ?)'
    ];

    const updateParams = [
      USER_FIRSTNAME,
      USER_LASTNAME,
      formattedBirthDate, // Use formatted date
      PHONE_NO,
      COUNTRY_NAME
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
        country: COUNTRY_NAME,
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
