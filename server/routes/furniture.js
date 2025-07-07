// furniture.js
// API routes for furniture (Nội thất)
import express from 'express';
import sql from 'mssql';
import dbConfig from '../config/db.js';

const router = express.Router();

// Get all furniture
router.get('/', async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query('SELECT * FROM Furniture');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new furniture
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .query('INSERT INTO Furniture (name, description) VALUES (@name, @description)');
    res.status(201).json({ message: 'Furniture added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
