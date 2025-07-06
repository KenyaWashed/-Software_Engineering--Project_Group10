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

const addRoom = async (req, res) => {
  const { room_package_id, room_notes, room_number} = req.body;
  if (!room_package_id) {
    return res.status(400).json({ error: "Missing room package ID" });
  }
  
  try {
    const result = await RoomModel.addRoom(room_package_id, room_notes, room_number);
    if (result) {
      res.status(201).json({ message: "Room added successfully" });
    } else {
      res.status(500).json({ error: "Failed to add room" });
    }
  } catch (error) {
    console.error('Error in addRoom:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { 
  getAllRooms,
  getAvailableRooms,
  addRoom
};
