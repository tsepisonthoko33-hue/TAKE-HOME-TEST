import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Books from './pages/Books.jsx';
import Transactions from './pages/Transactions.jsx';
import Users from './pages/Users.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('libraryUser')); } catch { return null; }
  });

  function login(user) {
    localStorage.setItem('libraryUser', JSON.stringify(user));
    setCurrentUser(user);
  }
  function logout() {
    localStorage.removeItem('libraryUser');
    setCurrentUser(null);
  }

  if (!currentUser) return <Login onLogin={login} />;

  return (
    <Layout user={currentUser} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/transactions" element={<Transactions user={currentUser} />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
