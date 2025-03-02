const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderItemSchema = new mongoose.Schema({
    barcode: { type: String },
    name: { type: String, required: true },
    color: { type: String },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, required: true },
    picture: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('Item', orderItemSchema);
