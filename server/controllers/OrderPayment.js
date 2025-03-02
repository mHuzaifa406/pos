const Payment = require('../models/OrderPayment');

// Create a new payment
async function createPayment(req, res) {
  try {
    const { method, amount, layaway, quote, order } = req.body;
    const payment = new Payment({ method, amount, layaway, quote, order });
    await payment.save();
    res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error });
  }
}

// Retrieve all payments
async function getPayments(req, res) {
  try {
    const payments = await Payment.find();
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving payments', error });
  }
}

// Retrieve a payment by ID
async function getPaymentById(req, res) {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving payment', error });
  }
}

// Update a payment by ID
async function updatePayment(req, res) {
  try {
    const { id } = req.params;
    const { method, amount, layaway, quote } = req.body;
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      { method, amount, layaway, quote },
      { new: true, runValidators: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error });
  }
}


module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,

};