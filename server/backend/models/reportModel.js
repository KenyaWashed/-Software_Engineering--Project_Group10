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


async function getFurnitureByPackageId(room_package_id) {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('room_package_id', sql.Int, room_package_id);

    const result = await request.query(`
      SELECT * FROM Furniture WHERE room_package_id = @room_package_id
    `);

    return result.recordset[0]; // chỉ lấy 1 dòng vì là PK
  } catch (err) {
    console.error('DB Error:', err);
    throw err;
  }
}

module.exports = {
  getRevenueReport,
  getFurnitureByPackageId
};