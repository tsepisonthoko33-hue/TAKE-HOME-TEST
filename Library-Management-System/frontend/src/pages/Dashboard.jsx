import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try { const [summary, bookRows] = await Promise.all([api('/dashboard'), api('/books')]); setData(summary); setBooks(bookRows); }
    catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); }, []);

  return <><div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p className="muted">Here is what is happening in your library today.</p></div><Link className="primary" to="/books">＋ Add a book</Link></div>
    {error && <p className="error">{error}</p>}
    <div className="stats-grid">
      <Stat label="Book titles" value={data?.totalBooks ?? '—'} icon="▤" />
      <Stat label="Available copies" value={data?.totalCopies ?? '—'} icon="▣" />
      <Stat label="Low stock titles" value={data?.lowStock ?? '—'} icon="⚑" />
      <Stat label="Registered users" value={data?.totalUsers ?? '—'} icon="♙" />
    </div>
    <div className="content-grid">
      <section className="panel"><div className="panel-head"><div><h2>Book availability</h2><p className="muted">Current stock levels</p></div><Link to="/books">View all →</Link></div>
        <div className="table-wrap"><table><thead><tr><th>BOOK TITLE</th><th>AUTHOR</th><th>GENRE</th><th>AVAILABLE</th></tr></thead><tbody>
          {books.slice(0, 6).map(book => <tr key={book.id}><td><b>{book.title}</b><small className="subline">{book.isbn}</small></td><td>{book.author}</td><td>{book.genre}</td><td><span className={book.quantity < 2 ? 'stock low' : 'stock'}>{book.quantity} copies</span></td></tr>)}
          {!books.length && <tr><td colSpan="4" className="empty">No books found.</td></tr>}
        </tbody></table></div>
      </section>
      <section className="panel"><div className="panel-head"><div><h2>Recent activity</h2><p className="muted">Latest stock movements</p></div></div>
        {data?.recent?.length ? data.recent.map(item => <div className="activity" key={item.id}><span className={item.type === 'BORROW' ? 'activity-icon borrow' : 'activity-icon'}>{item.type === 'BORROW' ? '↗' : '＋'}</span><div><b>{item.type === 'BORROW' ? 'Book borrowed' : 'Stock received'}</b><small>{item.book_title} · {item.quantity} copies</small></div></div>) : <p className="empty">No transactions recorded yet.</p>}
      </section>
    </div>
  </>;
}
function Stat({ label, value, icon }) { return <div className="stat-card"><div className="stat-icon">{icon}</div><p>{label}</p><strong>{value}</strong></div>; }
