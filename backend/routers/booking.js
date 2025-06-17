const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');

// Tạo booking mới
router.post('/', bookingController.createBooking);

router.post('/history', bookingController.getBookingHistory);

router.delete('/cancel', bookingController.cancelBooking);


module.exports = router;
