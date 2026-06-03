const { body, validationResult } = require('express-validator');
const { loginEmpleado: serviceLoginEmpleado } = require('../services/empleadoService');

// Validación para login de empleado
const validateLoginEmpleado = [
    body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Login de empleado
const loginEmpleado = async (req, res) => {
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

        const result = await serviceLoginEmpleado(username, password);

        // Establecer token en cookie HttpOnly
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 8 * 60 * 60 * 1000 // 8 horas
        });

        res.json({
            success: true,
            token: result.token,
            username: result.username,
            role: result.role
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

module.exports = {
    validateLoginEmpleado,
    loginEmpleado
};