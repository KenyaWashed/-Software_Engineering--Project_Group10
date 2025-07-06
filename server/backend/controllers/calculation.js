const RoomModel = require('../models/calculationModel');

const calculateThePrice = async (req, res) => {
  const {
    room_type_id,
    room_package_id,
    n_domestic_guests,
    n_foreign_guests,
    total_days
  } = req.body;

  if (!room_type_id || !room_package_id || total_days == null || n_domestic_guests == null || n_foreign_guests == null) {
    return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
  }

  try {
    const total_amount = await RoomModel.calculatePrice(
      room_type_id,
      room_package_id,
      n_domestic_guests,
      n_foreign_guests,
      total_days
    );

    res.json({ total_amount });
  } catch (error) {
    console.error('Lỗi khi tính tiền phòng:', error);
    res.status(500).json({ error: "Lỗi khi tính tiền phòng!!" });
  }
};

module.exports = { calculateThePrice };
