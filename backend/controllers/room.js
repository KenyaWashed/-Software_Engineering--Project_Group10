const RoomModel = require('../models/roomModel');


const getAllRooms = async (req, res) => {
  const { checkin_date, checkout_date } = req.body;

  if (!checkin_date || !checkout_date) {
    return res.status(400).json({ error: "Missing check-in or check-out date" });
  }
  
  try {
    const availableRoom = await RoomModel.getAvailableRooms(checkin_date, checkout_date);
    //const package = await RoomModel.getPackage();
    //const packageOffers = await RoomModel.getPackageOffers();
    const roomType = await RoomModel.getRoomType(checkin_date, checkout_date);
    res.json({
      availableRoom, 
      roomType
    });
  } catch (error) {
    console.error('Error in getAllRooms:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllRooms };
