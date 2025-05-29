const { getRevenueReport } = require('../models/reportModel');

/**
 * Kiểm tra xem chuỗi viewDate có phải là 'YYYY-MM-DD' và là ngày hợp lệ không
 * @param {string} viewDate
 * @returns {boolean}
 */
function isValidDate(viewDate) {
  const parts = viewDate.split('-');
  if (parts.length !== 3) return false;
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return false;
  if (m < 1 || m > 12) return false;
  // Số ngày tối đa của tháng
  const maxDay = new Date(y, m, 0).getDate();
  if (d < 1 || d > maxDay) return false;
  return true;
}

/**
 * Controller xem báo cáo doanh thu theo ngày, tuần, tháng
 * @route GET /report?period=day|week|month&viewDate=YYYY-MM-DD
 */
exports.revenueReport = async (req, res) => {
  try {
    const { period = 'day', viewDate } = req.query;

    // Validate period
    if (!['day', 'week', 'month'].includes(period)) {
      return res.status(400).json({
        success: false,
        message: 'param period phải là một trong: day, week, month'
      });
    }

    // Validate viewDate
    if (!viewDate || !isValidDate(viewDate)) {
      return res.status(400).json({
        success: false,
        message: 'param viewDate bắt buộc và phải ở định dạng YYYY-MM-DD, là ngày hợp lệ.'
      });
    }

    let startDateStr;
    let endDateStr;
    let periodLabel;

    if (period === 'day') {
      // Ngày: chính là viewDate
      startDateStr = viewDate;
      endDateStr = viewDate;
      periodLabel = viewDate;
    } else if (period === 'week') {
      const d = new Date(viewDate);
      // ISO: Monday=1, Sunday=7, JS getDay: Sun=0, Mon=1...Sat=6
      const jsDay = d.getDay() === 0 ? 7 : d.getDay();
      const diffToMon = jsDay - 1;
      const start = new Date(d);
      start.setDate(d.getDate() - diffToMon);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      startDateStr = start.toISOString().slice(0, 10);
      endDateStr = end.toISOString().slice(0, 10);
      periodLabel = `${startDateStr} → ${endDateStr}`;
    } else {
      // Tháng: phân tích năm, tháng từ viewDate string để tránh timezone
      const [y, m] = viewDate.split('-').map(Number);
      const year = y;
      const month = m;
      // Bắt đầu tháng
      const mm = String(month).padStart(2, '0');
      startDateStr = `${year}-${mm}-01`;
      // Ngày cuối tháng
      const lastDay = new Date(year, month, 0).getDate();
      const dd = String(lastDay).padStart(2, '0');
      endDateStr = `${year}-${mm}-${dd}`;
      periodLabel = `${startDateStr} → ${endDateStr}`;
    }

    // Gọi model
    const [row] = await getRevenueReport(startDateStr, endDateStr, periodLabel);

    return res.json({
      success: true,
      period,
      viewDate,
      startDate: startDateStr,
      endDate: endDateStr,
      data: {
        period: row.period,
        revenue: parseFloat(row.revenue)
      }
    });
  } catch (err) {
    console.error('❌ Lỗi trong controller:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
