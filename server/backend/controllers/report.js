const { getRevenueReport, getFurnitureByRoomTypeId} = require('../models/reportModel');
const ReportModel = require("../models/reportModel");
const ExcelJS = require('exceljs');
const { getRevenueData } = require('../models/reportModel');

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

exports.getFurniture = async (req, res) => {
    const { room_type_id } = req.body;

    if (!room_type_id) {
        return res.status(400).json({ error: 'Thiếu room_type_id' });
    }

    try {
        const data = await getFurnitureByRoomTypeId(room_type_id);
        if (!data) {
            return res.status(404).json({ message: 'Không tìm thấy nội thất cho loại phòng này' });
    }
    return res.status(200).json({ furniture: data });
    } catch (error) {
        console.error('Lỗi lấy nội thất:', error);
        return res.status(500).json({ error: 'Lỗi server' });
    }
};

exports.getReservationRate = async (req, res) => {
  try {
    result = await ReportModel.getReservationRate();
    return res.status(200).json({
      success: true,
      data: result
    });
  }
  catch (err) {
    console.error('Lỗi logic:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getReservationRatebetweenTwoMonths = async (req, res) => {
  try {
    result = await ReportModel.getReservationRatebetweenTwoMonths();
    return res.status(200).json({
      success: true,
      data: result
    });
  }
  catch (err) {
    console.error('Lỗi logic:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};


exports.revenueReportExcel = async (req, res) => {
  try {
    const data = await getRevenueData();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo doanh thu');

    worksheet.columns = [
      { header: 'Mã đặt phòng', key: 'reservation_id', width: 15 },
      { header: 'Ngày nhận phòng', key: 'check_in_date', width: 20 },
      { header: 'Ngày trả phòng', key: 'check_out_date', width: 20 },
      { header: 'Trạng thái đặt', key: 'reservation_status', width: 20 },
      { header: 'Ngày thanh toán', key: 'payment_datetime', width: 20 },
      { header: 'Tổng tiền', key: 'total_amount', width: 15 },
      { header: 'Trạng thái hóa đơn', key: 'invoice_status', width: 20 }
    ];

    data.forEach(row => worksheet.addRow(row));

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=bao_cao_doanh_thu.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('❌ Lỗi xuất báo cáo doanh thu:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xuất báo cáo' });
  }
};