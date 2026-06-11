require('dotenv').config();
const express = require('express');
const app = express();

// Simple test endpoint
app.get('/', (req, res) => {
    res.send('Test server running on port: ' + (process.env.PORT || 3001));
});

const PORT = process.env.PORT || 3001;
console.log(`Starting test server on port: ${PORT}`);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running on http://localhost:${PORT}`);
});