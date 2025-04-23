const sql = require('mssql');

const config = {
  user: 'sa',
  password: '123456',
  server: '127.0.0.1',     // hoặc 'localhost'
  port: 1433,
  database: 'master',      // hoặc tên DB cụ thể nếu có
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function testConnection() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server successfully!');
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    sql.close();
  }
}

testConnection();
