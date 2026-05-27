# Cambios Proyecto Capitanía

> Aplica EXACTAMENTE los cambios indicados, sin modificar nada más.
> No toques: `server.js`, `authMiddleware.js`, `errorMiddleware.js`, `adminRoutes.js`, ni CSS/animaciones del HTML.

---

## ARCHIVO 1 — `routes/reservaRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAll, updateEstatus, deleteReservaById, create } = require('../controllers/reservaController');

router.post('/reservas', create);
router.get('/reservas', authMiddleware, getAll);
router.put('/reservas/:id/estatus', authMiddleware, updateEstatus);
router.delete('/reservas/:id', authMiddleware, deleteReservaById);

module.exports = router;
```

---

## ARCHIVO 2 — `controllers/reservaController.js`

```js
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
```

---

## ARCHIVO 3 — `services/reservaService.js`

```js
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
            'INSERT INTO reservas (nombre, telefono, fecha, hora, personas, sucursal, notas, estatus) VALUES (?, ?, ?, ?, ?, ?, ?, "Pendiente")',
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
```

---

## ARCHIVO 4 — `routes/eventoRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAll, create, updateEvento, deleteEventoById, validateEvento } = require('../controllers/eventoController');

router.get('/eventos_especiales', getAll);
router.get('/eventos', getAll);
router.post('/eventos', authMiddleware, validateEvento, create);
router.put('/eventos/:id', authMiddleware, updateEvento);
router.delete('/eventos/:id', authMiddleware, deleteEventoById);

module.exports = router;
```

---

## ARCHIVO 5 — `controllers/eventoController.js`

```js
const { body, validationResult } = require('express-validator');
const { getAllEventos, createEvento, updateEvento: updateEventoService, deleteEvento } = require('../services/eventoService');

const validateEvento = [
    body('titulo').notEmpty().withMessage('El título es requerido'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida'),
    body('fecha_evento').notEmpty().withMessage('La fecha del evento es requerida')
];

const getAll = async (req, res) => {
    try {
        const eventos = await getAllEventos();
        res.json(Array.isArray(eventos) ? eventos : []);
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        res.status(500).json({ success: false, message: 'Error al cargar eventos' });
    }
};

const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Datos inválidos', errors: errors.array() });
        }
        const { titulo, descripcion, fecha_evento, imagen_url } = req.body;
        await createEvento(titulo, descripcion, fecha_evento, imagen_url);
        res.status(201).json({ success: true, message: 'Evento creado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear evento' });
    }
};

const updateEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, fecha_evento, imagen_url } = req.body;
        await updateEventoService(id, titulo, descripcion, fecha_evento, imagen_url);
        res.json({ success: true, message: 'Evento actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar evento' });
    }
};

const deleteEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteEvento(id);
        res.json({ success: true, message: 'Evento eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar evento' });
    }
};

module.exports = { getAll, create, updateEvento, deleteEventoById, validateEvento };
```

---

## ARCHIVO 6 — `services/eventoService.js`

```js
const { db } = require('../config/database');

const getAllEventos = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM eventos_especiales WHERE estatus = "Activo" ORDER BY fecha_evento DESC');
        return rows;
    } catch (error) { throw error; }
};

const createEvento = async (titulo, descripcion, fecha_evento, imagen_url) => {
    try {
        await db.query(
            'INSERT INTO eventos_especiales (titulo, descripcion, fecha_evento, imagen_url, estatus) VALUES (?, ?, ?, ?, "Activo")',
            [titulo, descripcion, fecha_evento, imagen_url]
        );
        return { message: 'Evento creado' };
    } catch (error) { throw error; }
};

const updateEvento = async (id, titulo, descripcion, fecha_evento, imagen_url) => {
    try {
        await db.query(
            'UPDATE eventos_especiales SET titulo = ?, descripcion = ?, fecha_evento = ?, imagen_url = ? WHERE id = ?',
            [titulo, descripcion, fecha_evento, imagen_url || null, id]
        );
        return { message: 'Evento actualizado' };
    } catch (error) { throw error; }
};

const deleteEvento = async (id) => {
    try {
        await db.query('DELETE FROM eventos_especiales WHERE id = ?', [id]);
        return { message: 'Evento eliminado' };
    } catch (error) { throw error; }
};

module.exports = { getAllEventos, createEvento, updateEvento, deleteEvento };
```

---

## ARCHIVO 7 — `routes/promocionRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAll, create, updatePromocionById, deletePromocionById, validatePromocion } = require('../controllers/promocionController');

router.get('/promociones', getAll);
router.post('/promociones', authMiddleware, validatePromocion, create);
router.put('/promociones/:id', authMiddleware, updatePromocionById);
router.delete('/promociones/:id', authMiddleware, deletePromocionById);

module.exports = router;
```

---

## ARCHIVO 8 — `controllers/promocionController.js`

```js
const { body, validationResult } = require('express-validator');
const { getAllPromociones, createPromocion, updatePromocion, deletePromocion } = require('../services/promocionService');

const validatePromocion = [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida'),
    body('precio_destacado').notEmpty().withMessage('El precio es requerido')
];

const getAll = async (req, res) => {
    try {
        const promociones = await getAllPromociones();
        res.json(Array.isArray(promociones) ? promociones : []);
    } catch (error) {
        console.error('Error al cargar promociones:', error);
        res.status(500).json({ success: false, message: 'Error al cargar promociones' });
    }
};

const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Datos inválidos', errors: errors.array() });
        }
        const { nombre, descripcion, precio_destacado, imagen_url } = req.body;
        await createPromocion(nombre, descripcion, precio_destacado, imagen_url);
        res.status(201).json({ success: true, message: 'Promoción creada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear promoción' });
    }
};

const updatePromocionById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio_destacado, imagen_url } = req.body;
        await updatePromocion(id, nombre, descripcion, precio_destacado, imagen_url);
        res.json({ success: true, message: 'Promoción actualizada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar promoción' });
    }
};

const deletePromocionById = async (req, res) => {
    try {
        const { id } = req.params;
        await deletePromocion(id);
        res.json({ success: true, message: 'Promoción eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar promoción' });
    }
};

module.exports = { getAll, create, updatePromocionById, deletePromocionById, validatePromocion };
```

---

## ARCHIVO 9 — `services/promocionService.js`

```js
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
```

---

## ARCHIVO 10 — `src/index.js` (admin React)

```js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
```

---

## ARCHIVO 11 — `Landpage_Capitánia.html` (solo función `handleReserva`)

Busca el bloque que inicia con `const btn = e.target.querySelector` dentro de `handleReserva` y reemplázalo con:

```js
const btn = e.target.querySelector('.btn-reserva');
btn.innerHTML = '<span>Enviando…</span>';
btn.disabled = true;

fetch('http://localhost:3001/api/reservas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, telefono: tel, fecha, hora, personas, sucursal, notas })
})
.then(res => res.json())
.then(() => {
    document.getElementById('reservaFormWrap').style.display = 'none';
    const success = document.getElementById('reservaSuccess');
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const msg = encodeURIComponent(
        `¡Hola Capitanía! Quiero confirmar mi reserva:\n\n` +
        `👤 Nombre: ${nombre}\n📱 Tel: ${tel}\n👥 Personas: ${personas}\n` +
        `📅 Fecha: ${fechaStr}\n⏰ Hora: ${hora}\n` +
        (notas ? `📝 Notas: ${notas}` : '')
    );
})
.catch(() => {
    btn.innerHTML = '<span>Reservar</span>';
    btn.disabled = false;
    alert('Hubo un problema al enviar la reserva. Intenta de nuevo.');
});
```

> ⚠️ No toques ninguna otra parte del HTML. Solo ese bloque dentro de `handleReserva`.

---

## Al terminar

Reinicia el servidor:

```bash
node server.js
# o
nodemon server.js
```
