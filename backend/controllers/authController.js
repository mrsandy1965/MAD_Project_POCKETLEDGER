const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email and password are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existingUser) {
      return errorResponse(res, 'User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email: normalizedEmail, password: hashedPassword },
    });

    return successResponse(
      res,
      {
        user: sanitizeUser(user),
        token: generateToken(user.id),
      },
      'Registration successful',
      201
    );
  } catch (error) {
    console.error('Register error:', error.message);
    return errorResponse(res, 'Unable to register user');
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    return successResponse(res, {
      user: sanitizeUser(user),
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return errorResponse(res, 'Unable to login user');
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return successResponse(res, { user: sanitizeUser(req.user) });
  } catch (error) {
    console.error('Get user error:', error.message);
    return errorResponse(res, 'Unable to fetch user');
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return errorResponse(res, 'Nothing to update', 400);
    }

    const updateData = {};

    if (name) {
      updateData.name = name.trim();
    }

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail !== req.user.email) {
        const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (exists) {
          return errorResponse(res, 'Email already in use', 409);
        }
        updateData.email = normalizedEmail;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    return successResponse(res, { user: sanitizeUser(updatedUser) }, 'Profile updated');
  } catch (error) {
    console.error('Update profile error:', error.message);
    return errorResponse(res, 'Unable to update profile');
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Current and new password are required', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    return successResponse(res, {}, 'Password updated');
  } catch (error) {
    console.error('Change password error:', error.message);
    return errorResponse(res, 'Unable to change password');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
};
