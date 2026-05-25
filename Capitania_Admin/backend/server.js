require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Importación de rutas (mismos nombres que tienes en tu archivo actual)
const adminRoutes = require('./routes/adminRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const promocionRoutes = require('./routes/promocionRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES ---

// 1. CORS: Permite que tu frontend acceda a tu API
app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// --- RUTAS API ---
// Estas rutas tienen el prefijo "/api"
app.use('/api', adminRoutes);
app.use('/api', reservaRoutes);
app.use('/api', eventoRoutes);
app.use('/api', promocionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Capitania Backend API is running');
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Manejo de errores centralizado
app.use(errorHandler);

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor de Capitania corriendo en http://localhost:${PORT}`);
});

module.exports = app;