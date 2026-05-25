const { db } = require('../config/database');

// Obtener todos los eventos especiales
const getAllEventos = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM eventos_especiales WHERE estatus = "Activo" ORDER BY fecha_evento DESC');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Crear un nuevo evento especial
const createEvento = async (titulo, descripcion, fecha_evento, imagen_url) => {
    try {
        await db.query(
            'INSERT INTO eventos_especiales (titulo, descripcion, fecha_evento, imagen_url, estatus) VALUES (?, ?, ?, ?, "Activo")',
            [titulo, descripcion, fecha_evento, imagen_url]
        );
        return { message: 'Evento creado' };
    } catch (error) {
        throw error;
    }
};

// Eliminar un evento especial
const deleteEvento = async (id) => {
    try {
        await db.query('DELETE FROM eventos_especiales WHERE id = ?', [id]);
        return { message: 'Evento eliminado' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllEventos,
    createEvento,
    deleteEvento
};