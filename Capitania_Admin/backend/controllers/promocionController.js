const { body, validationResult } = require('express-validator');
const { getAllPromociones, createPromocion, updatePromocion, deletePromocion } = require('../services/promocionService');

const validatePromocion = [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida'),
    body('precio_destacado').notEmpty().withMessage('El precio es requerido')
];

const getAll = async (req, res) => {
    try {
        const promociones = await getAllPromociones();
        res.json(Array.isArray(promociones) ? promociones : []);
    } catch (error) {
        console.error('Error al cargar promociones:', error);
        res.status(500).json({ success: false, message: 'Error al cargar promociones' });
    }
};

const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Datos inválidos', errors: errors.array() });
        }
        const { nombre, descripcion, precio_destacado, imagen_url } = req.body;
        await createPromocion(nombre, descripcion, precio_destacado, imagen_url);
        res.status(201).json({ success: true, message: 'Promoción creada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear promoción' });
    }
};

const updatePromocionById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio_destacado, imagen_url } = req.body;
        await updatePromocion(id, nombre, descripcion, precio_destacado, imagen_url);
        res.json({ success: true, message: 'Promoción actualizada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar promoción' });
    }
};

const deletePromocionById = async (req, res) => {
    try {
        const { id } = req.params;
        await deletePromocion(id);
        res.json({ success: true, message: 'Promoción eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar promoción' });
    }
};

module.exports = { getAll, create, updatePromocionById, deletePromocionById, validatePromocion };