const { getAllReservas, updateReservaEstatus, deleteReserva } = require('../services/reservaService');

// Obtener todas las reservas
const getAll = async (req, res) => {
    try {
        const reservas = await getAllReservas();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar reservas' });
    }
};

// Actualizar el estatus de una reserva
const updateEstatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estatus } = req.body;

        if (!estatus) {
            return res.status(400).json({ error: 'Estatus es requerido' });
        }

        await updateReservaEstatus(id, estatus);
        res.json({ message: 'Estatus actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estatus' });
    }
};

// Eliminar una reserva
const deleteReservaById = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteReserva(id);
        res.json({ message: 'Reserva eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar reserva' });
    }
};

module.exports = {
    getAll,
    updateEstatus,
    deleteReservaById
};