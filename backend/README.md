# 🏨 Hotel Management System - Backend

*Project Group 10 - Software Engineering*

## Phần mềm được tổ chức theo kiến trúc Client - Server
Đây là phần mềm cho phía server chạy ở ```localhost:4000```

---
## 📁 Cấu trúc project

```
/backend
│
├── app.js                # Điểm khởi chạy server Express
├── config/
│   └── db.js             # Cấu hình kết nối SQL Server
├── routes/               # Định nghĩa các route (API endpoints)
├── controllers/          # Xử lý logic từ routes
├── models/               # Tương tác với database (SQL queries)
└── ...
```

---

## 🚀 Hướng dẫn cài đặt

### 1. Cài Node.js

Tải và cài đặt từ: https://nodejs.org/

---

### 2. Cài các thư viện cần thiết

Mở terminal:

```bash
cd /backend
npm install
```

Các thư viện đã dùng:

```bash
npm install express
npm install mssql
npm install express-validator
npm install node-cron
npm install cors
npm install express-session
```

---

## 🛠️ Cấu hình Database (SQL Server)

### Yêu cầu:

- SQL Server đã được cài đặt trên máy
- Đã tạo database có tên `hms`

### Tạo Database:

Mở **SQL Server Management Studio**, sau đó:

1. Chạy file: 
```
./backend/config/hms_nmcnpm.sql
```

---

### Cấu hình file `config/db.js`

```js
const config = {
  user: 'sa',                // Tên tài khoản SQL Server
  password: '123456',        // Mật khẩu SQL Server (chỉnh lại nếu khác)
  server: '127.0.0.1',       // Hoặc localhost
  port: 1433,                // Cổng mặc định SQL Server
  database: 'hms',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};
```

> ⚠️ **Lưu ý:**  
> - Đảm bảo SQL Server bật chế độ **SQL Server Authentication**  
> - Nếu dùng SQL Server Express, có thể cần khai báo `instanceName`

---

## ▶️ Chạy Server

```bash
cd /backend
node app.js
```

Sau khi chạy thành công, terminal sẽ hiện:

```
SQL Server connected
Server is running on port 3000
```

---

## 🌐 Kết nối từ Frontend

Frontend có thể gửi request đến API thông qua:  
`http://localhost:3000`

---

## 🧩 Ghi chú lỗi kết nối

- Kiểm tra lại `user/password`
- Đảm bảo SQL Server mở port 1433
- Mở `SQL Server Configuration Manager` để bật TCP/IP
- Cho phép tường lửa mở cổng 1433 nếu cần

---

## 👥 Nhóm thực hiện

- Thành viên: Nhóm 10  
- Môn học: Công nghệ Phần mềm

---