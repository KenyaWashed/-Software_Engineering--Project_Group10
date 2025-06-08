const express = require('express');
const router = express.Router();

const { createBooking } = require('../controllers/booking');

// Middleware giả lập user từ cookie
const FakeAuth = (req, res, next) => {
  req.user = { id: 1 }; // giả lập user_id = 1
  next();
};

router.post('/', createBooking);

module.exports = router;
