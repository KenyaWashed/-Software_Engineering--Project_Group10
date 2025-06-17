// app.js chính nên có đoạn mã:
const express = require('express');
const session = require('express-session');

const app = express();

// Cấu hình session middleware
app.use(session({
  secret: 'royal-hotel', // Khóa bí mật để mã hóa session
  resave: false,             // Không lưu lại session nếu không có thay đổi
  saveUninitialized: true,   // Lưu session mới dù chưa có dữ liệu
  cookie: { 
    secure: false,           // Nếu dùng HTTPS thì đặt thành true
  }
}));