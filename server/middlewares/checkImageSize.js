const fs = require('fs').promises;

const checkImageSize = async (req, res, next) => {
    try {
        if (req.files && req.files.length) {
            for (const file of req.files) {
                if (file.size > 10 * 1024 * 1024) { // 10MB size limit per file
                    await fs.unlink(file.path);
                    return res.status(400).json({ message: 'One or more images exceed the 10MB size limit.' });
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

module.exports = checkImageSize;