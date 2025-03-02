const express = require('express');
const router = express.Router();
const {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getCustomerByName,
} = require('../controllers/customer');

// Route to create a new customer
router.post('/create', createCustomer);

// Route to get all customers
router.get('/infoCustomer', getCustomers);

// Route to get a customer by ID
router.get('/find/:id', getCustomerById);

// Route to update a customer by ID
router.put('/update/:id', updateCustomer);

// Route to delete a customer by ID
router.delete('/delete/:id', deleteCustomer);
router.get('/find/:name', getCustomerByName);

module.exports = router;