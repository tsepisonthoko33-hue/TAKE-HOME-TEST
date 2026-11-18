export function requireLogin(req, res, next) {
  // Basic demonstration check. Replace with sessions/JWT and hashed passwords for production.
  const userId = req.header('x-user-id');
  if (!userId) return res.status(401).json({ message: 'Please log in first.' });
  req.userId = Number(userId);
  next();
}
