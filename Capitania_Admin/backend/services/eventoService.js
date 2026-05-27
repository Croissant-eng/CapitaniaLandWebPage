const { db } = require('../config/database');

const getAllEventos = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM eventos_especiales WHERE estatus = "Activo" ORDER BY fecha_evento DESC');
        return rows;
    } catch (error) { throw error; }
};

const createEvento = async (titulo, descripcion, fecha_evento, imagen_url) => {
    try {
        await db.query(
            'INSERT INTO eventos_especiales (titulo, descripcion, fecha_evento, imagen_url, estatus) VALUES (?, ?, ?, ?, "Activo")',
            [titulo, descripcion, fecha_evento, imagen_url]
        );
        return { message: 'Evento creado' };
    } catch (error) { throw error; }
};

const updateEvento = async (id, titulo, descripcion, fecha_evento, imagen_url) => {
    try {
        await db.query(
            'UPDATE eventos_especiales SET titulo = ?, descripcion = ?, fecha_evento = ?, imagen_url = ? WHERE id = ?',
            [titulo, descripcion, fecha_evento, imagen_url || null, id]
        );
        return { message: 'Evento actualizado' };
    } catch (error) { throw error; }
};

const deleteEvento = async (id) => {
    try {
        await db.query('DELETE FROM eventos_especiales WHERE id = ?', [id]);
        return { message: 'Evento eliminado' };
    } catch (error) { throw error; }
};

module.exports = { getAllEventos, createEvento, updateEvento, deleteEvento };