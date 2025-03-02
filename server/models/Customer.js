const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    company: { type: String },
    email: { type: String },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewOrder' }],
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);