const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const fileUpload = () => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const uniqueName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
            cb(null, uniqueName);
        },
    });

    const upload = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Unsupported file format. Only JPEG and PNG are allowed.'), false);
            }
        },
    }).array('images', 10);

    return upload;
};

module.exports = fileUpload;