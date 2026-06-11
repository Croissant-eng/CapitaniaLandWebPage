const path = require('path');

const uploadImage = (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });
    // Return relative URL so it's accessible from frontend
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
};

module.exports = { uploadImage };