const express = require('express');
const pool = require('./db'); // MySQL pool
const app = express();
const port = 5000;

const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_super_secret_key'; // move to .env in production

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ======================== LOGIN ========================
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT PASSWORD_HASHED FROM PERSON WHERE EMAIL = ?',
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, rows[0].PASSWORD_HASHED);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '2h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================== REGISTER ========================
const saltRounds = 10;

app.post('/register', async (req, res) => {
  const { email, password, userFirstname, userLastname, countryId } = req.body;
  if (!email || !password || !userFirstname || !userLastname || !countryId) {
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
      `INSERT INTO USER (PERSON_ID, COUNTRY_ID, USER_FIRSTNAME, USER_LASTNAME)
       VALUES (?, ?, ?, ?)`,
      [personId, countryId, userFirstname, userLastname]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/search', authenticateToken, async (req, res) => {
  const query = req.query.query || '';
  if (query.trim() === '') {
    return res.json({ results: [] });
  }

  try {
    const [rows] = await pool.query(`
      SELECT SHOW_ID, TITLE, DESCRIPTION, THUMBNAIL, RATING
      FROM \`SHOW\`
      WHERE TITLE LIKE ?
      LIMIT 20
    `, [`%${query}%`]);

    res.json({ results: rows });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// ======================== FRONTPAGE ========================
app.get('/frontpage', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;

    const [userRows] = await pool.query(`
      SELECT U.USER_FIRSTNAME
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
      LIMIT 1
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userName = userRows[0].USER_FIRSTNAME;

    const [trendingshows] = await pool.query(`
      SELECT SHOW_ID, TITLE, DESCRIPTION, THUMBNAIL, RATING, TEASER
      FROM \`SHOW\`
      WHERE TRENDING = 1
      LIMIT 4
    `);
    const [allshows] = await pool.query(`
      SELECT SHOW_ID, TITLE, THUMBNAIL, RATING
      FROM \`SHOW\`
      
    `);

    const [watchagainshows] = await pool.query(`
      SELECT DISTINCT s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING
      FROM PERSON p
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID
      JOIN USER_EPISODE ue ON ue.USER_ID = u.USER_ID
      JOIN SHOW_EPISODE se ON se.SHOW_EPISODE_ID = ue.SHOW_EPISODE_ID
      JOIN SEASON sn ON sn.SEASON_ID = se.SEASON_ID
      JOIN \`SHOW\` s ON s.SHOW_ID = sn.SHOW_ID
      WHERE p.EMAIL = ?
        AND ue.WATCHED = '1'
    `, [userEmail]);

    res.json({ userName, trendingshows, watchagainshows });
  } catch (err) {
    console.error('Error fetching frontpage:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================== GET FULL SHOW DETAILS ========================
app.get('/show/:id', async (req, res) => {
  const showId = req.params.id;

  try {
    const [rows] = await pool.query(`
      SELECT s.*, 
             c.CATEGORY_NAME,
             p.PUBLISHER_NAME,
             a.AGE_RESTRICTION_NAME
      FROM \`SHOW\` s
      LEFT JOIN CATEGORY c ON s.CATEGORY_ID = c.CATEGORY_ID
      LEFT JOIN PUBLISHER p ON s.PUBLISHER_ID = p.PUBLISHER_ID
      LEFT JOIN AGE_RESTRICTION a ON s.AGE_RESTRICTION_ID = a.AGE_RESTRICTION_ID
      WHERE s.SHOW_ID = ?
      LIMIT 1
    `, [showId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching show:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== ADMIN USERS ========================
app.get('/admin_users', async (req, res) => {
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
});

// ======================== CREATE USER ========================
app.post('/users', async (req, res) => {
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
});

// ======================== START SERVER ========================
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
