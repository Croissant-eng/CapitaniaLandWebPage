const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllPromociones, createPromocion, deletePromocion } = require('../services/promocionService');

// Validaciones para crear promoción
const validatePromocion = [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida'),
    body('precio_destacado').notEmpty().withMessage('El precio es requerido')
];

// Obtener todas las promociones
const getAll = async (req, res) => {
    try {
        const promociones = await getAllPromociones();
        // Ensure we always return an array, even if empty
        const dataArray = Array.isArray(promociones) ? promociones : [];
        res.json(dataArray);
    } catch (error) {
        console.error('Error al cargar promociones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar promociones'
        });
    }
};

// Crear una nueva promoción
const create = async (req, res) => {
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

        const { nombre, descripcion, precio_destacado, imagen_url } = req.body;

        await createPromocion(nombre, descripcion, precio_destacado, imagen_url);
        res.status(201).json({
            success: true,
            message: 'Promoción creada'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear promoción'
        });
    }
};

// Eliminar una promoción
const deletePromocionById = async (req, res) => {
    try {
        const { id } = req.params;
        await deletePromocion(id);
        res.json({
            success: true,
            message: 'Promoción eliminada'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar promoción'
        });
    }
};

module.exports = {
    getAll,
    create,
    deletePromocionById,
    validatePromocion
};