import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { api } from "../services/api";

const TOKEN_KEY = "pocketledger_token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          await hydrateSession(storedToken);
        }
      } catch (err) {
        console.warn("Failed to restore session", err);
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, []);

  const hydrateSession = async (authToken) => {
    try {
      const response = await api.auth.me(authToken);
      setToken(authToken);
      setUser(response.data?.user || response.user);
    } catch (err) {
      console.warn("Session hydrate failed", err?.message);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  };

  const handleAuthSuccess = async (payload) => {
    const authToken = payload.token || payload.data?.token;
    const authUser = payload.user || payload.data?.user;
    await AsyncStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(authUser);
  };

  const register = async ({ name, email, password }) => {
    setAuthLoading(true);
    setError(null);
    try {
      const response = await api.auth.register({ name, email, password });
      await handleAuthSuccess(response);
      return response;
    } catch (err) {
      setError(err.message);
      Alert.alert("Registration failed", err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setAuthLoading(true);
    setError(null);
    try {
      const response = await api.auth.login({ email, password });
      await handleAuthSuccess(response);
      return response;
    } catch (err) {
      setError(err.message);
      Alert.alert("Login failed", err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } finally {
      setToken(null);
      setUser(null);
      setAuthLoading(false);
    }
  };

  const updateProfile = async (payload) => {
    if (!token) return;
    setAuthLoading(true);
    try {
      const response = await api.auth.updateProfile(token, payload);
      const updatedUser = response.data?.user || response.user;
      setUser(updatedUser);
      return response;
    } catch (err) {
      setError(err.message);
      Alert.alert('Update failed', err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const changePassword = async (payload) => {
    if (!token) return;
    setAuthLoading(true);
    try {
      const response = await api.auth.changePassword(token, payload);
      return response;
    } catch (err) {
      setError(err.message);
      Alert.alert('Password change failed', err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      authLoading,
      error,
      register,
      login,
      logout,
      updateProfile,
      changePassword,
      refreshProfile: () => (token ? hydrateSession(token) : null),
      clearError: () => setError(null),
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, initializing, authLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
