const { body, validationResult } = require('express-validator');
const { getAllEventos, createEvento, updateEvento: updateEventoService, deleteEvento } = require('../services/eventoService');

const validateEvento = [
    body('titulo').notEmpty().withMessage('El título es requerido'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida'),
    body('fecha_evento').notEmpty().withMessage('La fecha del evento es requerida')
];

const getAll = async (req, res) => {
    try {
        const eventos = await getAllEventos();
        res.json(Array.isArray(eventos) ? eventos : []);
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        res.status(500).json({ success: false, message: 'Error al cargar eventos' });
    }
};

const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Datos inválidos', errors: errors.array() });
        }
        const { titulo, descripcion, fecha_evento, imagen_url } = req.body;
        await createEvento(titulo, descripcion, fecha_evento, imagen_url);
        res.status(201).json({ success: true, message: 'Evento creado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear evento' });
    }
};

const updateEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, fecha_evento, imagen_url } = req.body;
        await updateEventoService(id, titulo, descripcion, fecha_evento, imagen_url);
        res.json({ success: true, message: 'Evento actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar evento' });
    }
};

const deleteEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteEvento(id);
        res.json({ success: true, message: 'Evento eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar evento' });
    }
};

module.exports = { getAll, create, updateEvento, deleteEventoById, validateEvento };