const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'Sandesh@20022006@Sandesh';
async function register(req, res) {
  try {
    const user = await userService.createUser(req.body);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({user,token});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { register };