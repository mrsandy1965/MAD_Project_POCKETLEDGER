const jwt = require('jsonwebtoken');
const { user } = require('../prismaClient');
const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzU4Mjk0NTM4LCJleHAiOjE3NTkwMTQ1Mzh9.tiGRXH7ILEzR8bYmNyTCt1K1PWCe2OdheBOwkcpNr-I';
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(JWT_SECRET === token)
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;