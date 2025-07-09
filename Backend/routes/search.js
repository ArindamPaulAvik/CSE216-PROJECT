// routes/search.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
// optional
const { searchShows } = require('../controllers/searchController');

router.get('/', /*authenticateToken,*/ searchShows);


module.exports = router;
