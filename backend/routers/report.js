const express = require('express');
const router = express.Router();
const { revenueReport , getFurniture} = require('../controllers/report');

router.get('/get-revenue', revenueReport);
router.get('/get-furniture', getFurniture)

module.exports = router;