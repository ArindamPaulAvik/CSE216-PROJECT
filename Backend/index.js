// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import database connection
const pool = require('./db'); // Add this line

const app = express();
const port = process.env.PORT || 5000;
const { searchShows } = require('./controllers/searchController');
const { uploadPath, actorUploadPath, directorUploadPath } = require('./config/multerConfig');

// Define show image paths
const showThumbnailPath = path.join(__dirname, '../frontend/public/shows');
const showBannerPath = path.join(__dirname, '../frontend/public/banners');

// Ensure upload directories exist
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
if (!fs.existsSync(actorUploadPath)) fs.mkdirSync(actorUploadPath, { recursive: true });
if (!fs.existsSync(directorUploadPath)) fs.mkdirSync(directorUploadPath, { recursive: true });
if (!fs.existsSync(showThumbnailPath)) fs.mkdirSync(showThumbnailPath, { recursive: true });
if (!fs.existsSync(showBannerPath)) fs.mkdirSync(showBannerPath, { recursive: true });

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',      // Local development
    'https://rnbdom.vercel.app'   // Your Vercel deployment
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Database test route (optional - you can remove this later)
app.get('/api/db-test', async (req, res) => {
  try {
    const [results] = await pool.execute('SELECT 1 + 1 AS result');
    res.json({ message: 'Database connected successfully!', result: results[0] });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Route registration
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(require('./routes/auth'));
app.use(require('./routes/frontpage'));
app.use(require('./routes/shows'));
app.use(require('./routes/users'));
app.use(require('./routes/favorites'));
//app.use(require('./routes/search'));
app.use('/search', require('./routes/search'));
app.use('/comments', require('./routes/comments'));
app.use('/directors', require('./routes/directors'));
app.use('/actors', require('./routes/actors'));
app.use('/admin', require('./routes/admin'));
app.use('/awards', require('./routes/awards'));
app.use('/violations', require('./routes/violations'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/reports', require('./routes/reports'));
app.use('/faqs', require('./routes/faqs'));
app.use('/user-management', require('./routes/userManagement'));
app.use('/customer-care', require('./routes/customerCare'));
app.use('/subscriptions', require('./routes/subscriptions'));
app.use('/methods', require('./routes/methods'));
app.use('/ratings', require('./routes/ratings'));
app.use('/promo', require('./routes/promo'));
app.use('/watch', require('./routes/watch'));
app.use(require('./routes/notifications'));
app.use('/user-join-stats', require('./routes/userJoinStats'));
app.use('/income-stats', require('./routes/incomeStats'));
app.use('/offers', require('./routes/offers'));
app.use('/publishers', require('./routes/publishers'));

// Add settings route for user preferences
app.use(require('./routes/settings'));

app.use(require('./routes/episodes'));

const promotionsRouter = require('./routes/promotions');
app.use('/promotions', promotionsRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Database connection initialized');
});

// Route to list all stored procedures
app.get('/api/replace-support-trigger', async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const results = [];

    // Create the trigger (capitalized table names, assume SUPPORT_REQUEST table)
    const DELETE_QUERY = `
-- Step 1: Find all deletable parent and child comment IDs
CREATE TEMPORARY TABLE to_delete_ids AS
SELECT parent.COMMENT_ID AS target_id
FROM COMMENT parent
WHERE parent.DELETED = 1
  AND NOT EXISTS (
    SELECT 1
    FROM COMMENT child
    WHERE child.PARENT_ID = parent.COMMENT_ID
      AND child.DELETED = 0
  )
UNION
SELECT child.COMMENT_ID
FROM COMMENT child
JOIN COMMENT parent ON child.PARENT_ID = parent.COMMENT_ID
WHERE parent.DELETED = 1
  AND NOT EXISTS (
    SELECT 1
    FROM COMMENT c2
    WHERE c2.PARENT_ID = parent.COMMENT_ID
      AND c2.DELETED = 0
  );

-- Step 2: Delete from COMMENT where ID is in that temp list
DELETE FROM COMMENT
WHERE COMMENT_ID IN (
  SELECT target_id FROM to_delete_ids
);

-- Optional: Drop the temp table
DROP TEMPORARY TABLE to_delete_ids;
`;

    await connection.query(DELETE_QUERY);
    results.push('DELETED');

    res.status(200).json({
      success: true,
      message: 'Support reply trigger successfully replaced',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error replacing support reply trigger:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to replace support reply trigger',
      error: error.message,
      timestamp: new Date().toISOString()
    });

  } finally {
    if (connection) connection.release();
  }
});
