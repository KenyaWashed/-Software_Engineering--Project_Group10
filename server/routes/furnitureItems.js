// furnitureItems.js
// API for getting all furniture items and their total amount in all rooms
import express from 'express';
import sql from 'mssql';
import dbConfig from '../config/db.js';

const router = express.Router();

// Get all furniture items with total amount in all rooms
router.get('/totals', async (req, res) => {
  try {
    // This assumes you have a RoomFurniture table that links rooms and furniture with an amount
    const query = `
      SELECT f.id, f.name, f.description, SUM(rf.amount) as totalAmount
      FROM Furniture f
      LEFT JOIN RoomFurniture rf ON f.id = rf.furniture_id
      GROUP BY f.id, f.name, f.description
    `;
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
