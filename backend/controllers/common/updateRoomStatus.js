const { poolPromise } = require('../../config/db');
const sql = require('mssql');

// Hàm này phục vụ cập nhật tự động cho roomScheduler
async function updateAllRoomStatus() {
  try {
    const pool = await poolPromise;

    // Cập nhật trạng thái phòng: nếu đang có khách ở thì 'Đang sử dụng', còn lại không làm gì
    await pool.request().query(`
      UPDATE Rooms
      SET room_status = N'Đã đặt'
      WHERE EXISTS (
        SELECT 1 FROM Reservation r
        WHERE r.room_id = Rooms.room_id
          AND r.check_in_date < GETDATE()
          AND DATEADD(day, r.total_days, r.check_in_date) > GETDATE()
      )
    `);


    console.log("Cập nhật room_status xong");
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái phòng:", err);
  }
}

module.exports = { updateAllRoomStatus };
