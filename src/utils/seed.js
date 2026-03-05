require("dotenv").config();
const { connectDB } = require("../config/database.js");
const { connectCloudinary } = require("../config/cloudinary.js");
const Movie = require("../api/models/Movie.js");
const cloudinary = require("cloudinary").v2;
const https = require("https");
const http = require("http");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const movies = [
  {
    title: "El Padrino",
    director: "Francis Ford Coppola",
    year: 1972,
    genre: "Drama",
    duration: 175,
    rating: 9.2,
    synopsis:
      "La historia de la familia Corleone, una de las más poderosas familias de la mafia en Nueva York.",
    imageUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  },
  {
    title: "El Caballero Oscuro",
    director: "Christopher Nolan",
    year: 2008,
    genre: "Acción",
    duration: 152,
    rating: 9.0,
    synopsis:
      "Batman enfrenta al Joker, un criminal caótico que amenaza con destruir Gotham.",
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
    genre: "Thriller",
    duration: 154,
    rating: 8.9,
    synopsis: "Historias entrelazadas del mundo criminal de Los Ángeles.",
    imageUrl: "https://image.tmdb.org/t/p/w500/fIE3lAGcZDV1G6XM5KmuWnNsPp1.jpg",
  },
  {
    title: "Interestelar",
    director: "Christopher Nolan",
    year: 2014,
    genre: "Ciencia Ficción",
    duration: 169,
    rating: 8.7,
    synopsis:
      "Un grupo de astronautas viaja a través de un agujero de gusano buscando salvar a la humanidad.",
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
    year: 1994,
    genre: "Drama",
    duration: 142,
    rating: 8.8,
    synopsis:
      "La historia de un hombre sencillo que presencia y participa en grandes momentos históricos.",
    imageUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  },
  {
    title: "Gladiator",
    director: "Ridley Scott",
    year: 2000,
    genre: "Aventura",
    duration: 155,
    rating: 8.5,
    synopsis: "Un general romano traicionado busca venganza como gladiador.",
    imageUrl: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
  },
  {
    title: "Parásitos",
    director: "Bong Joon-ho",
    year: 2019,
    genre: "Thriller",
    duration: 132,
    rating: 8.5,
    synopsis:
      "Una familia con dificultades económicas se infiltra poco a poco en la vida de una familia rica.",
    imageUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    title: "La La Land",
    director: "Damien Chazelle",
    year: 2016,
    genre: "Romance",
    duration: 128,
    rating: 8.0,
    synopsis:
      "Una historia de amor entre una aspirante a actriz y un pianista de jazz en Los Ángeles.",
    imageUrl: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
  },
  {
    title: "Matrix",
    director: "Lana y Lilly Wachowski",
    year: 1999,
    genre: "Ciencia Ficción",
    duration: 136,
    rating: 8.7,
    synopsis:
      "Un hacker descubre la verdad sobre la realidad y su papel en la guerra contra las máquinas.",
    imageUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },
  {
    title: "Toy Story",
    director: "John Lasseter",
    year: 1995,
    genre: "Animación",
    duration: 81,
    rating: 8.3,
    synopsis: "Los juguetes cobran vida cuando los humanos no están mirando.",
    imageUrl: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
  },
];

// Hecho por IA porque no sabía como descargar las imágenes desde la url.
const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        },
        (response) => {
          if (response.statusCode === 301 || response.statusCode === 302) {
            return downloadImage(response.headers.location)
              .then(resolve)
              .catch(reject);
          }

          const chunks = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", () => resolve(Buffer.concat(chunks)));
          response.on("error", reject);
        },
      )
      .on("error", reject);
  });
};

const uploadToCloudinary = (buffer, title) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Movies",
        public_id: title.replace(/\s+/g, "-").toLowerCase(),
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

const seedMovies = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    console.log("Eliminando películas existentes...");
    await Movie.deleteMany({});

    console.log("Subiendo imágenes a Cloudinary...\n");

    const moviesWithCloudinary = [];

    for (const movie of movies) {
      try {
        console.log(`${movie.title}...`);

        const imageBuffer = await downloadImage(movie.imageUrl);
        const result = await uploadToCloudinary(imageBuffer, movie.title);

        moviesWithCloudinary.push({
          title: movie.title,
          director: movie.director,
          year: movie.year,
          genre: movie.genre,
          duration: movie.duration,
          rating: movie.rating,
          synopsis: movie.synopsis,
          poster: result.secure_url,
        });
      } catch (error) {
        console.log(`Error: ${error.message}\n`);
      }
    }

    if (moviesWithCloudinary.length > 0) {
      console.log("Insertando películas...");
      await Movie.insertMany(moviesWithCloudinary);
      console.log(`\n${moviesWithCloudinary.length} películas insertadas`);
    } else {
      console.log("No se pudo subir ninguna imagen");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedMovies();
