
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'capitania_super_secret_key_2026';

// Login de administrador
const loginAdmin = async (username, password) => {
    try {
        console.log('LOGIN INTENTO:', username, password);
        const [rows] = await db.query('SELECT * FROM administradores WHERE username = ?', [username]);
        console.log('FILAS ENCONTRADAS:', rows.length);

        if (rows.length === 0) {
            throw new Error('Credenciales incorrectas');
        }

        const admin = rows[0];
        console.log('HASH EN DB:', admin.password_hash);

        let isMatch = false;

        // Intentar bcrypt primero
        try {
            isMatch = await bcrypt.compare(password, admin.password_hash);
        } catch (e) {
            isMatch = false;
        }

        // Si no hay hash guardado, comparar texto plano
        if (!isMatch && admin.password_hash === password) {
            isMatch = true;
        }

        console.log('COINCIDE:', isMatch);

        if (!isMatch) {
            throw new Error('Credenciales incorrectas');
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return { token, username: admin.username };
    } catch (error) {
        throw error;
    }
};

// Obtener información del administrador
const getAdminInfo = async (adminId) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, created_at FROM administradores WHERE id = ?', [adminId]);

        if (rows.length === 0) {
            throw new Error('Administrador no encontrado');
        }

        return rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    loginAdmin,
    getAdminInfo
};