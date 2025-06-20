const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');

// Tạo booking mới
router.post('/', bookingController.createBooking);

// xem lịch sử đặt phòng dựa vào email
router.post('/history', bookingController.getBookingHistory);

// hủy phòng
router.delete('/cancel', bookingController.cancelBooking);


module.exports = router;
