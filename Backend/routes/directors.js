const express = require('express');
const router = express.Router();
const directorsController = require('../controllers/directorsController');

// Get all directors
router.get('/', directorsController.getAllDirectors);

// Get a single director by ID
router.get('/:directorId', directorsController.getDirectorById);

// Get all shows for a director
router.get('/:directorId/shows', directorsController.getShowsByDirector);

module.exports = router;
