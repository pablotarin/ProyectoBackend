require('dotenv').config();
const {connectDB} = require('../config/database.js');
const Movie = require('../api/models/Movie.js');

const movies = [
  {
    title: "El Padrino",
    director: "Francis Ford Coppola",
    year: 1972,
    genre: "Drama",
    duration: 175,
    rating: 9.2,
    synopsis: "La historia de la familia Corleone, una de las más poderosas familias de la mafia en Nueva York.",
    poster: "https://m.media-amazon.com/images/I/51rOnIjLqML._AC_.jpg"
  },
  {
    title: "El Caballero Oscuro",
    director: "Christopher Nolan",
    year: 2008,
    genre: "Acción",
    duration: 152,
    rating: 9.0,
    synopsis: "Batman enfrenta al Joker, un criminal caótico que amenaza con destruir Gotham.",
    poster: "https://m.media-amazon.com/images/I/51EbJjlLgYL._AC_.jpg"
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
    genre: "Thriller",
    duration: 154,
    rating: 8.9,
    synopsis: "Historias entrelazadas del mundo criminal de Los Ángeles.",
    poster: "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg"
  },
  {
    title: "Interestelar",
    director: "Christopher Nolan",
    year: 2014,
    genre: "Ciencia Ficción",
    duration: 169,
    rating: 8.7,
    synopsis: "Un grupo de astronautas viaja a través de un agujero de gusano buscando salvar a la humanidad.",
    poster: "https://m.media-amazon.com/images/I/81kz06h6m-L._AC_SY679_.jpg"
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
    year: 1994,
    genre: "Drama",
    duration: 142,
    rating: 8.8,
    synopsis: "La historia de un hombre sencillo que presencia y participa en grandes momentos históricos.",
    poster: "https://m.media-amazon.com/images/I/61+eWzK4FhL._AC_SY679_.jpg"
  },
  {
    title: "Gladiator",
    director: "Ridley Scott",
    year: 2000,
    genre: "Aventura",
    duration: 155,
    rating: 8.5,
    synopsis: "Un general romano traicionado busca venganza como gladiador.",
    poster: "https://m.media-amazon.com/images/I/51A9R9JYHXL._AC_.jpg"
  },
  {
    title: "Parásitos",
    director: "Bong Joon-ho",
    year: 2019,
    genre: "Thriller",
    duration: 132,
    rating: 8.5,
    synopsis: "Una familia con dificultades económicas se infiltra poco a poco en la vida de una familia rica.",
    poster: "https://m.media-amazon.com/images/I/91qS6PpUqTL._AC_SY679_.jpg"
  },
  {
    title: "La La Land",
    director: "Damien Chazelle",
    year: 2016,
    genre: "Romance",
    duration: 128,
    rating: 8.0,
    synopsis: "Una historia de amor entre una aspirante a actriz y un pianista de jazz en Los Ángeles.",
    poster: "https://m.media-amazon.com/images/I/81Zt42ioCgL._AC_SY679_.jpg"
  },
  {
    title: "Matrix",
    director: "Lana y Lilly Wachowski",
    year: 1999,
    genre: "Ciencia Ficción",
    duration: 136,
    rating: 8.7,
    synopsis: "Un hacker descubre la verdad sobre la realidad y su papel en la guerra contra las máquinas.",
    poster: "https://m.media-amazon.com/images/I/51EG732BV3L.jpg"
  },
  {
    title: "Toy Story",
    director: "John Lasseter",
    year: 1995,
    genre: "Animación",
    duration: 81,
    rating: 8.3,
    synopsis: "Los juguetes cobran vida cuando los humanos no están mirando.",
    poster: "https://m.media-amazon.com/images/I/81KtTTgkV4L._AC_SY679_.jpg"
  },
];

const seedMovies = async () => {
  try {
    await connectDB();
    
    console.log('Eliminando películas existentes...');
    await Movie.deleteMany({});
    
    console.log('Insertando películas...');
    await Movie.insertMany(movies);
    
    console.log(`${movies.length} películas insertadas exitosamente`);
    process.exit(0);
  } catch (error) {
    console.error('Error en la semilla:', error.message);
    process.exit(1);
  }
};

seedMovies();