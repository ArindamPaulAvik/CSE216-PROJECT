// controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_super_secret_key';
const saltRounds = 10;

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // First, get the person and check password
    const [personRows] = await pool.query(
      `SELECT PERSON_ID, PASSWORD_HASHED FROM PERSON WHERE EMAIL = ?`,
      [email]
    );

    if (personRows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, personRows[0].PASSWORD_HASHED);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const personId = personRows[0].PERSON_ID;

    // Check if person is a user
    const [userRows] = await pool.query(
      `SELECT USER_ID FROM USER WHERE PERSON_ID = ?`,
      [personId]
    );

    if (userRows.length > 0) {
      const userId = userRows[0].USER_ID;
      const token = jwt.sign({ userId, email, userType: 'user' }, SECRET_KEY, { expiresIn: '2h' });
      return res.status(200).json({ 
        message: 'Login successful', 
        token, 
        userId, 
        userType: 'user',
        redirectTo: '/frontpage'
      });
    }

    // Check if person is an admin
    const [adminRows] = await pool.query(
      `SELECT ADMIN_ID, ADMIN_TYPE FROM ADMIN WHERE PERSON_ID = ?`,
      [personId]
    );

    if (adminRows.length > 0) {
      const adminId = adminRows[0].ADMIN_ID;
      const adminType = adminRows[0].ADMIN_TYPE;
      const token = jwt.sign({ adminId, email, userType: 'admin', adminType }, SECRET_KEY, { expiresIn: '2h' });
      
      let redirectTo = '/admin-frontpage';
      switch(adminType) {
        case 'Support':
          redirectTo = '/support-admin-frontpage';
          break;
        case 'Content':
          redirectTo = '/content-admin-frontpage';
          break;
        case 'Marketing':
          redirectTo = '/marketing-admin-frontpage';
          break;
      }
      
      return res.status(200).json({ 
        message: 'Login successful', 
        token, 
        adminId, 
        userType: 'admin',
        adminType,
        redirectTo
      });
    }

    // Check if person is a publisher
    const [publisherRows] = await pool.query(
      `SELECT PUBLISHER_ID FROM PUBLISHER WHERE PERSON_ID = ?`,
      [personId]
    );

    if (publisherRows.length > 0) {
      const publisherId = publisherRows[0].PUBLISHER_ID;
      const token = jwt.sign({ publisherId, email, userType: 'publisher' }, SECRET_KEY, { expiresIn: '2h' });
      return res.status(200).json({ 
        message: 'Login successful', 
        token, 
        publisherId, 
        userType: 'publisher',
        redirectTo: '/publisher-frontpage'
      });
    }

    // If person exists but is not associated with any role
    return res.status(401).json({ error: 'Account not properly configured' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.register = async (req, res) => {
  const { email, password, userFirstname, userLastname, countryId, birthdate } = req.body;
  if (!email || !password || !userFirstname || !userLastname || !countryId || !birthdate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [existing] = await pool.query('SELECT PERSON_ID FROM PERSON WHERE EMAIL = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [personResult] = await pool.query(
      'INSERT INTO PERSON (EMAIL, PASSWORD_HASHED) VALUES (?, ?)',
      [email, hashedPassword]
    );
    const personId = personResult.insertId;

    await pool.query(
      `INSERT INTO USER (PERSON_ID, COUNTRY_ID, USER_FIRSTNAME, USER_LASTNAME, BIRTH_DATE)
       VALUES (?, ?, ?, ?, ?)`,
      [personId, countryId, userFirstname, userLastname, birthdate]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
