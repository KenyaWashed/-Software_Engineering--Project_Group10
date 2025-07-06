const express = require("express");
const router = express.Router();

const { calculateThePrice } = require("../controllers/calculation");

router.post('/', calculateThePrice);

module.exports = router;
