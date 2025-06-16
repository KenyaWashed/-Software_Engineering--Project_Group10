const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
port = 4000;

// Đường dẫn đến thư mục ảnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Kết nối DB
require('./config/db');

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
const roomRoutes = require("./routers/room");
app.use("/room", roomRoutes);


const calculationRoutes = require("./routers/calculation"); 
app.use("/calculation", calculationRoutes);

// const bookingRoutes = require("./routers/booking");
// app.use("/booking", bookingRoutes);


app.listen(port, () => console.log("Server running... http://localhost:" + port));
