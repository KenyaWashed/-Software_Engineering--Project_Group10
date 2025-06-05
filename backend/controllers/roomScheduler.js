const cron = require('node-cron');
const { updateAllRoomStatus } = require('./common/updateRoomStatus');

cron.schedule('*/1 * * * *', () => {
  console.log("Đang chạy job cập nhật room_status...");
  updateAllRoomStatus();
});
