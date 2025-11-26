import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

export const TransactionsContext = createContext(null);

export const TransactionsProvider = ({ children }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.transactions.list(token, { limit: 100 });
      const payload = response.data || response;
      setTransactions(payload.transactions || []);
    } catch (err) {
      setError(err.message);
      console.warn("Fetch transactions failed", err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    setStatsLoading(true);
    try {
      const response = await api.transactions.stats(token);
      const payload = response.data || response;
      setStats(payload);
    } catch (err) {
      console.warn("Fetch stats failed", err.message);
    } finally {
      setStatsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchStats();
    } else {
      setTransactions([]);
      setStats(null);
    }
  }, [token, fetchTransactions, fetchStats]);

  const addTransaction = useCallback(
    async (transaction) => {
      if (!token) return;
      try {
        const response = await api.transactions.create(token, transaction);
        const payload = response.data || response;
        if (payload.transaction) {
          setTransactions((prev) => [payload.transaction, ...prev]);
          fetchStats();
        }
        return payload;
      } catch (err) {
        Alert.alert("Unable to save", err.message);
        throw err;
      }
    },
    [token, fetchStats]
  );

  const contextValue = useMemo(
    () => ({
      transactions,
      stats,
      loading,
      statsLoading,
      error,
      refreshTransactions: fetchTransactions,
      refreshStats: fetchStats,
      addTransaction,
    }),
    [transactions, stats, loading, statsLoading, error, fetchTransactions, fetchStats, addTransaction]
  );

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }
  return context;
};
