const sql = require('mssql');

// Cấu hình kết nối
const config = {
  user: 'sa',
  password: '123456',
  server: 'localhost',
  database: 'hms',
  options: { encrypt: false },
  pool: {
    max: 100, // Số kết nối tối đa trong pool
    min: 1,  // Số kết nối tối thiểu luôn duy trì
    idleTimeoutMillis: 30000 // Thời gian tối đa (ms) một kết nối có thể ở trạng thái nhàn rỗi trước khi bị đóng
  }
};


// Tạo một connection pool dùng chung cho toàn bộ ứng dụng
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Kết nối SQL Server thành công');
    return pool;
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối SQL Server:', err);
    process.exit(1);
});

module.exports = {
  sql,
  poolPromise
};