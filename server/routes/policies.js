import express from 'express';
const router = express.Router();
import db from '../config/db.js';

// Lấy tất cả policies
router.get('/all', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Policies ORDER BY created_at DESC');
    res.json({ policies: result.recordset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm mới policy
router.post('/add', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Missing title or content' });
  }
  try {
    await db.query(
      'INSERT INTO Policies (title, content) VALUES (@title, @content)',
      [
        { name: 'title', type: db.NVarChar, value: title },
        { name: 'content', type: db.NVarChar, value: JSON.stringify(content) },
      ]
    );
    res.json({ message: 'Policy added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
