const express = require("express");
const app = express();
const path = require("path");


// Kết nối DB
require('./config/db');

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép Express phục vụ file tĩnh từ thư mục frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const roomRoutes = require("./routers/room");
app.use("/room", roomRoutes);



const authRoutes = require("./routers/auth");
app.use("/auth", authRoutes);

// homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "home.html"));
});

app.listen(3000, () => console.log("Server running... http://localhost:3000"));
