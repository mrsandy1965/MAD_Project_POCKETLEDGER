module.exports = {
  user: {
    name: 'Demo User',
    email: 'demo@pocketledger.app',
    password: 'Password123!',
  },
  categories: [
    { name: 'Investments', type: 'income' },
    { name: 'Healthcare', type: 'expense' },
  ],
  transactions: [
    {
      title: 'Monthly Salary',
      amount: 5000,
      type: 'income',
      category: 'Salary',
      date: new Date(),
    },
    {
      title: 'Grocery Shopping',
      amount: 120,
      type: 'expense',
      category: 'Food',
      date: new Date(),
    },
    {
      title: 'Cab Ride',
      amount: 35,
      type: 'expense',
      category: 'Travel',
      date: new Date(),
    },
  ],
  invoices: [
    {
      invoiceNumber: 'INV-1001',
      clientName: 'Acme Corp',
      status: 'unpaid',
      date: new Date(),
      items: [
        { name: 'Consulting Hours', quantity: 10, price: 120 },
        { name: 'Support Plan', quantity: 1, price: 300 },
      ],
    },
  ],
};
