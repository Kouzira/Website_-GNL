const express = require('express');
const router = express.Router();

const { authenticateToken, permit } = require('../middlewares/authMiddleware');
const {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/adminController');

// Bảo vệ route admin
router.use(authenticateToken);
router.use(permit('admin'));

router.get('/', fetchUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;