const Customer = require('../models/Customer');

// Create a new customer
async function createCustomer(req, res) {
    try {
        const { name, number, company,email } = req.body;
        const newCustomer = new Customer({ name, number, company,email });
        await newCustomer.save();
        res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error });
    }
}

// Retrieve all customers
async function getCustomers(req, res) {
    try {
        const customers = await Customer.find();
        res.status(200).json({ customers });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers', error });
    }
}

// Retrieve a single customer by ID
// Retrieve a single customer by ID
async function getCustomerById(req, res) {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customer', error });
    }
}

// Retrieve a customer by name
async function getCustomerByName(req, res) {
    try {
        const { name } = req.params;
        const customer = await Customer.findOne({ name });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customer', error });
    }
}

// Update a customer by ID
async function updateCustomer(req, res) {
    try {
        const { id } = req.params;
        const { name, number, company } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { name, number, company },
            { new: true, runValidators: true }
        );
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error });
    }
}

// Delete a customer by ID
async function deleteCustomer(req, res) {
    try {
        const { id } = req.params;
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error });
    }
}

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getCustomerByName,
};