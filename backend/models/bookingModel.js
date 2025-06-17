const { poolPromise } = require('../config/db');
const sql = require('mssql');

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

module.exports = { 
  createBooking, 
  getBookingHistoryByEmail
};
