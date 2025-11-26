const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL in environment variables');
  }

  try {
    await prisma.$connect();
    console.log('Database connected via Prisma');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error disconnecting Prisma client:', error.message);
  }
};

module.exports = {
  prisma,
  connectDB,
  disconnectDB,
};
