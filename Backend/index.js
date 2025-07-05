const express = require('express');
const pool = require('./db'); // MySQL pool
const app = express();
const port = 5000;

const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_super_secret_key'; // move to .env in production
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join(__dirname, 'public/images/user');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/user');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueName = `${baseName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  }
});



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
});

// ======================== SEARCH ========================
app.get('/search', authenticateToken, async (req, res) => {
  const query = req.query.query || '';
  if (query.trim() === '') {
    return res.json({ results: [] });
  }

  try {
    const [rows] = await pool.query(`
      SELECT s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING,
             GROUP_CONCAT(g.GENRE_NAME SEPARATOR ', ') AS GENRES
      FROM \`SHOW\` s
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      WHERE s.TITLE LIKE ?
      GROUP BY s.SHOW_ID
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
  console.log('🔍 Frontpage route hit by:', req.user?.email);
  try {
    const userEmail = req.user.email;

    const [userRows] = await pool.query(`
      SELECT U.USER_FIRSTNAME,U.PROFILE_PICTURE

      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
      LIMIT 1
    `, [userEmail]);
    console.log('🔍 User rows:', userRows);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userName = userRows[0].USER_FIRSTNAME;

    const [trendingshows] = await pool.query(`
      SELECT s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING, s.TEASER, 
            GROUP_CONCAT(g.GENRE_NAME SEPARATOR ', ') AS GENRES
      FROM \`SHOW\` s
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      GROUP BY s.SHOW_ID
      ORDER BY s.WATCH_COUNT DESC
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
      JOIN \`SHOW\` s ON s.SHOW_ID = se.SHOW_ID
      WHERE p.EMAIL = ?
        AND ue.WATCHED = 1
    `, [userEmail]);

    res.json({ userName,profilePicture: userRows[0].PROFILE_PICTURE || null, trendingshows, watchagainshows, allshows });
  } catch (err) {
    console.error('Error fetching frontpage:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Status:', err.response.status);
    } else {
      console.error('No response received:', err.request);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================== USER PROFILE ========================
app.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    const [userRows] = await pool.query(`
  SELECT u.USER_FIRSTNAME, u.USER_LASTNAME, u.PHONE_NO, u.BIRTH_DATE, 
         u.PROFILE_PICTURE,
         p.EMAIL, c.COUNTRY_NAME
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
  profilePicture: user.PROFILE_PICTURE || '' // ✅ send picture filename
});
  } catch (err) {
    console.error('Error fetching user profile:', err);
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

// ======================== ACTORS ========================
app.get('/actors', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ACTOR_ID, ACTOR_FIRSTNAME, ACTOR_LASTNAME, PICTURE FROM ACTOR
    `);
    
    const actors = rows.map(a => ({
      ACTOR_ID: a.ACTOR_ID,
      NAME: a.ACTOR_FIRSTNAME + ' ' + a.ACTOR_LASTNAME,
      PICTURE: a.PICTURE,
    }));
    
    res.json(actors);
  } catch (err) {
    console.error('Error fetching actors:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/actor/:id', authenticateToken, async (req, res) => {
  const actorId = req.params.id;

  try {
    const [[actor]] = await pool.query(`
      SELECT ACTOR_FIRSTNAME, ACTOR_LASTNAME, BIOGRAPHY, PICTURE
      FROM ACTOR
      WHERE ACTOR_ID = ?
    `, [actorId]);

    if (!actor) return res.status(404).json({ error: 'Actor not found' });

    const [shows] = await pool.query(
      `SELECT s.SHOW_ID, s.TITLE, s.THUMBNAIL
       FROM \`SHOW\` s
       JOIN SHOW_CAST sa ON s.SHOW_ID = sa.SHOW_ID
       WHERE sa.ACTOR_ID = ?`,
      [actorId]
    );

    res.json({
      NAME: actor.ACTOR_FIRSTNAME + ' ' + actor.ACTOR_LASTNAME,
      BIOGRAPHY: actor.BIOGRAPHY,
      PICTURE: actor.PICTURE,
      SHOWS: shows
    });
  } catch (err) {
    console.error('Error fetching actor:', err);
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
app.put('/user/profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
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

    // Get USER_ID and PERSON_ID based on email
    const [[userRow]] = await pool.query(`
      SELECT p.PERSON_ID, u.USER_ID 
      FROM PERSON p 
      JOIN USER u ON p.PERSON_ID = u.PERSON_ID 
      WHERE p.EMAIL = ?
    `, [userEmail]);

    if (!userRow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { PERSON_ID, USER_ID } = userRow;

    // Update email in PERSON
    await pool.query(
      'UPDATE PERSON SET EMAIL = ? WHERE PERSON_ID = ?',
      [EMAIL, PERSON_ID]
    );

    // Build update USER query
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
      BIRTH_DATE,
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

    await pool.query(updateQuery, updateParams);

    // Respond with updated user info
    res.json({
      user: {
        firstName: USER_FIRSTNAME,
        lastName: USER_LASTNAME,
        email: EMAIL,
        birthdate: BIRTH_DATE,
        phone: PHONE_NO,
        country: COUNTRY_NAME,
        profilePicture: profilePicture || null
      }
    });

  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

// Toggle favorite status
app.post('/favorite/:showId', authenticateToken, async (req, res) => {
  const userEmail = req.user.email;
  const showId = req.params.showId;

  try {
    // Get USER_ID from email
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
      LIMIT 1
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Check if already favorite
    const [rows] = await pool.query(
      'SELECT * FROM FAV_LIST_SHOW WHERE USER_ID = ? AND SHOW_ID = ?',
      [userId, showId]
    );

    if (rows.length > 0) {
      // Remove from favorites
      await pool.query(
        'DELETE FROM FAV_LIST_SHOW WHERE USER_ID = ? AND SHOW_ID = ?',
        [userId, showId]
      );
      return res.json({ favorite: false });
    } else {
      // Add to favorites
      await pool.query(
        'INSERT INTO FAV_LIST_SHOW (USER_ID, SHOW_ID, ADD_DATE, WATCHED) VALUES (?, ?, CURDATE(), 0)',
        [userId, showId]
      );
      return res.json({ favorite: true });
    }
  } catch (err) {
    console.error('Favorite toggle error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
});


app.get('/favorites', authenticateToken, async (req, res) => {
  const userEmail = req.user.email;

  try {
    // Get USER_ID from email
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
      LIMIT 1
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Get favorite shows for user
    const [favorites] = await pool.query(`
      SELECT s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING,
             GROUP_CONCAT(g.GENRE_NAME SEPARATOR ', ') AS GENRES
      FROM FAV_LIST_SHOW f
      JOIN \`SHOW\` s ON f.SHOW_ID = s.SHOW_ID
      LEFT JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      LEFT JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      WHERE f.USER_ID = ?
      GROUP BY s.SHOW_ID
      ORDER BY f.ADD_DATE DESC
    `, [userId]);

    res.json({ favorites });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Database error' });
  }
});



// ======================== START SERVER ========================
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});