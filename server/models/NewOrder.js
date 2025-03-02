const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DueSchema = new mongoose.Schema(
    {dueDate: {
            type: Date,
            required: true
        }
    }
);

// Schema for a new order with automatic date/time and interlinking references
const newOrderSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    items:  [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    design: [{ type: Schema.Types.ObjectId, ref: 'Design' }],
    dueDate: { type: Date },
    // Reference to the payment(s) for this order
    payments: { type: Schema.Types.ObjectId, ref: 'Payment' },
    // Reference to the user who created the order
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // Reference to the customer placing the order
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' }
}, { timestamps: true });

module.exports = mongoose.model('NewOrder', newOrderSchema);