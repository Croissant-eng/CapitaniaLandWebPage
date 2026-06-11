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
    origin: (origin, callback) => {
        // Allow requests from localhost and devtunnel domains
        if (!origin ||
            origin.includes('localhost') ||
            origin.includes('.devtunnels.ms')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    // Add support for Access-Control-Allow-Private-Network header
    optionsSuccessStatus: 200
}));

// Middleware to handle Access-Control-Allow-Private-Network header
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Private-Network', 'true');
    next();
});

app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
    if (req.path === '/api/upload') return next();
    express.json()(req, res, next);
});

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

console.log(`Starting server on port: ${PORT}`);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de Capitania corriendo en http://localhost:${PORT}`);
});

module.exports = app;