const RoomModel = require('../models/roomModel');


const getAllRooms = async (req, res) => {
  const { checkin_date, checkout_date } = req.body;

  if (!checkin_date || !checkout_date) {
    return res.status(400).json({ error: "Missing check-in or check-out date" });
  }
  
  try {
    const availableRoomTypes = await RoomModel.getAvailableRoomTypes(checkin_date, checkout_date);
    const rooms = await RoomModel.getTypeAndPackageAvailable(checkin_date, checkout_date);
    const package = await RoomModel.getPackage();
    const packageOffers = await RoomModel.getPackageOffers();
    res.json({
      rooms,
      availableRoomTypes,
      package,
      packageOffers
    });
  } catch (error) {
    console.error('Error in getAllRooms:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllRooms };
