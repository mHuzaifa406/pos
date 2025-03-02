const express = require("express");
const router = express.Router();

const {createDesign, addDesignElements } = require('../controllers/Design');

router.post('/create', createDesign);
router.put('/add-elements', addDesignElements);


module.exports = router;

// done