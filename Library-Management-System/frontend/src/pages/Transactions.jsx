import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Transactions({ user }) {
  const [books, setBooks] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ book_id: '', type: 'STOCK_IN', quantity: 1, note: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try { const [b, t] = await Promise.all([api('/books'), api('/transactions')]); setBooks(b); setRows(t); }
    catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault(); setMessage(''); setError('');
    try {
      await api('/transactions', { method: 'POST', body: JSON.stringify({ ...form, book_id: Number(form.book_id), quantity: Number(form.quantity), user_id: user.id }) });
      setMessage('Transaction saved. Book stock has been updated.'); setForm({ ...form, quantity: 1, note: '' }); load();
    } catch (e) { setError(e.message); }
  }

  return <><div className="page-heading"><div><p className="eyebrow">STOCK CONTROL</p><h1>Transactions</h1><p className="muted">Record incoming books and borrowed copies.</p></div></div>
    <section className="panel form-panel"><div className="panel-head"><div><h2>Record a transaction</h2><p className="muted">Stock-in increases stock; borrowing decreases stock.</p></div></div>
      <form className="form-grid transaction-form" onSubmit={submit}>
        <label>Book<select value={form.book_id} onChange={e => setForm({ ...form, book_id: e.target.value })} required><option value="">Select a book</option>{books.map(b => <option key={b.id} value={b.id}>{b.title} ({b.quantity} available)</option>)}</select></label>
        <label>Transaction type<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="STOCK_IN">Add stock</option><option value="BORROW">Borrow book</option></select></label>
        <label>Quantity<input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required /></label>
        <label>Note (optional)<input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="e.g. New delivery" /></label>
        <div className="form-actions"><button className="primary">Save transaction</button></div>
      </form>{message && <p className="success">{message}</p>}{error && <p className="error">{error}</p>}
    </section>
    <section className="panel"><div className="panel-head"><div><h2>Transaction history</h2><p className="muted">A record of stock movements.</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>BOOK</th><th>TYPE</th><th>QUANTITY</th><th>RECORDED BY</th><th>DATE</th></tr></thead><tbody>
        {rows.map(row => <tr key={row.id}><td><b>{row.book_title}</b></td><td><span className={row.type === 'BORROW' ? 'stock low' : 'stock'}>{row.type === 'BORROW' ? 'Borrowed' : 'Stock in'}</span></td><td>{row.quantity}</td><td>{row.user_name || '—'}</td><td>{new Date(row.created_at).toLocaleString()}</td></tr>)}
        {!rows.length && <tr><td colSpan="5" className="empty">No transactions yet.</td></tr>}
      </tbody></table></div>
    </section>
  </>;
}
