const { poolPromise } = require('../config/db');
const sql = require('mssql');


async function createInvoiceSimplified({
  reservation_id,
  room_id,
  total_local_guests,
  total_foreign_guests,
  check_in_date,
  check_out_date
}) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // 1. Lấy sale_price từ room_package theo room_id
    const roomInfo = await request
      .input('room_id', room_id)
      .query(`
        SELECT P.sale_price
        FROM Rooms R
        JOIN room_packages P ON R.room_package_id = P.room_package_id
        WHERE R.room_id = @room_id
      `);

    if (roomInfo.recordset.length === 0) {
      throw new Error('Không tìm thấy gói phòng cho room_id đã cho');
    }

    const sale_price = roomInfo.recordset[0].sale_price;

    // 2. Lấy chính sách phụ thu
    const policyResult = await pool.request().query(`
      SELECT policy_short_name, policy_value
      FROM Policy
      WHERE policy_short_name IN ('KH3', 'KNN')
    `);

    const policies = {};
    policyResult.recordset.forEach(row => {
      policies[row.policy_short_name] = parseFloat(row.policy_value);
    });

    const kh3Rate = policies['KH3'] || 0;
    const knnRate = policies['KNN'] || 0;

    // 3. Tính số ngày
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const totalDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const base_fee = sale_price * totalDays;

    const total_guests = total_local_guests + total_foreign_guests;
    const extra_guest_count = Math.max(0, total_guests - 2);

    const extra_fee = base_fee * (
      extra_guest_count * kh3Rate + total_foreign_guests * knnRate
    );

    const total_amount = base_fee + extra_fee;

    // 4. Thêm hóa đơn
    await pool.request()
      .input('base_fee', base_fee)
      .input('service_fee', 0)
      .input('extra_fee', extra_fee)
      .input('total_amount', total_amount)
      .input('invoice_status', 'Chờ thanh toán')
      .input('reservation_id', reservation_id)
      .query(`
        INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
        VALUES (@base_fee, @service_fee, @extra_fee, @total_amount, @invoice_status, @reservation_id)
      `);

    return { success: true, message: 'Tạo hóa đơn thành công' };

  } catch (error) {
    console.error('Lỗi tạo hóa đơn:', error);
    return { success: false, error: error.message };
  }
}


const createBooking = async (bookingData) => {
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
  } = bookingData;

  try {
    const pool = await poolPromise;
    
    // Kiểm tra phòng có sẵn hay không
    const checkRoom = await pool.request()
      .input('check_in_date', sql.DateTime, check_in_date)
      .input('check_out_date', sql.DateTime, check_out_date)
      .input('room_package_id', sql.Int, room_package_id)
      .query(`
        SELECT * FROM dbo.checkAvailableRoom(@check_in_date, @check_out_date)
        WHERE room_package_id = @room_package_id
      `);
    
    if (checkRoom.recordset.length === 0) {
      throw new Error('Phòng đã được đặt trong khoảng thời gian này');
    }
      
    room_number = checkRoom.recordset[0].room_number;
    
    const getRoomIdResult = await pool.request()
      .input('room_number', sql.Char(3), room_number)
      .query(`SELECT room_id FROM Rooms WHERE room_number = @room_number`);
    room_id = getRoomIdResult.recordset[0].room_id;


    // Insert vào Reservations
    const insertReservation = await pool.request()
      .input('total_local_guests', sql.Int, n_domestic_guests)
      .input('total_foreign_guests', sql.Int, n_foreign_guests)
      .input('reservation_date', sql.DateTime, new Date())
      .input('check_in_date', sql.DateTime, check_in_date)
      .input('check_out_date', sql.DateTime, check_out_date)
      .input('reservation_status', sql.NVarChar, 'Đã đặt')
      .input('room_id', sql.Int, room_id)
      .input('arrival_time', sql.NVarChar, arrival_time)
      .input('special_requests', sql.NVarChar, special_requests)
      .query(`
        INSERT INTO Reservations (
          total_local_guests, total_foreign_guests, reservation_date,
          check_in_date, check_out_date, reservation_status,
          room_id
        )
        OUTPUT INSERTED.reservation_id
        VALUES (
          @total_local_guests, @total_foreign_guests, @reservation_date,
          @check_in_date, @check_out_date, @reservation_status,
          @room_id
        )
      `);

    const reservation_id = insertReservation.recordset[0].reservation_id;

    // Insert vào Reservation_detail
    await pool.request()
      .input('reservation_id', sql.Int, reservation_id)
      .input('guest_full_name', sql.NVarChar, full_name)
      .input('guest_email', sql.VarChar, email)
      .input('guest_phone_number', sql.Char, phone)
      .query(`
        INSERT INTO Reservation_detail (
          reservation_id, guest_full_name, guest_email, guest_phone_number
        ) VALUES (
          @reservation_id, @guest_full_name, @guest_email, @guest_phone_number
        )
      `);
      
    // Tạo hóa đơn
    await createInvoiceSimplified({
      reservation_id,
      room_id,
      total_local_guests: n_domestic_guests,
      total_foreign_guests: n_foreign_guests,
      check_in_date,
      check_out_date
    });

    return { reservation_id, room_number };

  } catch (err) {
    console.error("Lỗi khi thêm vào DB:", err);
    throw err;
  }
};



async function getBookingHistoryByEmail(email) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar(100), email)
      .query(`
        SELECT 
          r.reservation_id AS reservationId,
          rm.room_number AS roomRumber,
          rd.guest_email AS userEmail,
          rm.room_type_id AS roomTypeId,
          rm.room_package_id AS packageId,
          r.check_in_date AS checkIn,
          r.check_out_date AS checkOut,
          r.total_local_guests AS totalLocalGuests,
          r.total_foreign_guests AS totalForeignGuests,
          DATEDIFF(DAY, r.check_in_date, r.check_out_date) AS nights
        FROM Reservations r
        JOIN Rooms rm ON r.room_id = rm.room_id
        JOIN Reservation_detail rd ON r.reservation_id = rd.reservation_id
        WHERE rd.guest_email = @email
        ORDER BY r.check_in_date DESC
      `);

    return result.recordset;
  } catch (error) {
    throw error;
  }
}



async function cancelBooking(reservation_id) {
  try {
    const pool = await poolPromise;

    // Kiểm tra reservation_id có tồn tại không
    const check = await pool.request()
      .input('reservation_id', sql.Int, reservation_id)
      .query(`SELECT 1 FROM Reservations WHERE reservation_id = @reservation_id`);

    if (check.recordset.length === 0) {
      return { success: false };
    }

    // Xóa ở bảng con trước
    await pool.request()
      .input('reservation_id', sql.Int, reservation_id)
      .query(`DELETE FROM Reservation_detail WHERE reservation_id = @reservation_id`);

    // Xoá bảng chính
    await pool.request()
      .input('reservation_id', sql.Int, reservation_id)
      .query(`DELETE FROM Reservations WHERE reservation_id = @reservation_id`);

    return { success: true };
  } catch (err) {
    throw err;
  }
}

module.exports = { 
  createBooking, 
  getBookingHistoryByEmail,
  cancelBooking,
  createInvoiceSimplified
};
