const BookingModel = require('../models/bookingModel');

// phương thức đặt phòng sẻ gửi kiểu POST với header là cookie // CHƯA CÓ
// và body là json chứa các trường: // room_id, total_guests, checki_in_date, check_out_date
const createBooking = async (req, res) => {
  try {
    const { room_id, total_guests, check_in_date, check_out_date } = req.body;
    const user_id = req.user?.id;
    
    // Kiểm tra đầu vào
    if (!user_id || !room_id || !total_guests || !check_in_date || !check_out_date) {
      return res.status(400).json({ error: "Thiếu dữ liệu" });
    }
    
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const total_days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (total_days <= 0) {
      return res.status(400).json({ error: "Ngày trả phòng phải sau ngày nhận phòng" });
    }

    const reservation_date = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const status = "Đã đặt";
    
    // Gọi models để lưu
    const result = await BookingModel.createBooking({
      user_id,
      room_id,
      total_guests,
      check_in_date,
      total_days,
      reservation_date,
      reservation_status: status,
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

module.exports = { createBooking };
