import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const checkSubscription = (req, res, next) => {
  // Logic to check if user has an active subscription
  // We'll fetch the user from DB in the actual route if needed, 
  // or decode from token if we include it there.
  next();
};
