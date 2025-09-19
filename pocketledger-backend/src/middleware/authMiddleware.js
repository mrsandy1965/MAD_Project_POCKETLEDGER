const jwt = require('jsonwebtoken');
const { user } = require('../prismaClient');
const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc1ODI5MzAzNywiZXhwIjoxNzU4Mjk2NjM3fQ.goS11EHzjlPj0xEHoBHdv03o7Mhnqa99Nrm3K6WcJ4Q';
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



next()
}

module.exports = authenticateToken;