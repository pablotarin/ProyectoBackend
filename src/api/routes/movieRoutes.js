const express = require('express');
const { 
  createMovie, 
  getAllMovies, 
  getMovieById, 
  updateMovie, 
  deleteMovie,
  getMoviesByGenre
} = require('../controllers/movieController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { uploadMovie } = require('../../middlewares/file');

const router = express.Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.get('/genre/:genre', getMoviesByGenre);

router.post('/', authenticate, isAdmin, uploadMovie.single('poster'), createMovie);
router.put('/:id', authenticate, isAdmin, uploadMovie.single('poster'), updateMovie);
router.delete('/:id', authenticate, isAdmin, deleteMovie);

module.exports = router;
