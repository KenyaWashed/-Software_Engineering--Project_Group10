const { poolPromise } = require('../config/db');
const sql = require('mssql');


async function getAvailableRooms(checkin_date, checkout_date) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input('check_in_date', sql.DateTime, checkin_date);
    request.input('check_out_date', sql.DateTime, checkout_date);
    
    const result = await request.query(`
      SELECT r.room_id, r.room_type_id
      FROM dbo.checkAvailableRoom(@check_in_date, @check_out_date) AS available
      JOIN Rooms r ON r.room_id = available.room_id
    `);

    return result.recordset;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}

async function getAvailableRoomTypes(checkin_date, checkout_date) {
  try {
    const availableRooms = await getAvailableRooms(checkin_date, checkout_date);

    if (!availableRooms || availableRooms.length === 0) return [];

    const roomTypeIds = [...new Set(availableRooms.map(room => room.room_type_id))];

    if (roomTypeIds.length === 0) return [];

    const pool = await poolPromise;
    const request = pool.request();

    // Đưa từng id vào query bằng @param để tránh lỗi SQL injection
    const conditions = roomTypeIds.map((id, index) => {
      const paramName = `id${index}`;
      request.input(paramName, sql.Int, id);
      return `@${paramName}`;
    });

    const query = `
      SELECT * FROM Room_types
      WHERE room_type_id IN (${conditions.join(',')})
    `;

    const result = await request.query(query);
    return result.recordset;

  } catch (error) {
    console.error('Lỗi lấy danh sách loại phòng:', error);
    throw error;
  }
}

async function getTypeAndPackageAvailable(checkin_date, checkout_date) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input('check_in_date', sql.DateTime, checkin_date);
    request.input('check_out_date', sql.DateTime, checkout_date);
    
    const result = await request.query(`
      SELECT DISTINCT r.room_type_id, r.room_package_id
      FROM dbo.checkAvailableRoom(@check_in_date, @check_out_date) AS available
      JOIN Rooms r ON r.room_id = available.room_id
    `);

    return result.recordset;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}

async function getPackage() {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    
    const result = await request.query(`SELECT * FROM Room_packages;`);

    return result.recordset;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}

async function getPackageOffers() {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    const result = await request.query(`SELECT * FROM room_package_offers;`);

    return result.recordset;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}


module.exports = {
  getAvailableRooms,
  getAvailableRoomTypes,
  getTypeAndPackageAvailable,
  getPackage,
  getPackageOffers
};
