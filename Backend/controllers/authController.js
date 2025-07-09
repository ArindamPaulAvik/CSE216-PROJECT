// controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_super_secret_key';
const saltRounds = 10;

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      `SELECT u.USER_ID, p.PASSWORD_HASHED 
       FROM PERSON p
       JOIN USER u ON p.PERSON_ID = u.PERSON_ID
       WHERE p.EMAIL = ?`,
      [email]
    );

    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, rows[0].PASSWORD_HASHED);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const userId = rows[0].USER_ID;
    const token = jwt.sign({ userId, email }, SECRET_KEY, { expiresIn: '2h' });

    res.status(200).json({ message: 'Login successful', token, userId });
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
