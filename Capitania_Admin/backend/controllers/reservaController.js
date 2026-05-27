const { getAllReservas, updateReservaEstatus, deleteReserva, createReserva } = require('../services/reservaService');

const create = async (req, res) => {
    try {
        const { nombre, telefono, fecha, hora, personas, sucursal, notas } = req.body;
        if (!nombre || !fecha || !hora || !personas) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        await createReserva({ nombre, telefono, fecha, hora, personas, sucursal, notas });
        res.status(201).json({ success: true, message: 'Reserva creada' });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error al crear reserva' });
    }
};

const getAll = async (req, res) => {
    try {
        const reservas = await getAllReservas();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar reservas' });
    }
};

const updateEstatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estatus } = req.body;
        if (!estatus) return res.status(400).json({ error: 'Estatus es requerido' });
        await updateReservaEstatus(id, estatus);
        res.json({ message: 'Estatus actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estatus' });
    }
};

const deleteReservaById = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteReserva(id);
        res.json({ message: 'Reserva eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar reserva' });
    }
};

module.exports = { getAll, updateEstatus, deleteReservaById, create };