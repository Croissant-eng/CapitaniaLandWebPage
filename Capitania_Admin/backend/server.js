const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permitir peticiones desde el frontend (Landpage o Dashboard)
app.use(express.json()); // Parsear body a JSON

// Rutas API
app.use('/api', apiRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Capitanía Backend API is running');
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor de Capitanía corriendo en http://localhost:${PORT}`);
});
