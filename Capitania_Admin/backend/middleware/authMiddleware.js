const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'capitania_super_secret_key_2026';

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token de las cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado. Token faltante.'
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

// Middleware para verificar rol de administrador
const adminMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado. Token faltante.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Aquí podrías verificar si el usuario tiene rol de admin
        // Por ahora, solo verificamos que el token sea válido
        req.admin = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

module.exports = {
    authMiddleware,
    adminMiddleware
};