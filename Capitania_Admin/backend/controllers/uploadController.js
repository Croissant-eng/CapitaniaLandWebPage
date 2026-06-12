const path = require('path');
const fs = require('fs');

const uploadImage = (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
};

const uploadImageBase64 = (req, res) => {
    try {
        const { imagen, filename } = req.body;
        if (!imagen) return res.status(400).json({ success: false, message: 'No se envió imagen' });

        const matches = imagen.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
        if (!matches) return res.status(400).json({ success: false, message: 'Formato base64 inválido' });

        const ext = matches[1].toLowerCase().replace('jpeg', 'jpg');
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');

        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const safeFilename = filename ? filename.replace(/[^a-zA-Z0-9.-]/g, '_') : `image.${ext}`;
        const uniqueName = Date.now() + '-' + safeFilename;
        const filePath = path.join(uploadDir, uniqueName);

        fs.writeFileSync(filePath, buffer);

        const imageUrl = `/uploads/${uniqueName}`;
        res.json({ success: true, imageUrl });
    } catch (err) {
        console.error('Error en uploadImageBase64:', err);
        res.status(500).json({ success: false, message: 'Error al procesar imagen' });
    }
};

module.exports = { uploadImage, uploadImageBase64 };