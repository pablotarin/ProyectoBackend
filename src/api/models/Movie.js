const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true
    },
    director: {
      type: String,
      required: [true, 'El director es obligatorio'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'El año es obligatorio'],
      min: [1800, 'El año debe ser mayor a 1800'],
      max: [new Date().getFullYear() + 5, 'El año no puede ser muy lejano en el futuro']
    },
    genre: {
      type: String,
      required: [true, 'El género es obligatorio'],
      enum: ['Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción', 'Romance', 'Thriller', 'Animación', 'Documental', 'Aventura']
    },
    duration: {
      type: Number,
      required: [true, 'La duración es obligatoria'],
      min: [1, 'La duración debe ser al menos 1 minuto']
    },
    rating: {
      type: Number,
      min: [0, 'La calificación mínima es 0'],
      max: [10, 'La calificación máxima es 10'],
      default: 0
    },
    synopsis: {
      type: String,
      required: [true, 'La sinopsis es obligatoria'],
      maxlength: [1000, 'La sinopsis no puede exceder 1000 caracteres']
    },
    poster: {
      type: String,
      default: 'https://via.placeholder.com/300x450?text=No+Poster'
    }
  },
  {
    timestamps: true
  }
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;