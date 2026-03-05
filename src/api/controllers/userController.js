const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/token.js");
const { deleteImgCloudinary } = require("../../utils/deleteFile.js");
const Movie = require("../models/Movie.js");

const register = async (req, res) => {
  try {
    const user = new User(req.body);

    if (!user.username || !user.email || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos obligatorios",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: user.email }, { username: user.username }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El usuario o email ya existe",
      });
    }

    user.role = "user";

    if (req.file) {
      user.image = req.file.path;
    }

    const userDB = await user.save();

    const token = generateToken(userDB._id, userDB.role);
    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: { userDB, token },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        message: "Login exitoso",
        data: { user, token },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("favoriteMovies");
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("favoriteMovies");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email,password } = req.body;
    const userId = req.params.id;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    let oldImageUrl = null;

    if (req.file) {
      const user = await User.findById(userId);

      if (user.image) {
        oldImageUrl = user.image;
      }

      updateData.image = req.file.path;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).populate("favoriteMovies");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (oldImageUrl) {
      await deleteImgCloudinary(oldImageUrl);
    }

    res.json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.id;
    const currentUser = req.user;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser "user" o "admin"',
      });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({
      success: true,
      message: `Rol actualizado a ${role} exitosamente`,
      data: targetUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al cambiar rol",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (user.image) {
      await deleteImgCloudinary(user.image);
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};

const addFavoriteMovie = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const movieExists = await Movie.findById(movieId);
    if (!movieExists) {
      return res.status(404).json({
        success: false,
        message: "Película no encontrada",
      });
    }

    if (user.favoriteMovies.some((id) => id.toString() === movieId)) {
      return res.status(400).json({
        success: false,
        message: "La película ya está en favoritos",
      });
    }

    user.favoriteMovies.push(movieId);
    await user.save();

    const updatedUser = await User.findById(userId).populate("favoriteMovies");

    res.json({
      success: true,
      message: "Película agregada a favoritos",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al agregar película a favoritos",
      error: error.message,
    });
  }
};

const removeFavoriteMovie = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    user.favoriteMovies = user.favoriteMovies.filter(
      (id) => id.toString() !== movieId,
    );
    await user.save();

    const updatedUser = await User.findById(userId).populate("favoriteMovies");

    res.json({
      success: true,
      message: "Película eliminada de favoritos",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar película de favoritos",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  changeUserRole,
  deleteUser,
  addFavoriteMovie,
  removeFavoriteMovie,
};
