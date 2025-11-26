const { prisma } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    if (!title || !amount || !type || !category) {
      return errorResponse(res, 'Title, amount, type and category are required', 400);
    }

    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount)) {
      return errorResponse(res, 'Amount must be a number', 400);
    }

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parsedAmount,
        type,
        category,
        date: date ? new Date(date) : new Date(),
        notes,
        userId: req.user.id,
      },
    });

    return successResponse(res, { transaction }, 'Transaction created', 201);
  } catch (error) {
    console.error('Create transaction error:', error.message);
    return errorResponse(res, 'Unable to create transaction');
  }
};

const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 50 } = req.query;

    const where = { userId: req.user.id };

    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 50;
    const skip = (pageNumber - 1) * limitNumber;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limitNumber,
      }),
      prisma.transaction.count({ where }),
    ]);

    return successResponse(res, {
      transactions,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error.message);
    return errorResponse(res, 'Unable to fetch transactions');
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    const { title, amount, type, category, date, notes } = req.body;
    const payload = {};

    if (title) payload.title = title;
    if (type) payload.type = type;
    if (category) payload.category = category;
    if (date) payload.date = new Date(date);
    if (typeof notes !== 'undefined') payload.notes = notes;
    if (typeof amount !== 'undefined') {
      const parsedAmount = Number(amount);
      if (Number.isNaN(parsedAmount)) {
        return errorResponse(res, 'Amount must be a number', 400);
      }
      payload.amount = parsedAmount;
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: payload,
    });

    return successResponse(res, { transaction }, 'Transaction updated');
  } catch (error) {
    console.error('Update transaction error:', error.message);
    return errorResponse(res, 'Unable to update transaction');
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    await prisma.transaction.delete({ where: { id } });

    return successResponse(res, { id }, 'Transaction deleted');
  } catch (error) {
    console.error('Delete transaction error:', error.message);
    return errorResponse(res, 'Unable to delete transaction');
  }
};

const getTransactionStats = async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const graphMap = {};

    transactions.forEach((item) => {
      const dateKey = item.date.toISOString().slice(0, 10);
      if (!graphMap[dateKey]) {
        graphMap[dateKey] = { income: 0, expense: 0 };
      }
      graphMap[dateKey][item.type] += item.amount;

      if (item.type === 'income') totalIncome += item.amount;
      if (item.type === 'expense') totalExpenses += item.amount;
    });

    const graphData = [];
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(endDate.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      graphData.push({
        date: key,
        income: graphMap[key]?.income || 0,
        expense: graphMap[key]?.expense || 0,
      });
    }

    return successResponse(res, {
      totalIncome,
      totalExpenses,
      totalProfit: totalIncome - totalExpenses,
      graphData,
    });
  } catch (error) {
    console.error('Stats error:', error.message);
    return errorResponse(res, 'Unable to fetch stats');
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
};
