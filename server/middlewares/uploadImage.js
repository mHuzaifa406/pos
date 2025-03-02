const Gallery = require('../models/Gallery');

const uploadImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Create an array to store each uploaded image's public URL
        const images = [];
        for (const file of req.files) {
            const newImage = new Gallery({ image: file.path });
            await newImage.save();
            images.push(req.domain + newImage.image);
        }

        return res.status(201).json({
            message: 'Images have been uploaded successfully',
            status: true,
            images,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = uploadImage;