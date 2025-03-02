const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new mongoose.Schema({
id: { type: String, required: true },
category: { type: String, required: true }, 
barcode: { type: String, required: true, unique: true },
name: { type: String, required: true },
description: { type: String, required: true },
size: { type: String, required: true },
color: { type: String, required: true },
quantity: { type: Number, required: true },
full_capacity: { type: Number, required: true },
min_capacity: { type: Number, required: true },});
// Schema for an item in the POS

const checkoutSchema = new mongoose.Schema({
    payment: {
        method: { 
            type: String, 
            enum: ['CASH', 'CARD'], 
            required: true 
        },
        amount: { type: Number, required: true },
        transactionId: { type: String }
    },
    status: {
        type: String,
        enum: ['PAID', 'UNPAID'],
        required: true
    }
}, { timestamps: true });

const posSchema = new mongoose.Schema({
    inventorySchema: [inventorySchema],
    checkoutSchema: checkoutSchema,
    checkoutDate: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer',required: true },
}, { timestamps: true });

module.exports = mongoose.model('Pos', posSchema);