const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const session = require('express-session');
port = 4000;

// Cấu hình session middleware
app.use(session({
  secret: 'royal-hotel', // Khóa bí mật để mã hóa session
  resave: false,             // Không lưu lại session nếu không có thay đổi
  saveUninitialized: true,   // Lưu session mới dù chưa có dữ liệu
  cookie: { 
    secure: false,           // Nếu dùng HTTPS thì đặt thành true
  }
}));

// Đường dẫn đến thư mục ảnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Kết nối DB
//require('./config/db');

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes

// Đăng nhập, đăng ký, đăng xuất
// Kiểm tra session, lấy quyền chủ khách sạn, lễ tân
const loginRoutes = require("./routers/login");
app.use("/", loginRoutes);

// Lấy dữ liệu phòng để hiển thị, lấy danh sách phòng trống
const roomRoutes = require("./routers/room");
app.use("/room", roomRoutes);

// tính tiền
const calculationRoutes = require("./routers/calculation"); 
app.use("/calculation", calculationRoutes);

// Đặt phòng, hủy phòng, xem lịch sử đặt phòng
const bookingRoutes = require("./routers/booking");
app.use("/booking", bookingRoutes);

// Lấy chính sách phụ thu
const policyRoutes = require("./routers/policy");
app.use("/policy", policyRoutes);


app.listen(port, () => console.log("Server running... http://localhost:" + port));
