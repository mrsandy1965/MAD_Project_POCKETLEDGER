const transactionService = require('../services/transactionService');

async function addTransaction(req, res) {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getUserTransactions(req, res) {
  try {
    const transactions = await transactionService.getTransactionsByUser(req.params.userId);
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { addTransaction, getUserTransactions };