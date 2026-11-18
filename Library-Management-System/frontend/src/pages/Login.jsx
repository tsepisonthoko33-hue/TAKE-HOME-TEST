import { useState } from 'react';
import { api } from '../api.js';

export default function Login({ onLogin }) {
  const [membership_id, setId] = useState('ADMIN001');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try { onLogin(await api('/users/login', { method: 'POST', body: JSON.stringify({ membership_id, password }) })); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <div className="login-page"><form className="login-card" onSubmit={submit}>
    <div className="login-logo">▤</div><p className="eyebrow">BOOKSPACE PORTAL</p><h1>Welcome back</h1><p className="muted">Sign in to manage your library.</p>
    <label>Membership ID<input value={membership_id} onChange={e => setId(e.target.value)} required /></label>
    <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
    {error && <p className="error">{error}</p>}<button className="primary full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in →'}</button>
    <small className="muted">Demo account: ADMIN001 / admin123</small>
  </form></div>;
}
