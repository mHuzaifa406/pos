const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ['CASH', 'CARD', 'CHECK'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    // Indicates if this payment is a layaway (typically 50% upfront)
    layaway: {
      type: Boolean,
      default: false
    },
    // Indicates if this payment is a quote
    quote: {
      type: Boolean,
      default: false
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);