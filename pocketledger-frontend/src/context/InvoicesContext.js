import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const InvoicesContext = createContext(null);

export const InvoicesProvider = ({ children }) => {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.invoices.list(token);
      const payload = response.data || response;
      setInvoices(payload.invoices || []);
    } catch (err) {
      console.warn('Fetch invoices failed', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getInvoice = useCallback(
    async (id) => {
      if (!token) return null;
      try {
        const response = await api.invoices.get(token, id);
        const payload = response.data || response;
        return payload.invoice || payload;
      } catch (err) {
        console.warn('Get invoice failed', err.message);
        throw err;
      }
    },
    [token]
  );

  const createInvoice = useCallback(
    async (payload) => {
      if (!token) throw new Error('Not authenticated');
      const tempId = `tmp_${Date.now()}`;
      const optimistic = { id: tempId, ...payload, items: payload.items || [] };
      setInvoices((prev) => [optimistic, ...prev]);
      try {
        const response = await api.invoices.create(token, payload);
        const data = response.data || response;
        const created = data.invoice || data;
        setInvoices((prev) => prev.map((inv) => (inv.id === tempId ? created : inv)));
        return created;
      } catch (err) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== tempId));
        console.warn('Create invoice failed', err.message);
        throw err;
      }
    },
    [token]
  );

  const updateInvoice = useCallback(
    async (id, payload) => {
      if (!token) throw new Error('Not authenticated');
      const prev = invoices;
      setInvoices((curr) => curr.map((inv) => (inv.id === id ? { ...inv, ...payload } : inv)));
      try {
        const response = await api.invoices.update(token, id, payload);
        const data = response.data || response;
        const updated = data.invoice || data;
        setInvoices((curr) => curr.map((inv) => (inv.id === id ? updated : inv)));
        return updated;
      } catch (err) {
        setInvoices(prev);
        console.warn('Update invoice failed', err.message);
        throw err;
      }
    },
    [token, invoices]
  );

  const removeInvoice = useCallback(
    async (id) => {
      if (!token) throw new Error('Not authenticated');
      const backup = invoices;
      setInvoices((curr) => curr.filter((inv) => inv.id !== id));
      try {
        await api.invoices.remove(token, id);
      } catch (err) {
        setInvoices(backup);
        console.warn('Delete invoice failed', err.message);
        throw err;
      }
    },
    [token, invoices]
  );

  useEffect(() => {
    if (token) fetchInvoices();
    else setInvoices([]);
  }, [token, fetchInvoices]);

  const value = useMemo(
    () => ({ invoices, loading, error, fetchInvoices, getInvoice, createInvoice, updateInvoice, removeInvoice }),
    [invoices, loading, error, fetchInvoices, getInvoice, createInvoice, updateInvoice, removeInvoice]
  );

  return <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>;
};

export const useInvoices = () => {
  const ctx = useContext(InvoicesContext);
  if (!ctx) throw new Error('useInvoices must be used within InvoicesProvider');
  return ctx;
};

export default InvoicesContext;
