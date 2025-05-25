const RoomModel = require('../models/roomModel');

const getAllRooms = async (req, res) => {
  try {
    // Lấy các tham số lọc từ query
    const { status, priceMin, priceMax } = req.query;

    // Tạo object filter ban đầu
    let filter = {};

    if (status) filter.status = status;
    if (priceMin) filter.priceMin = priceMin;
    if (priceMax) filter.priceMax = priceMax;

    const rooms = await RoomModel.getAllRooms(filter);
    res.json(rooms);
  } catch (error) {
    console.error('Lỗi lấy phòng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

module.exports = { getAllRooms };
