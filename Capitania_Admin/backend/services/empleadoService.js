const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { db } = require('../config/database');

// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'capitania_super_secret_key_2026';

// Función para obtener empleado por username
const getEmpleadoByUsername = async (username) => {
    try {
        const [rows] = await db.execute('SELECT * FROM empleados WHERE username = ?', [username]);
        return rows[0];
    } catch (error) {
        throw new Error('Error al buscar empleado');
    }
};

// Función para login de empleado
const loginEmpleado = async (username, password) => {
    try {
        // Buscar empleado por username
        const empleado = await getEmpleadoByUsername(username);

        if (!empleado) {
            throw new Error('Credenciales incorrectas');
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(password, empleado.password_hash);

        if (!isValid) {
            throw new Error('Credenciales incorrectas');
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: empleado.id,
                username: empleado.username,
                role: 'empleado'
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return {
            token,
            username: empleado.username,
            role: 'empleado'
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getEmpleadoByUsername,
    loginEmpleado
};