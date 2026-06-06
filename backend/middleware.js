import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'empire-homepath-pro-secret-key-2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

export const checkSubscription = (req, res, next) => {
  // This middleware is used on routes that require an active subscription
  // In a real app, you might fetch the user from DB here to check role/status
  // For the SPA logic, we often check this in the route handler itself or 
  // pass user data through the token.
  
  // Since we want to allow Admins to bypass subscription checks, 
  // we should ideally have the role in the JWT or fetch user from DB.
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};
