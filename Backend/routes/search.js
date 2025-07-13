const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { getGenres, searchShows } = require('../controllers/searchController');

router.get('/genres', /*authenticateToken,*/ getGenres);
router.get('/', /*authenticateToken,*/ searchShows);

module.exports = router;
