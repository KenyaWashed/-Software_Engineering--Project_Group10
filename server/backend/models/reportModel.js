const { poolPromise, sql } = require('../config/db');

/**
 * Lấy doanh thu tổng từ startDate đến endDate, luôn trả về 1 bản ghi
 * @param {string} startDate 'YYYY-MM-DD'
 * @param {string} endDate   'YYYY-MM-DD'
 * @param {string} periodLabel Nhãn chu kỳ (dùng trong SELECT)
 * @returns {Promise<Array<{period:string,revenue:number}>>}
 */
async function getRevenueReport(startDate, endDate, periodLabel) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('startDate',   sql.Date, startDate)
    .input('endDate',     sql.Date, endDate)
    .input('periodLabel', sql.NVarChar, periodLabel)
    .query(`
      SELECT 
        @periodLabel AS period,
        COALESCE(SUM(I.total_amount), 0) AS revenue
      FROM Payment_detail P
      JOIN Invoice I ON P.invoice_id = I.invoice_id
      WHERE 
        CONVERT(DATE, P.payment_datetime) BETWEEN @startDate AND @endDate
        AND I.invoice_status = N'Đã thanh toán';
    `);

  return result.recordset;
}


async function getFurnitureByRoomTypeId(room_type_id) {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('room_type_id', sql.Int, room_type_id);

    const result = await request.query(`
      SELECT * FROM Furniture WHERE room_type_id = @room_type_id
    `);

    return result.recordset[0]; // chỉ lấy 1 dòng vì là PK
  } catch (err) {
    console.error('DB Error:', err);
    throw err;
  }
}

// Đếm số lượng đặt phòng trong 1 tháng gần đây theo loại phòng
async function countReservationsByRoomTypeInLastMonth(roomTypeId) {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('roomTypeId', roomTypeId);

    const result = await request.query(`
      SELECT COUNT(*) AS total
      FROM Reservations Res
      JOIN Rooms R ON Res.room_id = R.room_id
      WHERE 
        R.room_type_id = @roomTypeId AND
        Res.reservation_date >= DATEADD(MONTH, -1, GETDATE())
    `);

    return result.recordset[0].total;
  } catch (err) {
    console.error(`Lỗi khi đếm reservation cho room_type_id = ${roomTypeId}:`, err);
    throw err;
  }
}

// Tính phần trăm đặt phòng theo từng loại
async function getReservationRate() {
  try {
    const [countType1, countType2, countType3] = await Promise.all([
      countReservationsByRoomTypeInLastMonth(1),
      countReservationsByRoomTypeInLastMonth(2),
      countReservationsByRoomTypeInLastMonth(3),
    ]);

    const total = countType1 + countType2 + countType3;

    const toPercent = (count) =>
      total > 0 ? Math.round((count / total) * 100) : 0;

    return {
      type1: toPercent(countType1),
      type2: toPercent(countType2),
      type3: toPercent(countType3),
    };
  } catch (err) {
    console.error('Lỗi khi tính tỷ lệ đặt phòng:', err);
    throw err;
  }
}

// Tính tỷ lệ đặt phòng giữa tháng này và tháng trước
async function getReservationRatebetweenTwoMonths() {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    const result = await request.query(`
      SELECT
        SUM(CASE 
          WHEN reservation_date >= DATEADD(DAY, -30, GETDATE()) AND reservation_date < GETDATE()
          THEN 1 ELSE 0 END) AS recent_30_days,

        SUM(CASE 
          WHEN reservation_date >= DATEADD(DAY, -60, GETDATE()) AND reservation_date < DATEADD(DAY, -30, GETDATE())
          THEN 1 ELSE 0 END) AS previous_30_days
      FROM Reservations;
    `);

    const { recent_30_days, previous_30_days } = result.recordset[0];

    let rate = 0;
    if (previous_30_days === 0) {
      rate = recent_30_days > 0 ? 100 : 0;
    } else {
      rate = ((recent_30_days - previous_30_days) / previous_30_days) * 100;
    }

    return Math.round(rate);
  } catch (err) {
    console.error('Lỗi khi tính tỷ lệ tăng trưởng đặt phòng:', err);
    throw err;
  }
}



module.exports = {
  getRevenueReport,
  getFurnitureByRoomTypeId,
  getReservationRate,
  getReservationRatebetweenTwoMonths
};