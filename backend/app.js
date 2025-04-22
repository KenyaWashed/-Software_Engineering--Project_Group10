const express = require("express");
const app = express();

// TODO: connect database


// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
const roomRoutes = require("./routers/room");
app.use("/room", roomRoutes);

const authRoutes = require("./routers/auth");
app.use("/auth", authRoutes);

app.listen(3000, () => console.log("Server running... http://localhost:3000"));
