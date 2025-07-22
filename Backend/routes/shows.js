// routes/shows.js
const express = require('express');
const router = express.Router();
const { 
  getShowDetails, 
  getAllShows, 
  getCategories, 
  getPublishers, 
  getStatuses, 
  getAgeRestrictions, 
  updateShow,
  uploadThumbnail,
  uploadBanner
} = require('../controllers/showController');
const { thumbnailUpload, bannerUpload } = require('../config/showImageConfig');

router.get('/show/:id', getShowDetails);
router.get('/admin/shows', getAllShows);
router.get('/admin/categories', getCategories);
router.get('/admin/publishers', getPublishers);
router.get('/admin/statuses', getStatuses);
router.get('/admin/age-restrictions', getAgeRestrictions);
router.put('/admin/shows/:id', updateShow);
router.post('/admin/shows/:id/upload-thumbnail', thumbnailUpload.single('thumbnail'), uploadThumbnail);
router.post('/admin/shows/:id/upload-banner', bannerUpload.single('banner'), uploadBanner);

module.exports = router;
