require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/database.js");
const userRoutes = require("./src/api/routes/userRoutes.js");
const movieRoutes = require("./src/api/routes/movieRoutes.js");
const { connectCloudinary } = require("./src/config/cloudinary.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
connectCloudinary();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de Gestión de Usuarios y Películas",
    endpoints: {
      users: "/api/users",
      movies: "/api/movies",
    },
  });
});

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  return res
    .status(error.status || 500)
    .json(error.message || "Unexpected error");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
