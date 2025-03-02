const Design = require('../models/Design');

// Function to create a new design
async function createDesign(req, res) {
    try {
        const { name, pictures, text } = req.body;

        // Create a new design instance. If pictures/text are not provided, initialize with an empty array.
        const newDesign = new Design({
            name,
            pictures: pictures || [],
            text: text || []
        });

        // Save the design to the database
        await newDesign.save();

        res.status(201).json({ message: "Design created successfully", design: newDesign });
    } catch (error) {
        res.status(500).json({ message: "Error creating design", error });
    }
}

// Function to append new picture/text elements to an existing design
async function addDesignElements(req, res) {
    try {
        const { designId, newPictures, newText } = req.body;

        // Find the design by ID
        const design = await Design.findById(designId);
        if (!design) {
            return res.status(404).json({ message: "Design not found" });
        }

        // Append new picture elements if provided
        if (newPictures && Array.isArray(newPictures) && newPictures.length > 0) {
            design.pictures.push(...newPictures);
        }

        // Append new text elements if provided
        if (newText && Array.isArray(newText) && newText.length > 0) {
            design.text.push(...newText);
        }

        // Update the updatedAt timestamp
        design.updatedAt = Date.now();

        await design.save();

        res.status(200).json({ message: "Design updated successfully", design });
    } catch (error) {
        res.status(500).json({ message: "Error updating design", error });
    }
}

module.exports = { createDesign, addDesignElements };