const { body, validationResult } = require('express-validator');
const { loginAdmin, getAdminInfo } = require('../services/adminService');

// Validación para login
const validateLogin = [
    body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Login de administrador
const login = async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        const result = await loginAdmin(username, password);

        // Establecer token en cookie HttpOnly
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.json({
            success: true,
            token: result.token,
            username: result.username
        });
    } catch (error) {
        if (error.message === 'Credenciales incorrectas') {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Obtener información del administrador autenticado
const getProfile = async (req, res) => {
    try {
        const adminInfo = await getAdminInfo(req.admin.id);
        res.json({
            success: true,
            data: adminInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener información del administrador'
        });
    }
};

// Cerrar sesión
const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.json({
            success: true,
            message: 'Sesión cerrada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cerrar sesión'
        });
    }
};

module.exports = {
    login,
    getProfile,
    logout,
    validateLogin
};