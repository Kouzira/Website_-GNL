const express = require('express');
const router = express.Router();

const {
  loginUser,
  refreshToken,
  getCurrentUser,
  logoutUser,
  register,
  changePassword,
  updateUser,
} = require('../controllers/authController');

const { authenticateToken } = require('../middlewares/authMiddleware');

// Public routes
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/register', register);
router.post('/change-password', authenticateToken, changePassword);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logoutUser);
router.put('/:id', authenticateToken, updateUser);

module.exports = router;
