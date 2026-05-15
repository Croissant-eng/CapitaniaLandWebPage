const mysql = require('mysql2');

// Configuración de la conexión a MySQL
// IMPORTANTE: Cambiar estas credenciales por las de tu servidor real
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'capitania_db'
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// Secreto para firmar tokens JWT (Cambiar a una cadena segura y aleatoria en producción)
const JWT_SECRET = process.env.JWT_SECRET || 'capitania_super_secret_key_2026';

module.exports = {
    db: promisePool,
    JWT_SECRET
};
