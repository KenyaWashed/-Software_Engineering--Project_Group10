const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');

// Tạo booking mới
router.post('/', bookingController.createBooking);

module.exports = router;
