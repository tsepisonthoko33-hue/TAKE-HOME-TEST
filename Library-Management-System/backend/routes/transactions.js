import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.type, t.quantity, t.note, t.created_at,
             b.title AS book_title, u.name AS user_name
      FROM transactions t
      JOIN books b ON b.id=t.book_id
      LEFT JOIN users u ON u.id=t.user_id
      ORDER BY t.created_at DESC
    `);
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { book_id, type, quantity, note, user_id } = req.body;
    const amount = Number(quantity);
    if (!book_id || !['STOCK_IN', 'BORROW'].includes(type) || !Number.isInteger(amount) || amount < 1) {
      connection.release();
      return res.status(400).json({ message: 'Choose a book, transaction type and quantity of at least 1.' });
    }

    await connection.beginTransaction();
    const [books] = await connection.query('SELECT quantity FROM books WHERE id=? FOR UPDATE', [book_id]);
    if (!books.length) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: 'Book not found.' });
    }
    const current = books[0].quantity;
    if (type === 'BORROW' && current < amount) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ message: 'Not enough copies are available.' });
    }

    const updated = type === 'STOCK_IN' ? current + amount : current - amount;
    await connection.query('UPDATE books SET quantity=? WHERE id=?', [updated, book_id]);
    await connection.query(
      'INSERT INTO transactions (book_id, user_id, type, quantity, note) VALUES (?, ?, ?, ?, ?)',
      [book_id, user_id || null, type, amount, note || null]
    );
    await connection.commit();
    res.status(201).json({ message: 'Transaction recorded and stock updated.' });
  } catch (e) {
    await connection.rollback();
    next(e);
  } finally { connection.release(); }
});

export default router;
