import { NavLink } from 'react-router-dom';

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">▤</span><div>Book<span>Space</span><small>LIBRARY SYSTEM</small></div></div>
        <p className="nav-label">WORKSPACE</p>
        <nav>
          <NavLink to="/">▦ <span>Dashboard</span></NavLink>
          <NavLink to="/books">▤ <span>Book Management</span></NavLink>
          <NavLink to="/transactions">⇄ <span>Transactions</span></NavLink>
          <NavLink to="/users">♙ <span>User Management</span></NavLink>
        </nav>
        <div className="sidebar-bottom"><div className="avatar">{user.name?.[0]?.toUpperCase()}</div><div className="user-mini"><b>{user.name}</b><small>{user.role}</small></div><button className="logout" onClick={onLogout} title="Log out">↪</button></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div><span className="muted">Library / </span><b>Management Portal</b></div><div className="top-user">● <span>{user.name}</span></div></header>
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
