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
    const availableRoom = await RoomModel.fetchAvailableRooms(checkin_date, checkout_date);
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

const getRoomDetail = async (req, res) => {
  const { room_id } = req.query;
  if (!room_id) {
    return res.status(400).json({ error: "Missing room ID" });
  }
  
  try {
    const roomDetail = await RoomModel.getRoomDetailByRoomId(room_id);
    if (roomDetail) {
      res.json({ roomDetail });
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.error('Error in getRoomDetail:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getListRoomByPackageId = async (req, res) => {
  const { room_package_id } = req.query;
  if (!room_package_id) {
    return res.status(400).json({ error: "Missing room package ID" });
  }
  
  try {
    const rooms = await RoomModel.getListRoomByPackageId(room_package_id);
    res.json({ rooms });
  } catch (error) {
    console.error('Error in getListRoomByPackageId:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { 
  getAllRooms,
  getAvailableRooms,
  addRoom,
  getRoomDetail,
  getListRoomByPackageId
};
