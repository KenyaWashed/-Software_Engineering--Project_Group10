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

module.exports = {
  getRevenueReport
};
