// api to get total furniture by room type
import express from 'express';
import sql from 'mssql';
import dbConfig from '../config/db.js';

const router = express.Router();

// GET /api/furniture-items/room-type?type=Phòng loại 1
router.get('/room-type', async (req, res) => {
  const { type } = req.query;
  try {
    // Giả sử có bảng Room, RoomType, RoomFurniture
    // Lấy tổng số lượng từng nội thất cho loại phòng này
    const query = `
      SELECT f.id, f.name, SUM(rf.amount) as totalAmount
      FROM Furniture f
      LEFT JOIN RoomFurniture rf ON f.id = rf.furniture_id
      LEFT JOIN Room r ON rf.room_id = r.id
      LEFT JOIN RoomType rt ON r.type_id = rt.id
      WHERE rt.name = @type
      GROUP BY f.id, f.name
    `;
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().input('type', sql.NVarChar, type).query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
