const Movie = require("../models/Movie.js");
const { deleteImgCloudinary } = require("../../utils/deleteFile.js");

const createMovie = async (req, res) => {
  try {
    const movieData = req.body;

    if (req.file) {
      movieData.poster = req.file.path;
    }

    const movie = await Movie.create(movieData);
    res.status(201).json({
      success: true,
      message: "Película creada exitosamente",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear película",
      error: error.message,
    });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener películas",
      error: error.message,
    });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Película no encontrada",
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener película",
      error: error.message,
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const updateData = req.body;

    let oldPosterUrl = null;

    if (req.file) {
      const movie = await Movie.findById(movieId);

      if (movie.poster) {
        oldPosterUrl = movie.poster;
      }

      updateData.poster = req.file.path;
    }

    const movie = await Movie.findByIdAndUpdate(movieId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Película no encontrada",
      });
    }

    if (oldPosterUrl) {
      await deleteImgCloudinary(oldPosterUrl);
    }

    res.json({
      success: true,
      message: "Película actualizada exitosamente",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar película",
      error: error.message,
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Película no encontrada",
      });
    }

    if (movie.poster) {
      await deleteImgCloudinary(movie.poster);
    }
    
    await Movie.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Película eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar película",
      error: error.message,
    });
  }
};

const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const movies = await Movie.find({ genre }).sort({ rating: -1 });

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar películas por género",
      error: error.message,
    });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
};
