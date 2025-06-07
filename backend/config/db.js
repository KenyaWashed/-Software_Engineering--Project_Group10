// config/db.js
const sql = require('mssql');

const config = {
  user: 'sa',
  password: '123456',
  server: '127.0.0.1',
  port: 1433,
database: 'hms',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Khởi tạo poolPromise để dùng chung toàn app
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('SQL Server connected');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    throw err;
  });

module.exports = {
  sql,            // export thư viện nếu cần dùng thêm sau này
  poolPromise     // dùng trong model như getAllRooms
};
