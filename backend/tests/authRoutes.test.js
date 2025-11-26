/* eslint-disable global-require */
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecretkey';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('../config/db', () => ({
  prisma: mockPrisma,
  connectDB: jest.fn(),
  disconnectDB: jest.fn(),
}));

const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    mockPrisma.user.findUnique.mockReset();
    mockPrisma.user.create.mockReset();
  });

  it('registers a user and returns JWT', async () => {
    const payload = { name: 'Jane Doe', email: 'jane@example.com', password: 'Password123!' };
    const createdUser = {
      id: 'user_1',
      name: payload.name,
      email: payload.email.toLowerCase(),
      createdAt: new Date('2024-01-01'),
    };

    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.user.create.mockResolvedValueOnce(createdUser);

    const response = await request(app).post('/api/auth/register').send(payload);

    expect(response.status).toBe(201);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: payload.email.toLowerCase() } });
    expect(mockPrisma.user.create).toHaveBeenCalled();
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toMatchObject({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    });
    expect(response.body.data.token).toBeDefined();
  });

  it('logs in a user with valid credentials', async () => {
    const email = 'john@example.com';
    const plainPassword = 'Password123!';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const dbUser = {
      id: 'user_2',
      name: 'John Doe',
      email,
      password: hashedPassword,
      createdAt: new Date('2024-01-02'),
    };

    mockPrisma.user.findUnique.mockResolvedValueOnce(dbUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password: plainPassword });

    expect(response.status).toBe(200);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: email.toLowerCase() } });
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.id).toBe(dbUser.id);
    expect(response.body.data.token).toBeTruthy();
  });

  it('returns the current user when a valid token is provided', async () => {
    const user = {
      id: 'user_3',
      name: 'Current User',
      email: 'current@example.com',
      createdAt: new Date('2024-01-03'),
    };

    mockPrisma.user.findUnique.mockResolvedValueOnce(user);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toMatchObject({ id: user.id, name: user.name });
  });
});
