const userService = require('../services/userService');

async function register(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { register };