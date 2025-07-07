const express = require('express');
const router = express.Router();
const { 
    revenueReport,
    getFurniture,
    getReservationRate,
    getReservationRatebetweenTwoMonths
} = require('../controllers/report');

router.get('/get-revenue', revenueReport);
router.post('/get-furniture', getFurniture)
router.get('/get-reservation-rate',getReservationRate)
router.get('/get-reservation-rate-between-two-months', getReservationRatebetweenTwoMonths);

module.exports = router;