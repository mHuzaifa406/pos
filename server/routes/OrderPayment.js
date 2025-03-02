const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
} = require('../controllers/OrderPayment');

// Route to create a new payment
router.post('/create', createPayment);

// Route to get all payments
router.get('/', getPayments);

// Route to get a payment by ID
router.get('/find/:id', getPaymentById);

// Route to update a payment by ID
router.put('/update/:id', updatePayment);


module.exports = router;