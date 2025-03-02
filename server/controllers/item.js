const Item = require('../models/Item');

// Create a new item
async function createItem(req, res) {
  try {
    const generateBarcode = () => {
      return 'BC' + Math.floor(Math.random() * 1000000000);
    };
    const { name, color, price, cost, quantity, picture } = req.body;
    const barcode = generateBarcode();
    const newItem = new Item({ name, color, price, cost, quantity, picture,barcode,});
    await newItem.save();
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error });
  }
}

// Get all items
async function getItems(req, res) {
  try {
    const items = await Item.find();
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
}

// Get an item by ID
async function getItemById(req, res) {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error });
  }
}

// Update an item by ID
async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { name, color, price, cost, quantity, picture } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, color, price, cost, quantity, picture },
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error });
  }
}

// Delete an item by ID
async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
}

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
};