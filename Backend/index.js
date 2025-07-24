// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;
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
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route registration
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

app.use(require('./routes/episodes'));

const promotionsRouter = require('./routes/promotions');
app.use('/promotions', promotionsRouter);

// Start server
app.listen(port, () => {
  // Server running at http://localhost:${port}
});
