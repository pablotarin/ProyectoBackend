const jwt = require('jsonwebtoken');
const User = require('../api/models/User.js');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No se proporcionó token de autenticación' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado' 
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado. Se requieren privilegios de administrador' 
    });
  }
  next();
};

const canModifyUser = (req, res, next) => {
  const targetUserId = req.params.id;
  const currentUser = req.user;

  if (currentUser.role === 'admin') {
    return next();
  }

  if (currentUser._id.toString() !== targetUserId) {
    return res.status(403).json({ 
      success: false, 
      message: 'No tienes permiso para modificar esta cuenta' 
    });
  }

  next();
};

module.exports = { authenticate, isAdmin, canModifyUser };