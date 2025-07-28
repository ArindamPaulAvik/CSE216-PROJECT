// config/multerConfig.js
const multer = require('multer');
const path = require('path');

// All paths should point to backend/public folders
const uploadPath = path.join(__dirname, '../public/images/user');
const actorUploadPath = path.join(__dirname, '../public/actors');
const directorUploadPath = path.join(__dirname, '../public/directors');
const awardUploadPath = path.join(__dirname, '../public/awards');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueName = `${baseName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const actorStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, actorUploadPath),
  filename: (req, file, cb) => {
    const baseName = path.basename(file.originalname, path.extname(file.originalname));
    const uniqueName = `${baseName.toLowerCase().replace(/\s+/g, '_')}-${Date.now()}.jpg`;
    cb(null, uniqueName);
  }
});

const directorStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, directorUploadPath),
  filename: (req, file, cb) => {
    const baseName = path.basename(file.originalname, path.extname(file.originalname));
    const uniqueName = `${baseName.toLowerCase().replace(/\s+/g, '_')}-${Date.now()}.jpg`;
    cb(null, uniqueName);
  }
});

const awardStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, awardUploadPath),
  filename: (req, file, cb) => {
    const baseName = path.basename(file.originalname, path.extname(file.originalname));
    const uniqueName = `${baseName.toLowerCase().replace(/\s+/g, '_')}-${Date.now()}.jpg`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  }
});

const actorUpload = multer({
  storage: actorStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  }
});

const directorUpload = multer({
  storage: directorStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  }
});

const awardUpload = multer({
  storage: awardStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  }
});

module.exports = { upload, uploadPath, actorUpload, actorUploadPath, directorUpload, directorUploadPath, awardUpload, awardUploadPath };