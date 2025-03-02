const mongoose = require("mongoose");

const ColorChartSchema = new mongoose.Schema({
    item: { type: String, required: true },
    color: { type: String, required: true }
});

const PlacementSchema = new mongoose.Schema({
    position1: { type: String, enum: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"], required: true },
    position2: { type: String, enum: ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9"], required: true }
});

const PictureSchema = new mongoose.Schema({
    pictureFiles: [{ type: String, required: true }],
    colorChart: [ColorChartSchema],
    placement: [PlacementSchema],
    size: { type: String, required: true },
});

const TextSchema = new mongoose.Schema({
    font: { type: String, required: true },
    color: [ColorChartSchema],
    placement: [PlacementSchema],
    size: { type: String, required: true },
});

const DesignSchema = new mongoose.Schema({
    name: { type: String, required:true},
    pictures: [PictureSchema],
    text: [TextSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});



const Design = mongoose.model("Design", DesignSchema);

module.exports = Design;
