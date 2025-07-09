// routes/users.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { getProfile, updateProfile, getAllUsers, createUser } = require('../controllers/userController');
const { upload } = require('../config/multerConfig');

router.get('/user/profile', authenticateToken, getProfile);
router.put('/user/profile', authenticateToken, upload.single('profilePicture'), updateProfile);
router.get('/admin_users', getAllUsers);
router.post('/users', createUser);

module.exports = router;
