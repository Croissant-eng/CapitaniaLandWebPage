const { db } = require('../config/database');

const getAllReservas = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM reservas ORDER BY fecha DESC, hora DESC');
        return rows;
    } catch (error) { throw error; }
};

const createReserva = async ({ nombre, telefono, fecha, hora, personas, sucursal, notas }) => {
    try {
        await db.query(
            'INSERT INTO reservas (nombre_completo, telefono, fecha, hora, personas, sucursal, notas, estatus) VALUES (?, ?, ?, ?, ?, ?, ?, "Pendiente")',
            [nombre, telefono || '', fecha, hora, personas, sucursal || '', notas || '']
        );
        return { message: 'Reserva creada' };
    } catch (error) { throw error; }
};

const updateReservaEstatus = async (id, estatus) => {
    try {
        await db.query('UPDATE reservas SET estatus = ? WHERE id = ?', [estatus, id]);
        return { message: 'Estatus actualizado' };
    } catch (error) { throw error; }
};

const deleteReserva = async (id) => {
    try {
        await db.query('DELETE FROM reservas WHERE id = ?', [id]);
        return { message: 'Reserva eliminada' };
    } catch (error) { throw error; }
};

module.exports = { getAllReservas, createReserva, updateReservaEstatus, deleteReserva };