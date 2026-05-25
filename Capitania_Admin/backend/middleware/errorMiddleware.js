// Middleware de manejo de errores centralizado
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Error de validación de express-validator
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Datos de entrada inválidos',
            errors: err.errors
        });
    }

    // Error de validación de datos
    if (err.name === 'Validation') {
        return res.status(400).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    // Error interno del servidor
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
};

module.exports = errorHandler;