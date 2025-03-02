const express = require("express");
const router = express.Router();

const  createNewOrder  = require("../controllers/newOrder");

router.post("/newOrder", createNewOrder);

module.exports = router;