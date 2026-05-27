const { db } = require('../config/database');

const getAllPromociones = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM promociones WHERE estatus = "Activo" ORDER BY id DESC');
        return rows;
    } catch (error) { throw error; }
};

const createPromocion = async (nombre, descripcion, precio_destacado, imagen_url) => {
    try {
        await db.query(
            'INSERT INTO promociones (nombre, descripcion, precio_destacado, imagen_url, estatus) VALUES (?, ?, ?, ?, "Activo")',
            [nombre, descripcion, precio_destacado, imagen_url]
        );
        return { message: 'Promoción creada' };
    } catch (error) { throw error; }
};

const updatePromocion = async (id, nombre, descripcion, precio_destacado, imagen_url) => {
    try {
        await db.query(
            'UPDATE promociones SET nombre = ?, descripcion = ?, precio_destacado = ?, imagen_url = ? WHERE id = ?',
            [nombre, descripcion, precio_destacado, imagen_url || null, id]
        );
        return { message: 'Promoción actualizada' };
    } catch (error) { throw error; }
};

const deletePromocion = async (id) => {
    try {
        await db.query('DELETE FROM promociones WHERE id = ?', [id]);
        return { message: 'Promoción eliminada' };
    } catch (error) { throw error; }
};

module.exports = { getAllPromociones, createPromocion, updatePromocion, deletePromocion };