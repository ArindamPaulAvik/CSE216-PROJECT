// routes/shows.js
const express = require('express');
const router = express.Router();
const { getShowDetails } = require('../controllers/showController');

router.get('/show/:id', getShowDetails);

module.exports = router;
