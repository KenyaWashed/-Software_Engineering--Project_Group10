const { poolPromise } = require('../config/db');


async function getAllRooms(filters = {}) {
  try {
    const pool = await poolPromise;
    let query = "SELECT * FROM Room WHERE 1=1";
    const request = pool.request();

    // Nếu có status thì thêm điều kiện AND
    if (filters.status) {
      query += " AND room_status = @status";
      request.input('status', filters.status);
    }

    // Nếu có priceMin thì thêm điều kiện
    if (filters.priceMin) {
      query += " AND room_price >= @priceMin";
      request.input('priceMin', filters.priceMin);
    }

    // Nếu có priceMax thì thêm điều kiện
    if (filters.priceMax) {
      query += " AND room_price <= @priceMax";
      request.input('priceMax', filters.priceMax);
    }

    const result = await request.query(query);
    const rooms = result.recordset;

    const baseUrl = 'http://localhost:3000'; 
    const imageDir = '/uploads/rooms/';

    const updatedRooms = rooms.map(room => {
      return {
        ...room,
        room_photo: `${baseUrl}${imageDir}${room.room_photo}`
      };
    });

    return updatedRooms;

  } catch (error) {
    throw error;
  }
}

module.exports = { getAllRooms };
