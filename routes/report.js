const express = require('express');
const router = express.Router();
const { revenueReport } = require('../controllers/report');

router.get('/', revenueReport);

module.exports = router;
