import React, { createContext, useState } from 'react';

// Create context
export const TransactionsContext = createContext();

// Provider component
export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Function to add a new transaction
  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};
