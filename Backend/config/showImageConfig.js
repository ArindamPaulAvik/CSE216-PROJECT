// config/showImageConfig.js
const multer = require('multer');
const path = require('path');

// Storage configuration for show thumbnails - saving to frontend directory
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../backend/public/shows');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const showId = req.params.id;
    const timestamp = Date.now();
    const filename = `${showId}_thumb_${timestamp}${ext}`;
    cb(null, filename);
  }
});

// Storage configuration for show banners - saving to frontend directory
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../backend/public/banners');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const showId = req.params.id;
    const timestamp = Date.now();
    const filename = `${showId}_banner_${timestamp}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files allowed'));
  }
  cb(null, true);
};

const thumbnailUpload = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

const bannerUpload = multer({
  storage: bannerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for banners
  fileFilter
});

module.exports = { 
  thumbnailUpload, 
  bannerUpload,
  thumbnailStorage,
  bannerStorage
};
