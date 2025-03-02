const express = require("express");
const router = express.Router();

const  {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
  } = require("../controllers/item");

router.post("/new", createItem);

module.exports = router;