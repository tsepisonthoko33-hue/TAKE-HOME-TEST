import { useEffect, useState } from 'react';
import { api } from '../api.js';

const empty = { name: '', membership_id: '', password: '', role: 'Member' };
export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function load() { try { setUsers(await api('/users')); } catch (e) { setError(e.message); } }
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault(); setMessage(''); setError('');
    const body = { ...form }; if (editing && !body.password) delete body.password;
    try {
      await api(editing ? `/users/${editing}` : '/users', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(body) });
      setMessage(editing ? 'User updated.' : 'User added.'); setForm(empty); setEditing(null); load();
    } catch (e) { setError(e.message); }
  }
  function edit(u) { setEditing(u.id); setForm({ name: u.name, membership_id: u.membership_id, password: '', role: u.role }); }
  async function remove(id) {
    if (!window.confirm('Delete this user?')) return;
    try { await api(`/users/${id}`, { method: 'DELETE' }); setMessage('User deleted.'); load(); }
    catch (e) { setError(e.message); }
  }
  return <><div className="page-heading"><div><p className="eyebrow">PEOPLE</p><h1>User Management</h1><p className="muted">Manage library members and staff accounts.</p></div></div>
    <section className="panel form-panel"><div className="panel-head"><div><h2>{editing ? 'Update user' : 'Add a user'}</h2><p className="muted">Create an account with a unique membership ID.</p></div></div>
      <form className="form-grid" onSubmit={submit}>
        <label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Membership ID<input value={form.membership_id} onChange={e => setForm({ ...form, membership_id: e.target.value })} required /></label>
        <label>{editing ? 'New password (optional)' : 'Password'}<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editing} /></label>
        <label>Role<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>Member</option><option>Librarian</option><option>Admin</option></select></label>
        <div className="form-actions"><button className="primary">{editing ? 'Save changes' : '＋ Add user'}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}</div>
      </form>{message && <p className="success">{message}</p>}{error && <p className="error">{error}</p>}
    </section>
    <section className="panel"><div className="panel-head"><div><h2>Registered users</h2><p className="muted">{users.length} accounts</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>NAME</th><th>MEMBERSHIP ID</th><th>ROLE</th><th>ACTIONS</th></tr></thead><tbody>
        {users.map(u => <tr key={u.id}><td><b>{u.name}</b></td><td>{u.membership_id}</td><td>{u.role}</td><td><button className="text-button" onClick={() => edit(u)}>Edit</button><button className="text-button danger" onClick={() => remove(u.id)}>Delete</button></td></tr>)}
        {!users.length && <tr><td colSpan="4" className="empty">No users found.</td></tr>}
      </tbody></table></div>
    </section>
  </>;
}
