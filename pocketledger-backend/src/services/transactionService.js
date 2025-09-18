const prisma = require('../prismaClient');

async function createTransaction(data) {
  return prisma.transaction.create({ data });
}

async function getTransactionsByUser(userId) {
  return prisma.transaction.findMany({ where: { userId: Number(userId) } });
}

module.exports = { createTransaction, getTransactionsByUser };