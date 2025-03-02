const fs = require('fs').promises;

const checkImgMimeType = async (req, res, next) => {
    try {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (req.files && req.files.length) {
            for (const file of req.files) {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    await fs.unlink(file.path);
                    return res.status(400).json({ message: 'One or more images have an invalid format.' });
                }
            }
        }
        next();
    } catch (err) {
        try {
            if (req.files && req.files.length) {
                for (const file of req.files) {
                    await fs.unlink(file.path);
                }
            }
        } catch (unlinkErr) {
            console.error(unlinkErr);
        }
        next(err);
    }
};

module.exports = checkImgMimeType;