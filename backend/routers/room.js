// routers/room.js
const express = require("express");
const router = express.Router();

// Import Controller
const { getAvailableRooms } = require("../controllers/room");

// Định tuyến cho GET /rooms
router.get("/", getAvailableRooms);

module.exports = router;
