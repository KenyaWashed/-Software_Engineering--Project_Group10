const BookingModel = require('../models/bookingModel');

const createBooking = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      arrival_time,
      special_requests,
      room_package_id,
      n_domestic_guests,
      n_foreign_guests,
      check_in_date,
      check_out_date
    } = req.body;

    // Kiểm tra thiếu dữ liệu
    if (
      !full_name || !email || !phone || !room_package_id ||
      n_domestic_guests == null || n_foreign_guests == null ||
      !check_in_date || !check_out_date
    ) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const result = await BookingModel.createBooking({
      full_name,
      email,
      phone,
      arrival_time,
      special_requests,
      room_package_id,
      n_domestic_guests,
      n_foreign_guests,
      check_in_date,
      check_out_date
    });

    res.status(201).json({
      message: "Đặt phòng thành công",
      data: result
    });

  } catch (error) {
    console.error("Lỗi đặt phòng:", error);
    res.status(500).json({ error: "Đặt phòng không thành công, " + error.message });
  }
};



const getBookingHistory = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Thiếu email" });
  }

  try {
    const data = await BookingModel.getBookingHistoryByEmail(email);
    res.status(200).json(data);
  } catch (err) {
    console.error('Lỗi truy vấn lịch sử đặt phòng:', err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};


const cancelBooking = async (req, res) => {
  //console.log('>>> req.body:', req.body);
  const { reservation_id } = req.body;

  if (!reservation_id) {
    return res.status(400).json({ error: 'Thiếu reservation_id' });
  }

  try {
    const result = await BookingModel.cancelBooking(reservation_id);

    if (result.success) {
      return res.status(200).json({ message: 'Huỷ đặt phòng thành công' });
    } else {
      return res.status(404).json({ error: 'Không tìm thấy reservation_id' });
    }
  } catch (error) {
    console.error('Lỗi huỷ phòng:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

module.exports = { 
  createBooking,
  getBookingHistory,
  cancelBooking
};
