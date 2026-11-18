import { Router } from 'express';
import pool from '../db.js';

const router = Router();
router.get('/', async (_req, res, next) => {
  try {
    const [[bookStats]] = await pool.query(
      'SELECT COUNT(*) AS totalBooks, COALESCE(SUM(quantity),0) AS totalCopies, SUM(quantity < 2) AS lowStock FROM books'
    );
    const [[userStats]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [recent] = await pool.query(`
      SELECT t.id, t.type, t.quantity, t.created_at, b.title AS book_title
      FROM transactions t JOIN books b ON b.id=t.book_id
      ORDER BY t.created_at DESC LIMIT 5
    `);
    res.json({ ...bookStats, ...userStats, recent });
  } catch (e) { next(e); }
});
export default router;
