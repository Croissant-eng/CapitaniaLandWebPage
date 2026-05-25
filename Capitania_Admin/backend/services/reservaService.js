const { db } = require('../config/database');

// Obtener todas las reservas
const getAllReservas = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM reservas ORDER BY fecha DESC, hora DESC');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Actualizar el estatus de una reserva
const updateReservaEstatus = async (id, estatus) => {
    try {
        await db.query('UPDATE reservas SET estatus = ? WHERE id = ?', [estatus, id]);
        return { message: 'Estatus actualizado' };
    } catch (error) {
        throw error;
    }
};

// Eliminar una reserva
const deleteReserva = async (id) => {
    try {
        await db.query('DELETE FROM reservas WHERE id = ?', [id]);
        return { message: 'Reserva eliminada' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllReservas,
    updateReservaEstatus,
    deleteReserva
};