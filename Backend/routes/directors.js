const express = require('express');
const router = express.Router();
const directorsController = require('../controllers/directorsController');
const { directorUpload } = require('../config/multerConfig');

// Get all directors
router.get('/', directorsController.getAllDirectors);

// Get a single director by ID
router.get('/:directorId', directorsController.getDirectorById);

// Get all shows for a director
router.get('/:directorId/shows', directorsController.getShowsByDirector);

// Create a new director
router.post('/', directorUpload.single('picture'), directorsController.createDirector);

// Update an existing director
router.put('/:directorId', directorUpload.single('picture'), directorsController.updateDirector);

// Delete a director
router.delete('/:directorId', directorsController.deleteDirector);

module.exports = router;
