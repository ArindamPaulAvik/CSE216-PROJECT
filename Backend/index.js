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

    // Get user details
    const [userRows] = await pool.query(`
      SELECT U.USER_ID, U.USER_FIRSTNAME, U.PROFILE_PICTURE
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
      LIMIT 1
    `, [userEmail]);
    
    console.log('🔍 User rows:', userRows);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;
    const userName = userRows[0].USER_FIRSTNAME;

    // Get trending shows
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

    // Get all shows
    const [allshows] = await pool.query(`
      SELECT SHOW_ID, TITLE, THUMBNAIL, RATING
      FROM \`SHOW\`
    `);

    // Get watch again shows
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

    // Get recommended shows based on user's top genres
    const [recommendedShows] = await pool.query(`
      WITH user_genre_preferences AS (
        -- Get genres from user's favorite shows
        SELECT 
            sg.GENRE_ID,
            g.GENRE_NAME,
            COUNT(*) as preference_count
        FROM FAV_LIST_SHOW fls
        JOIN SHOW_GENRE sg ON fls.SHOW_ID = sg.SHOW_ID
        JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
        WHERE fls.USER_ID = ?
        GROUP BY sg.GENRE_ID, g.GENRE_NAME
        
        UNION ALL
        
        -- Get genres from user's watched episodes
        SELECT 
            sg.GENRE_ID,
            g.GENRE_NAME,
            COUNT(*) as preference_count
        FROM USER_EPISODE ue
        JOIN SHOW_EPISODE se ON ue.SHOW_EPISODE_ID = se.SHOW_EPISODE_ID
        JOIN SHOW_GENRE sg ON se.SHOW_ID = sg.SHOW_ID
        JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
        WHERE ue.USER_ID = ? 
        AND ue.WATCHED = 1
        GROUP BY sg.GENRE_ID, g.GENRE_NAME
      ),

      top_user_genres AS (
        -- Get top 4 genres based on user's preferences
        SELECT 
            GENRE_ID,
            GENRE_NAME,
            SUM(preference_count) as total_preference_count
        FROM user_genre_preferences
        GROUP BY GENRE_ID, GENRE_NAME
        ORDER BY total_preference_count DESC
        LIMIT 4
      ),

      user_content AS (
        -- Get all shows the user has already favorited or watched
        SELECT DISTINCT s.SHOW_ID
        FROM \`SHOW\` s
        LEFT JOIN FAV_LIST_SHOW fls ON s.SHOW_ID = fls.SHOW_ID AND fls.USER_ID = ?
        LEFT JOIN SHOW_EPISODE se ON s.SHOW_ID = se.SHOW_ID
        LEFT JOIN USER_EPISODE ue ON se.SHOW_EPISODE_ID = ue.SHOW_EPISODE_ID AND ue.USER_ID = ?
        WHERE fls.USER_ID IS NOT NULL OR ue.USER_ID IS NOT NULL
      )

      -- Final recommendation query
      SELECT DISTINCT
          s.SHOW_ID,
          s.TITLE,
          s.DESCRIPTION,
          s.THUMBNAIL,
          s.RATING,
          s.RELEASE_DATE,
          s.WATCH_COUNT,
          GROUP_CONCAT(DISTINCT g.GENRE_NAME ORDER BY g.GENRE_NAME SEPARATOR ', ') as GENRES,
          COUNT(DISTINCT tug.GENRE_ID) as matching_genres_count,
          -- Calculate recommendation score based on rating, watch count, and genre matches
          (COALESCE(s.RATING, 0) * 0.3 + 
           (COALESCE(s.WATCH_COUNT, 0) / 1000) * 0.2 + 
           COUNT(DISTINCT tug.GENRE_ID) * 0.5) as recommendation_score
      FROM \`SHOW\` s
      JOIN SHOW_GENRE sg ON s.SHOW_ID = sg.SHOW_ID
      JOIN GENRE g ON sg.GENRE_ID = g.GENRE_ID
      JOIN top_user_genres tug ON g.GENRE_ID = tug.GENRE_ID
      -- Exclude shows user has already favorited or watched
      WHERE s.SHOW_ID NOT IN (SELECT SHOW_ID FROM user_content)
      GROUP BY s.SHOW_ID, s.TITLE, s.DESCRIPTION, s.THUMBNAIL, s.RATING, s.RELEASE_DATE, s.WATCH_COUNT
      -- Only recommend shows that match at least one of the top genres
      HAVING matching_genres_count > 0
      ORDER BY recommendation_score DESC, s.RATING DESC, s.WATCH_COUNT DESC
      LIMIT 4
    `, [userId, userId, userId, userId]);

    res.json({ 
      userName,
      profilePicture: userRows[0].PROFILE_PICTURE || null, 
      trendingshows, 
      watchagainshows, 
      allshows,
      recommendedShows 
    });
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

// Add this endpoint to your index.js file, preferably near your other favorite-related endpoints

// Check if a specific show is favorited by the user
app.get('/favorite/:showId', authenticateToken, async (req, res) => {
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

    // Check if show is in user's favorites
    const [rows] = await pool.query(
      'SELECT * FROM FAV_LIST_SHOW WHERE USER_ID = ? AND SHOW_ID = ?',
      [userId, showId]
    );

    // Return whether the show is favorited or not
    res.json({ favorite: rows.length > 0 });
  } catch (err) {
    console.error('Error checking favorite status:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ======================== COMMENT SYSTEM ========================

// Get comments for a specific episode
app.get('/episode/:episodeId/comments', authenticateToken, async (req, res) => {
  const episodeId = req.params.episodeId;
  const userEmail = req.user.email;

  try {
    // Get current user ID
    const [[userRow]] = await pool.query(`
      SELECT U.USER_ID FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (!userRow) return res.status(404).json({ error: 'User not found' });

    const userId = userRow.USER_ID;

    // Fetch comments with user liked and disliked flags
    const [comments] = await pool.query(`
      SELECT c.COMMENT_ID,
             c.TEXT,
             c.TIME,
             c.LIKE_COUNT,
             c.DISLIKE_COUNT,
             c.EDITED,
             c.PINNED,
             c.PARENT_ID,
             u.USER_FIRSTNAME,
             u.USER_LASTNAME,
             u.PROFILE_PICTURE,
             CASE WHEN cl.USER_ID IS NOT NULL THEN 1 ELSE 0 END AS USER_LIKED,
             CASE WHEN cd.USER_ID IS NOT NULL THEN 1 ELSE 0 END AS USER_DISLIKED
      FROM COMMENT c
      JOIN USER u ON c.USER_ID = u.USER_ID
      LEFT JOIN COMMENT_LIKE cl ON cl.COMMENT_ID = c.COMMENT_ID AND cl.USER_ID = ?
      LEFT JOIN COMMENT_DISLIKE cd ON cd.COMMENT_ID = c.COMMENT_ID AND cd.USER_ID = ?
      WHERE c.SHOW_EPISODE_ID = ?
        AND c.DELETED = 0
      ORDER BY c.TIME DESC
    `, [userId, userId, episodeId]);

    res.json({ comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get replies for a specific comment
app.get('/comment/:commentId/replies', authenticateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const [replies] = await pool.query(`
      SELECT 
        c.COMMENT_ID,
        c.TEXT,
        c.TIME,
        c.LIKE_COUNT,
        c.DISLIKE_COUNT,
        c.EDITED,
        c.IMG_LINK,
        u.USER_FIRSTNAME,
        u.USER_LASTNAME,
        u.PROFILE_PICTURE
      FROM COMMENT c
      JOIN USER u ON c.USER_ID = u.USER_ID
      WHERE c.PARENT_ID = ? 
        AND c.DELETED = 0
      ORDER BY c.TIME ASC
      LIMIT ? OFFSET ?
    `, [commentId, parseInt(limit), offset]);

    // Get total count for pagination
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM COMMENT c
      WHERE c.PARENT_ID = ? 
        AND c.DELETED = 0
    `, [commentId]);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      replies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReplies: total,
        hasMore: page < totalPages
      }
    });
  } catch (err) {
    console.error('Error fetching replies:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Post a new comment
// Post a new comment - SIMPLIFIED VERSION (no image upload)
app.post('/episode/:episodeId/comment', authenticateToken, async (req, res) => {
  const episodeId = req.params.episodeId;
  const { text, parentId, parent_id } = req.body;
  const finalParentId = parentId || parent_id || null;
  const userEmail = req.user.email;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  if (text.length > 500) {
    return res.status(400).json({ error: 'Comment text cannot exceed 500 characters' });
  }

  try {
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    const [episodeRows] = await pool.query(
      'SELECT SHOW_EPISODE_ID FROM SHOW_EPISODE WHERE SHOW_EPISODE_ID = ?',
      [episodeId]
    );

    if (episodeRows.length === 0) {
      return res.status(404).json({ error: 'Episode not found' });
    }

    if (finalParentId) {
      const [parentRows] = await pool.query(
        'SELECT COMMENT_ID FROM COMMENT WHERE COMMENT_ID = ? AND DELETED = 0',
        [finalParentId]
      );

      if (parentRows.length === 0) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }

    const [result] = await pool.query(`
      INSERT INTO COMMENT (
        USER_ID,
        SHOW_EPISODE_ID,
        PARENT_ID,
        TIME,
        TEXT,
        LIKE_COUNT,
        DISLIKE_COUNT,
        DELETED,
        EDITED,
        PINNED
      ) VALUES (?, ?, ?, NOW(), ?, 0, 0, 0, 0, 0)
    `, [userId, episodeId, finalParentId, text.trim()]);

    const [newComment] = await pool.query(`
      SELECT
        c.COMMENT_ID,
        c.TEXT,
        c.TIME,
        c.LIKE_COUNT,
        c.DISLIKE_COUNT,
        c.EDITED,
        c.PINNED,
        c.PARENT_ID,
        u.USER_FIRSTNAME,
        u.USER_LASTNAME,
        u.PROFILE_PICTURE
      FROM COMMENT c
      JOIN USER u ON c.USER_ID = u.USER_ID
      WHERE c.COMMENT_ID = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Comment posted successfully',
      comment: newComment[0]
    });
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({
      error: 'Database error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// Like/Unlike a comment
app.post('/comment/:commentId/like', authenticateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const userEmail = req.user.email;

  try {
    const [[userRow]] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (!userRow) return res.status(404).json({ error: 'User not found' });

    const userId = userRow.USER_ID;

    // Check if already liked
    const [[likeRow]] = await pool.query(`
      SELECT * FROM COMMENT_LIKE WHERE USER_ID = ? AND COMMENT_ID = ?
    `, [userId, commentId]);

    if (likeRow) {
      // UNLIKE
      await pool.query(`DELETE FROM COMMENT_LIKE WHERE USER_ID = ? AND COMMENT_ID = ?`, [userId, commentId]);
      await pool.query(`UPDATE COMMENT SET LIKE_COUNT = LIKE_COUNT - 1 WHERE COMMENT_ID = ?`, [commentId]);

      const [[updated]] = await pool.query(`SELECT LIKE_COUNT FROM COMMENT WHERE COMMENT_ID = ?`, [commentId]);
      return res.json({ user_liked: false, like_count: updated.LIKE_COUNT });
    } else {
      // LIKE
      await pool.query(`INSERT INTO COMMENT_LIKE (USER_ID, COMMENT_ID) VALUES (?, ?)`, [userId, commentId]);
      await pool.query(`UPDATE COMMENT SET LIKE_COUNT = LIKE_COUNT + 1 WHERE COMMENT_ID = ?`, [commentId]);

      const [[updated]] = await pool.query(`SELECT LIKE_COUNT FROM COMMENT WHERE COMMENT_ID = ?`, [commentId]);
      return res.json({ user_liked: true, like_count: updated.LIKE_COUNT });
    }
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/comment/:commentId/like', authenticateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const userEmail = req.user.email;

  try {
    const [[userRow]] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (!userRow) return res.status(404).json({ error: 'User not found' });

    const userId = userRow.USER_ID;

    const [[likeRow]] = await pool.query(`
      SELECT * FROM COMMENT_LIKE WHERE USER_ID = ? AND COMMENT_ID = ?
    `, [userId, commentId]);

    res.json({ user_liked: !!likeRow });
  } catch (err) {
    console.error('Error checking like:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


app.post('/comment/:commentId/dislike', authenticateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const userEmail = req.user.email;

  try {
    // Get user ID
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Check if comment exists and is not deleted
    const [commentRows] = await pool.query(
      'SELECT COMMENT_ID FROM COMMENT WHERE COMMENT_ID = ? AND DELETED = 0',
      [commentId]
    );

    if (commentRows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user already disliked this comment
    const [[dislikeRow]] = await pool.query(`
      SELECT * FROM COMMENT_DISLIKE WHERE USER_ID = ? AND COMMENT_ID = ?
    `, [userId, commentId]);

    if (dislikeRow) {
      // If disliked before, remove dislike
      await pool.query(`DELETE FROM COMMENT_DISLIKE WHERE USER_ID = ? AND COMMENT_ID = ?`, [userId, commentId]);
      await pool.query(`UPDATE COMMENT SET DISLIKE_COUNT = DISLIKE_COUNT - 1 WHERE COMMENT_ID = ?`, [commentId]);

      const [[updated]] = await pool.query(`SELECT DISLIKE_COUNT FROM COMMENT WHERE COMMENT_ID = ?`, [commentId]);
      return res.json({ user_disliked: false, dislike_count: updated.DISLIKE_COUNT });
    } else {
      // If not disliked before, add dislike
      await pool.query(`INSERT INTO COMMENT_DISLIKE (USER_ID, COMMENT_ID) VALUES (?, ?)`, [userId, commentId]);
      await pool.query(`UPDATE COMMENT SET DISLIKE_COUNT = DISLIKE_COUNT + 1 WHERE COMMENT_ID = ?`, [commentId]);

      const [[updated]] = await pool.query(`SELECT DISLIKE_COUNT FROM COMMENT WHERE COMMENT_ID = ?`, [commentId]);
      return res.json({ user_disliked: true, dislike_count: updated.DISLIKE_COUNT });
    }

  } catch (err) {
    console.error('Error toggling dislike:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/comment/:commentId/dislike', authenticateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const userEmail = req.user.email;

  try {
    // Get user ID
    const [[userRow]] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (!userRow) return res.status(404).json({ error: 'User not found' });

    const userId = userRow.USER_ID;

    // Check if disliked
    const [[dislikeRow]] = await pool.query(`
      SELECT * FROM COMMENT_DISLIKE WHERE USER_ID = ? AND COMMENT_ID = ?
    `, [userId, commentId]);

    res.json({ user_disliked: !!dislikeRow });
  } catch (err) {
    console.error('Error checking dislike:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// Edit a comment
app.put('/comment/:commentId', authenticateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const { text } = req.body;
  const userEmail = req.user.email;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  if (text.length > 500) {
    return res.status(400).json({ error: 'Comment text cannot exceed 500 characters' });
  }

  try {
    // Get user ID
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Check if comment exists and belongs to user
    const [commentRows] = await pool.query(
      'SELECT COMMENT_ID, USER_ID FROM COMMENT WHERE COMMENT_ID = ? AND DELETED = 0',
      [commentId]
    );

    if (commentRows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (commentRows[0].USER_ID !== userId) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    // Update comment
    await pool.query(`
      UPDATE COMMENT 
      SET TEXT = ?, EDITED = 1 
      WHERE COMMENT_ID = ?
    `, [text.trim(), commentId]);

    // Get updated comment
    const [updatedComment] = await pool.query(`
      SELECT 
        c.COMMENT_ID,
        c.TEXT,
        c.TIME,
        c.LIKE_COUNT,
        c.DISLIKE_COUNT,
        c.EDITED,
        c.PINNED,
        c.IMG_LINK,
        u.USER_FIRSTNAME,
        u.USER_LASTNAME,
        u.PROFILE_PICTURE
      FROM COMMENT c
      JOIN USER u ON c.USER_ID = u.USER_ID
      WHERE c.COMMENT_ID = ?
    `, [commentId]);

    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment[0]
    });
  } catch (err) {
    console.error('Error editing comment:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a comment
app.delete('/comment/:commentId', authenticateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const userEmail = req.user.email;

  try {
    // Get user ID
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Check if comment exists and belongs to user
    const [commentRows] = await pool.query(
      'SELECT COMMENT_ID, USER_ID FROM COMMENT WHERE COMMENT_ID = ? AND DELETED = 0',
      [commentId]
    );

    if (commentRows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (commentRows[0].USER_ID !== userId) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    // Soft delete comment (mark as deleted instead of actually deleting)
    await pool.query(`
      UPDATE COMMENT 
      SET DELETED = 1, TEXT = '[Comment deleted]'
      WHERE COMMENT_ID = ?
    `, [commentId]);

    res.json({
      message: 'Comment deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Report a comment
app.post('/comment/:commentId/report', authenticateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const { reportText, violationIds } = req.body;
  const userEmail = req.user.email;

  if (!reportText || reportText.trim().length === 0) {
    return res.status(400).json({ error: 'Report text is required' });
  }

  if (!violationIds || violationIds.length === 0) {
    return res.status(400).json({ error: 'At least one violation type must be selected' });
  }

  try {
    // Get user ID
    const [userRows] = await pool.query(`
      SELECT U.USER_ID
      FROM PERSON P
      JOIN USER U ON P.PERSON_ID = U.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].USER_ID;

    // Check if comment exists
    const [commentRows] = await pool.query(
      'SELECT COMMENT_ID FROM COMMENT WHERE COMMENT_ID = ? AND DELETED = 0',
      [commentId]
    );

    if (commentRows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user already reported this comment
    const [existingReport] = await pool.query(
      'SELECT REPORT_ID FROM REPORT WHERE USER_ID = ? AND COMMENT_ID = ?',
      [userId, commentId]
    );

    if (existingReport.length > 0) {
      return res.status(409).json({ error: 'You have already reported this comment' });
    }

    // Insert report
    const [reportResult] = await pool.query(`
      INSERT INTO REPORT (USER_ID, COMMENT_ID, REPORT_TIME, REPORT_TEXT)
      VALUES (?, ?, NOW(), ?)
    `, [userId, commentId, reportText.trim()]);

    const reportId = reportResult.insertId;

    // Insert violation associations
    for (const violationId of violationIds) {
      await pool.query(`
        INSERT INTO REPORT_VIOLATION (REPORT_ID, VIOLATION_ID)
        VALUES (?, ?)
      `, [reportId, violationId]);
    }

    res.status(201).json({
      message: 'Comment reported successfully',
      reportId: reportId
    });
  } catch (err) {
    console.error('Error reporting comment:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get violation types (for reporting)
app.get('/violations', authenticateToken, async (req, res) => {
  try {
    const [violations] = await pool.query('SELECT * FROM VIOLATION ORDER BY VIOLATION_ID');
    res.json(violations);
  } catch (err) {
    console.error('Error fetching violations:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: Pin/Unpin a comment
app.post('/comment/:commentId/pin', authenticateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const userEmail = req.user.email;

  try {
    // Check if user is admin (you'll need to implement admin check)
    const [adminRows] = await pool.query(`
      SELECT A.ADMIN_ID
      FROM PERSON P
      JOIN ADMIN A ON P.PERSON_ID = A.PERSON_ID
      WHERE P.EMAIL = ?
    `, [userEmail]);

    if (adminRows.length === 0) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Toggle pin status
    const [commentRows] = await pool.query(
      'SELECT PINNED FROM COMMENT WHERE COMMENT_ID = ? AND DELETED = 0',
      [commentId]
    );

    if (commentRows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const newPinStatus = commentRows[0].PINNED === 1 ? 0 : 1;

    await pool.query(`
      UPDATE COMMENT 
      SET PINNED = ? 
      WHERE COMMENT_ID = ?
    `, [newPinStatus, commentId]);

    res.json({
      message: newPinStatus === 1 ? 'Comment pinned successfully' : 'Comment unpinned successfully',
      pinned: newPinStatus === 1
    });
  } catch (err) {
    console.error('Error pinning/unpinning comment:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get episode info (for comment section)
app.get('/episode/:episodeId', authenticateToken, async (req, res) => {
  const episodeId = req.params.episodeId;

  try {
    const [episode] = await pool.query(`
      SELECT 
        se.SHOW_EPISODE_ID,
        se.SHOW_EPISODE_TITLE,
        se.EPISODE_NUMBER,
        se.SHOW_EPISODE_DESCRIPTION,
        se.SHOW_EPISODE_DURATION,
        se.SHOW_EPISODE_RELEASE_DATE,
        se.VIDEO_URL,
        s.TITLE as SHOW_TITLE,
        s.SHOW_ID
      FROM SHOW_EPISODE se
      JOIN \`SHOW\` s ON se.SHOW_ID = s.SHOW_ID
      WHERE se.SHOW_EPISODE_ID = ?
    `, [episodeId]);

    if (episode.length === 0) {
      return res.status(404).json({ error: 'Episode not found' });
    }

    res.json(episode[0]);
  } catch (err) {
    console.error('Error fetching episode:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get episodes for a show
app.get('/show/:showId/episodes', authenticateToken, async (req, res) => {
  const showId = req.params.showId;

  try {
    const [episodes] = await pool.query(`
      SELECT 
        SHOW_EPISODE_ID,
        EPISODE_NUMBER,
        SHOW_EPISODE_TITLE,
        SHOW_EPISODE_DESCRIPTION,
        SHOW_EPISODE_DURATION,
        SHOW_EPISODE_RELEASE_DATE,
        VIDEO_URL
      FROM SHOW_EPISODE
      WHERE SHOW_ID = ?
      ORDER BY EPISODE_NUMBER ASC
    `, [showId]);

    res.json(episodes);
  } catch (err) {
    console.error('Error fetching episodes:', err);
    res.status(500).json({ error: 'Database error' });
  }
});




// ======================== START SERVER ========================
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});