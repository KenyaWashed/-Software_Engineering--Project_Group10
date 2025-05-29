const sql = require('mssql');

const config = {
  user: 'sa',
  password: '1234',
  server: 'localhost',
  database: 'hms',
  options: { encrypt: false },
  pool: {
    max: 100,
    min: 1,
    idleTimeoutMillis: 30000
  }
};

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
