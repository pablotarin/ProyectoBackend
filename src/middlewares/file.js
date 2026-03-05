const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const userStorage  = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Users',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const movieStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Movies',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const uploadUser  = multer({ userStorage });
const uploadMovie = multer({ storage: movieStorage });

module.exports = { uploadUser, uploadMovie }