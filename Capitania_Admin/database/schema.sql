-- Creación de la Base de Datos
CREATE DATABASE IF NOT EXISTS capitania_db;
USE capitania_db;

-- 1. Tabla Administradores (Para el Login del Panel)
CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar administrador por defecto (password: admin123, hash generado con bcrypt)
-- En un entorno real se debe cambiar la contraseña
INSERT IGNORE INTO administradores (username, password_hash) 
VALUES ('admin', '$2a$10$8v5xI8iMvRkx7.Kj/Qk/hOV.dC7FqQ4i/B1l8KzS.wX/VqTxg6nRy'); 

-- 2. Tabla Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    sucursal ENUM('J. Vértiz Campero', 'Campestre') NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(20) NOT NULL,
    personas VARCHAR(50) NOT NULL,
    notas TEXT,
    estatus ENUM('Pendiente', 'Confirmada', 'Cancelada') DEFAULT 'Pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla Eventos Especiales
CREATE TABLE IF NOT EXISTS eventos_especiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_evento VARCHAR(50) NOT NULL,
    imagen_url VARCHAR(255) NOT NULL,
    estatus ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla Promociones
CREATE TABLE IF NOT EXISTS promociones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    precio_destacado VARCHAR(50),
    imagen_url VARCHAR(255) NOT NULL,
    estatus ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla Empleados
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar empleado de prueba (password: empleado123)
INSERT IGNORE INTO empleados (username, password_hash, nombre)
VALUES ('empleado_capitania', '$2a$10$8v5xI8iMvRkx7.Kj/Qk/hOV.dC7FqQ4i/B1l8KzS.wX/VqTxg6nRy', 'Empleado Capitania');
