const express = require('express');
const router = express.Router();
const { 
    //revenueReport,
    getFurniture,
    getReservationRate,
    getReservationRatebetweenTwoMonths,
    revenueReportExcel
} = require('../controllers/report');

//router.get('/get-revenue', revenueReport);
router.post('/get-furniture', getFurniture)
router.get('/get-reservation-rate',getReservationRate)
router.get('/get-reservation-rate-between-two-months', getReservationRatebetweenTwoMonths);
router.get('/get-export-revenue-excel', revenueReportExcel);

module.exports = router;