// app.js chính nên có đoạn mã:
const express = require('express');
const path = require("path");
const cors = require('cors');
const session = require('express-session');
const port = 4000;
const app = express();
const { poolPromise } = require('./config/db');
// Cấu hình session middleware
app.use(session({
  secret: 'royal-hotel', // Khóa bí mật để mã hóa session
  resave: false,             // Không lưu lại session nếu không có thay đổi
  saveUninitialized: true,   // Lưu session mới dù chưa có dữ liệu
  cookie: { 
    secure: false,           // Nếu dùng HTTPS thì đặt thành true
  }
}));

app.use(express.json()); // phải có dòng này
const loginRoutes = require('./routes/login-signup');
app.use('/', loginRoutes);


// Start server
async function startServer() {
  try {
    await poolPromise;
    app.listen(port, () => console.log(`Server running... http://localhost:${port}`));
  } catch (err) {
    console.error('❌ Failed to start server due to database connection error:', err);
    process.exit(1);
  }
}

startServer();