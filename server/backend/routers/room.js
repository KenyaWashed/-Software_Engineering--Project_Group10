// routes/room.js
const express = require("express");
const router = express.Router();

const {
  getAllRooms,
  getAvailableRooms,
  addRoom,
  getRoomDetail,
  getListRoomByPackageId,
  updateMaxGuest
} = require("../controllers/room");

// GET /rooms/all
router.get('/all', getAllRooms);

// POST /rooms/available
router.post('/available', getAvailableRooms);

// POST /rooms/add
router.post('/add', addRoom);

router.get('/room-detail', getRoomDetail)
router.get('/list-room-by-package', getListRoomByPackageId);
router.post('/update-max-guest', updateMaxGuest);


module.exports = router;
