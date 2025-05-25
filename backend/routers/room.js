const express = require("express");
const router = express.Router();

const { getAllRooms } = require("../controllers/room");

// Đường dẫn nên là '/' để khi gọi '/room' sẽ chạy controller này
router.get('/', getAllRooms);

module.exports = router;
