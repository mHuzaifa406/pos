const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const printSchema = new mongoose.Schema({
    // Link to the related order
    order: { type: Schema.Types.ObjectId, ref: 'NewOrder' }
}, { timestamps: true });

module.exports = mongoose.model('Print', printSchema);