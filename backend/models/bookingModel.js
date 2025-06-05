const { poolPromise } = require('../config/db');
const sql = require('mssql');

async function checkRoomAvailability(pool, room_id, total_guests) {
  // Tiến hành cập nhật các phòng đã sử dụng trước khi đăng ký tránh 
  //lỗi vừa có khách đặt nhưng hệ thống tự động chưa cập nhật trạng thái phòng
  const { updateAllRoomStatus } = require('../controllers/common/updateRoomStatus');
  updateAllRoomStatus();


  const result = await pool.request()
    .input('room_id', sql.Int, room_id)
    .query(`
      SELECT room_status, maximum_guests
      FROM Room
      WHERE room_id = @room_id
    `);

  if (result.recordset.length === 0) {
    throw new Error('Phòng không tồn tại');
  }

  const room = result.recordset[0];

  if (room.room_status !== 'Trống') {
    throw new Error('Phòng đang sử dụng');
  }

  if (total_guests > room.maximum_guests) {
    throw new Error('Vượt quá số lượng khách tối đa');
  }

  return true;
}

async function insertReservation(pool, {
  room_id,
  total_guests,
  check_in_date,
  total_days,
  reservation_status,
  reservation_date
}) {
  const result = await pool.request()
    .input('room_id', sql.Int, room_id)
    .input('total_guests', sql.Int, total_guests)
    .input('check_in_date', sql.DateTime, check_in_date)
    .input('total_days', sql.Int, total_days)
    .input('reservation_status', sql.NVarChar(20), reservation_status)
    .input('reservation_date', sql.DateTime, reservation_date)
    .query(`
      INSERT INTO Reservation (room_id, total_guests, check_in_date, total_days, reservation_status, reservation_date)
      OUTPUT INSERTED.reservation_id
      VALUES (@room_id, @total_guests, @check_in_date, @total_days, @reservation_status, @reservation_date)
    `);

  return result.recordset[0].reservation_id;
}



const createBooking = async ({
  room_id,
  total_guests,
  check_in_date,
  total_days,
  reservation_status,
  reservation_date,
  user_id
}) => {
  try {
    const pool = await poolPromise;
    
    // Bước 0: Check điều kiện phòng
    await checkRoomAvailability(pool, room_id, total_guests);

    // Bước 1: Insert vào bảng Reservation
    const reservation_id = await insertReservation(pool, {
      room_id,
      total_guests,
      check_in_date,
      total_days,
      reservation_status,
      reservation_date
    });

    console.log('Successful reservation, Reservation ID:', reservation_id);

    // Bước 2: Insert vào bảng Reservation_detail
    await pool.request()
      .input('reservation_id', sql.Int, reservation_id)
      .input('user_id', sql.Int, user_id)
      .query(`
        INSERT INTO Reservation_detail (reservation_id, user_id)
        VALUES (@reservation_id, @user_id)
      `);
      
    // Bước 3: Update trạng thái phòng = 'Đang sử dụng'
    await pool.request()
      .input('room_id', sql.Int, room_id)
      .query(`
        UPDATE Room
        SET room_status = N'Đang sử dụng'
        WHERE room_id = @room_id
      `);

    return { reservation_id };

  } catch (err) {
    console.error('Lỗi DB:', err);
    throw err;
  }
};

module.exports = { createBooking };