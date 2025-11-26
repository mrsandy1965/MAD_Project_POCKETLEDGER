const { prisma } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getMonthlyReport = async (req, res) => {
  try {
    const today = new Date();
    const month = Number(req.query.month) || today.getMonth() + 1;
    const year = Number(req.query.year) || today.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryMap = {};

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpenses += tx.amount;
      }

      if (!categoryMap[tx.category]) {
        categoryMap[tx.category] = { income: 0, expense: 0 };
      }

      categoryMap[tx.category][tx.type] += tx.amount;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, values]) => ({
      category,
      income: values.income,
      expense: values.expense,
      net: values.income - values.expense,
    }));

    return successResponse(res, {
      month,
      year,
      totalIncome,
      totalExpenses,
      profit: totalIncome - totalExpenses,
      categoryBreakdown,
      transactions,
    });
  } catch (error) {
    console.error('Monthly report error:', error.message);
    return errorResponse(res, 'Unable to generate monthly report');
  }
};

module.exports = {
  getMonthlyReport,
};
