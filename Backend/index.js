// ...existing code...
// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;
const { searchShows } = require('./controllers/searchController');
const { uploadPath } = require('./config/multerConfig');

// Ensure upload directory exists
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

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

app.use(require('./routes/episodes'));

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
