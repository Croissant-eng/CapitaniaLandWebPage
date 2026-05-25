const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllEventos, createEvento, deleteEvento } = require('../services/eventoService');

// Validaciones para crear evento
const validateEvento = [
    body('titulo').notEmpty().withMessage('El título es requerido'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida'),
    body('fecha_evento').notEmpty().withMessage('La fecha del evento es requerida')
];

// Obtener todos los eventos especiales
const getAll = async (req, res) => {
    try {
        const eventos = await getAllEventos();
        // Ensure we always return an array, even if empty
        const dataArray = Array.isArray(eventos) ? eventos : [];
        res.json(dataArray);
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar eventos'
        });
    }
};

// Crear un nuevo evento especial
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

        const { titulo, descripcion, fecha_evento, imagen_url } = req.body;

        await createEvento(titulo, descripcion, fecha_evento, imagen_url);
        res.status(201).json({
            success: true,
            message: 'Evento creado'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear evento'
        });
    }
};

// Eliminar un evento especial
const deleteEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteEvento(id);
        res.json({
            success: true,
            message: 'Evento eliminado'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar evento'
        });
    }
};

module.exports = {
    getAll,
    create,
    deleteEventoById,
    validateEvento
};