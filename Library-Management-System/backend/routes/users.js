import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { membership_id, password } = req.body;
    const [rows] = await pool.query(
      'SELECT id, name, membership_id, role FROM users WHERE membership_id=? AND password=?',
      [membership_id, password]
    );
    if (!rows.length) return res.status(401).json({ message: 'Incorrect membership ID or password.' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, membership_id, role, created_at FROM users ORDER BY name'
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, membership_id, password, role } = req.body;
    if (!name || !membership_id || !password || !role)
      return res.status(400).json({ message: 'Complete all user fields.' });
    const [result] = await pool.query(
      'INSERT INTO users (name, membership_id, password, role) VALUES (?, ?, ?, ?)',
      [name, membership_id, password, role]
    );
    res.status(201).json({ id: result.insertId, message: 'User added successfully.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Membership ID already exists.' });
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, membership_id, role, password } = req.body;
    if (!name || !membership_id || !role)
      return res.status(400).json({ message: 'Name, membership ID and role are required.' });
    const [result] = await pool.query(
      password
        ? 'UPDATE users SET name=?, membership_id=?, role=?, password=? WHERE id=?'
        : 'UPDATE users SET name=?, membership_id=?, role=? WHERE id=?',
      password
        ? [name, membership_id, role, password, req.params.id]
        : [name, membership_id, role, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User updated successfully.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Membership ID already exists.' });
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (e) { next(e); }
});

export default router;
