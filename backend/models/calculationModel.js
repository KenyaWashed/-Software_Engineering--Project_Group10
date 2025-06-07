const { poolPromise } = require('../config/db');
const sql = require('mssql');

async function calculatePrice(
  room_type_id,
  room_package_id,
  n_domestic_guests,
  n_foreign_guests,
  total_days
) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input('room_type_id', sql.Int, room_type_id);
    request.input('room_package_id', sql.Int, room_package_id);

    // Tính phụ phí
    let surcharge = 0;
    if (n_foreign_guests > 0) surcharge += 0.5;
    if (n_domestic_guests + n_foreign_guests > 2) surcharge += 0.25;

    const roomPriceResult = await request.query(`
      SELECT room_price FROM Room_types WHERE room_type_id = @room_type_id
    `);
    const packagePriceResult = await request.query(`
      SELECT sale_price FROM Room_packages WHERE room_package_id = @room_package_id
    `);

    if (
      roomPriceResult.recordset.length === 0 ||
      packagePriceResult.recordset.length === 0
    ) {
      throw new Error("Không tìm thấy thông tin giá phòng hoặc gói");
    }

    const room_price = roomPriceResult.recordset[0].room_price;
    const package_price = packagePriceResult.recordset[0].sale_price;

    const total = (room_price + package_price) * total_days * (1 + surcharge);
    return total;

  } catch (error) {
    console.error('Lỗi khi tính tiền phòng:', error);
    throw error;
  }
}

module.exports = {
  calculatePrice
};
