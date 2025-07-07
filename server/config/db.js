// db.js
// SQL Server connection config for Node.js backend

const config = {
  user: 'sa', // SQL Server username
  password: '123456', // SQL Server password
  server: '127.0.0.1', // or 'localhost'
  port: 1433, // default SQL Server port
  database: 'hms',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export default config;
