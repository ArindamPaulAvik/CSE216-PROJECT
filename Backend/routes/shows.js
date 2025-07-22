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
  uploadBanner,
  getAllGenres,
  getShowGenres,
  updateShowGenres,
  getDashboardAnalytics,
  getShowCast,
  updateShowCast,
  getShowDirectors,
  updateShowDirectors
} = require('../controllers/showController');
const { thumbnailUpload, bannerUpload } = require('../config/showImageConfig');

router.get('/show/:id', getShowDetails);
router.get('/admin/shows', getAllShows);
router.get('/admin/dashboard-analytics', getDashboardAnalytics);
router.get('/admin/categories', getCategories);
router.get('/admin/publishers', getPublishers);
router.get('/admin/statuses', getStatuses);
router.get('/admin/age-restrictions', getAgeRestrictions);
router.get('/admin/genres', getAllGenres);
router.get('/admin/shows/:id/genres', getShowGenres);
router.put('/admin/shows/:id/genres', updateShowGenres);
router.get('/admin/shows/:id/cast', getShowCast);
router.put('/admin/shows/:id/cast', updateShowCast);
router.get('/admin/shows/:id/directors', getShowDirectors);
router.put('/admin/shows/:id/directors', updateShowDirectors);
router.put('/admin/shows/:id', updateShow);
router.post('/admin/shows/:id/upload-thumbnail', thumbnailUpload.single('thumbnail'), uploadThumbnail);
router.post('/admin/shows/:id/upload-banner', bannerUpload.single('banner'), uploadBanner);

module.exports = router;
