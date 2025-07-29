// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
const pool = require('../db'); 
const SECRET_KEY = 'your_super_secret_key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

 jwt.verify(token, SECRET_KEY, (err, user) => {
  if (err) return res.status(403).json({ error: 'Invalid or expired token' });
  
  // Decoded JWT payload: user
  
  req.user = user;
  next();
});

}

module.exports = authenticateToken;
