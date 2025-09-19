const express = require('express');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const receiptRoutes = require('./routes/receiptRoute');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/transactions', authenticateToken ,transactionRoutes);
app.use('/receipts', authenticateToken ,receiptRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});