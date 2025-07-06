// config/db.js
const sql = require('mssql');

const config = {
  user: 'sa',
  password: '123456', // sửa code cứng chỗ này nếu cần tùy máy
  server: '127.0.0.1',
  port: 1433,
  //instanceName: 'MSSQLSERVER03', // Nếu dùng SQL Server Express
  database: 'hms',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    //trustedConnection: true
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