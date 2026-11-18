import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, author, genre, isbn, quantity } = req.body;
    if (!title || !author || !genre || !isbn || quantity === undefined || Number(quantity) < 0)
      return res.status(400).json({ message: 'Complete all fields and enter a valid quantity.' });
    const [result] = await pool.query(
      'INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)',
      [title, author, genre, isbn, Number(quantity)]
    );
    res.status(201).json({ id: result.insertId, message: 'Book added successfully.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'That ISBN already exists.' });
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, author, genre, isbn, quantity } = req.body;
    if (!title || !author || !genre || !isbn || quantity === undefined || Number(quantity) < 0)
      return res.status(400).json({ message: 'Complete all fields and enter a valid quantity.' });
    const [result] = await pool.query(
      'UPDATE books SET title=?, author=?, genre=?, isbn=?, quantity=? WHERE id=?',
      [title, author, genre, isbn, Number(quantity), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Book not found.' });
    res.json({ message: 'Book updated successfully.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'That ISBN already exists.' });
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Book not found.' });
    res.json({ message: 'Book deleted successfully.' });
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2')
      return res.status(409).json({ message: 'This book has transaction history and cannot be deleted.' });
    next(e);
  }
});

export default router;
