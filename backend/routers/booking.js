const { poolPromise } = require('../config/db');
const sql = require('mssql');

const createBooking = async ({
  fullName,
  email,
  phone,
  arrivalTime,
  specialRequests,
  room_type_id,
  room_package_id,
  n_domestic_guests,
  n_foreign_guests,
  check_in_date,
  check_out_date
}) => {
  const pool = await poolPromise;
  const request = pool.request();

  request.input("first_name", sql.NVarChar, firstName);
  request.input("last_name", sql.NVarChar, lastName);
  request.input("email", sql.NVarChar, email);
  request.input("phone", sql.NVarChar, phone);
  request.input("arrival_time", sql.NVarChar, arrivalTime);
  request.input("special_requests", sql.NVarChar, specialRequests);
  request.input("room_type_id", sql.Int, room_type_id);
  request.input("room_package_id", sql.Int, room_package_id);
  request.input("n_domestic_guests", sql.Int, n_domestic_guests);
  request.input("n_foreign_guests", sql.Int, n_foreign_guests);
  request.input("check_in_date", sql.DateTime, check_in_date);
  request.input("check_out_date", sql.DateTime, check_out_date);

  const result = await request.query(`
    INSERT INTO Bookings (
      first_name, last_name, email, phone, arrival_time, special_requests,
      room_type_id, room_package_id, n_domestic_guests, n_foreign_guests,
      check_in_date, check_out_date
    )
    OUTPUT INSERTED.*
    VALUES (
      @first_name, @last_name, @email, @phone, @arrival_time, @special_requests,
      @room_type_id, @room_package_id, @n_domestic_guests, @n_foreign_guests,
      @check_in_date, @check_out_date
    )
  `);

  return result.recordset[0]; // Trả lại thông tin booking vừa tạo
};

module.exports = { createBooking };
