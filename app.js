const express = require('express');
const app = express();
const path = require('path');
const reportRoutes = require('./routes/report');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/report', reportRoutes);

app.get('/', (req, res) => {
  res.send('🎉 Chào mừng đến hệ thống Báo Cáo Doanh Thu');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
