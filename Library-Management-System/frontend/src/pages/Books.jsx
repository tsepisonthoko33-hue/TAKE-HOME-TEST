import { useEffect, useState } from 'react';
import { api } from '../api.js';

const blank = { title: '', author: '', genre: '', isbn: '', quantity: 0 };
export default function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() { try { setBooks(await api('/books')); } catch (e) { setError(e.message); } }
  useEffect(() => { load(); }, []);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.name === 'quantity' ? e.target.value : e.target.value }); }
  async function submit(e) {
    e.preventDefault(); setMessage(''); setError('');
    try {
      const path = editing ? `/books/${editing}` : '/books';
      await api(path, { method: editing ? 'PUT' : 'POST', body: JSON.stringify({ ...form, quantity: Number(form.quantity) }) });
      setMessage(editing ? 'Book updated.' : 'Book added.'); setForm(blank); setEditing(null); load();
    } catch (err) { setError(err.message); }
  }
  function edit(book) { setEditing(book.id); setForm({ title: book.title, author: book.author, genre: book.genre, isbn: book.isbn, quantity: book.quantity }); }
  async function remove(id) {
    if (!window.confirm('Delete this book?')) return;
    try { await api(`/books/${id}`, { method: 'DELETE' }); setMessage('Book deleted.'); load(); }
    catch (e) { setError(e.message); }
  }

  return <><div className="page-heading"><div><p className="eyebrow">COLLECTION</p><h1>Book Management</h1><p className="muted">Add, update and manage books in your collection.</p></div></div>
    <section className="panel form-panel"><div className="panel-head"><div><h2>{editing ? 'Update book' : 'Add a new book'}</h2><p className="muted">Enter the book details below.</p></div></div>
      <form className="form-grid" onSubmit={submit}>
        <label>Title<input name="title" value={form.title} onChange={change} required /></label>
        <label>Author<input name="author" value={form.author} onChange={change} required /></label>
        <label>Genre<input name="genre" value={form.genre} onChange={change} required /></label>
        <label>ISBN<input name="isbn" value={form.isbn} onChange={change} required /></label>
        <label>Initial quantity<input name="quantity" type="number" min="0" value={form.quantity} onChange={change} required /></label>
        <div className="form-actions"><button className="primary">{editing ? 'Save changes' : '＋ Add book'}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</button>}</div>
      </form>{message && <p className="success">{message}</p>}{error && <p className="error">{error}</p>}
    </section>
    <section className="panel"><div className="panel-head"><div><h2>All books</h2><p className="muted">{books.length} titles in the collection</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>TITLE</th><th>AUTHOR</th><th>GENRE</th><th>ISBN</th><th>STOCK</th><th>ACTIONS</th></tr></thead><tbody>
        {books.map(book => <tr key={book.id}><td><b>{book.title}</b></td><td>{book.author}</td><td>{book.genre}</td><td>{book.isbn}</td><td><span className={book.quantity < 2 ? 'stock low' : 'stock'}>{book.quantity}</span></td><td><button className="text-button" onClick={() => edit(book)}>Edit</button><button className="text-button danger" onClick={() => remove(book.id)}>Delete</button></td></tr>)}
        {!books.length && <tr><td colSpan="6" className="empty">No books yet. Add your first book above.</td></tr>}
      </tbody></table></div>
    </section>
  </>;
}
