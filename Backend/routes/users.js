// routes/users.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { getProfile, updateProfile, getAllUsers, createUser, getUserComments, updatePersonalDetails, updateBillingInfo, updatePreferences } = require('../controllers/userController');
const { upload } = require('../config/multerConfig');

router.get('/user/profile', authenticateToken, getProfile);
router.put('/user/profile', authenticateToken, upload.single('profilePicture'), updateProfile);
router.put('/users/profile', authenticateToken, updatePersonalDetails);
router.put('/users/billing', authenticateToken, updateBillingInfo);
router.put('/users/preferences', authenticateToken, updatePreferences);
router.get('/user/comments', authenticateToken, getUserComments);
router.get('/admin_users', getAllUsers);
router.post('/users', createUser);

module.exports = router;
