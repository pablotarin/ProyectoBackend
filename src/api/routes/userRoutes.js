const express = require('express');
const { 
  register, 
  login, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  changeUserRole,
  addFavoriteMovie,
  removeFavoriteMovie
} = require('../controllers/userController');
const { authenticate, isAdmin, canModifyUser } = require('../../middlewares/auth');
const { uploadUser } = require('../../middlewares/file')

const router = express.Router();

router.post('/register', uploadUser.single('image'), register);
router.post('/login', login);

router.get('/', authenticate, isAdmin, getAllUsers);
router.get('/:id', authenticate, canModifyUser, getUserById);
router.put('/:id', authenticate, canModifyUser, uploadUser.single('image'), updateUser);
router.delete('/:id', authenticate, canModifyUser, deleteUser);

router.patch('/:id/role', authenticate, isAdmin, changeUserRole);

router.post('/:id/favorites', authenticate, canModifyUser, addFavoriteMovie);
router.delete('/:id/favorites', authenticate, canModifyUser, removeFavoriteMovie);

module.exports = router;