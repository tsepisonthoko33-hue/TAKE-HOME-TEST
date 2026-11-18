import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import booksRouter from './routes/books.js';
import usersRouter from './routes/users.js';
import transactionsRouter from './routes/transactions.js';
import dashboardRouter from './routes/dashboard.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ message: 'Library API is running' }));
app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/dashboard', dashboardRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error. Check backend terminal.' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Library API running on http://localhost:${port}`));
