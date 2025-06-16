// routes/room.js
const express = require("express");
const router = express.Router();

const {
  getAllRooms,
  getAvailableRooms,
} = require("../controllers/room");

// GET /rooms/all
router.get('/all', getAllRooms);

// POST /rooms/available
router.post('/available', getAvailableRooms);

module.exports = router;
