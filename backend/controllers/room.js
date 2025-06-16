const RoomModel = require('../models/roomModel');


const getAllRooms = async (req, res) => {
  try {
    const roomType = await RoomModel.getRoomType();
    res.json({
      roomType
    });
  } catch (error) {
    console.error('Error in getAllRooms:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAvailableRooms = async (req, res) => {
  const { checkin_date, checkout_date } = req.body;

  if (!checkin_date || !checkout_date) {
    return res.status(400).json({ error: "Missing check-in or check-out date" });
  }
  
  try {
    const availableRoom = await RoomModel.getAvailableRooms(checkin_date, checkout_date);
    res.json({
      availableRoom
    });
  } catch (error) {
    console.error('Error in getAllRooms:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { 
  getAllRooms,
  getAvailableRooms
};
