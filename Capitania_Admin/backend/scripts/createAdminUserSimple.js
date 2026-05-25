// Script simple para crear usuario administrador
const bcrypt = require('bcrypt');
const { db } = require('../config/database');

// Contraseña en texto plano
const plainPassword = 'Admin2026!';
const username = 'admin_capitania';

// Hashear la contraseña
bcrypt.hash(plainPassword, 10)
    .then(async (hashedPassword) => {
        try {
            // Insertar el usuario en la base de datos con solo los campos necesarios
            const [result] = await db.query(
                'INSERT INTO administradores (username, password_hash) VALUES (?, ?)',
                [username, hashedPassword]
            );

            console.log('Usuario administrador creado exitosamente');
            console.log('Username:', username);
            console.log('ID del usuario:', result.insertId);
            console.log('Contraseña hasheada generada correctamente');

            // Cerrar conexión
            await db.end();
            console.log('Conexión cerrada');
        } catch (error) {
            console.error('Error al crear usuario:', error);
            console.error('Posiblemente la tabla no tenga la estructura esperada');
            console.log('Estructura de tabla esperada: username (VARCHAR), password_hash (VARCHAR)');
        }
    })
    .catch((error) => {
        console.error('Error al hashear contraseña:', error);
    });