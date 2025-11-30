import Constants from "expo-constants";
import { Platform } from "react-native";

const DEFAULT_API_URL = "http://localhost:8080/api";

const expoExtraUrl = Constants.expoConfig?.extra?.apiBaseUrl;
const envUrl = process.env.EXPO_PUBLIC_API_URL;
let API_BASE_URL = (expoExtraUrl || envUrl || DEFAULT_API_URL).replace(/\/$/, "");

// When running on Android emulator, replace localhost with emulator host
if (Platform.OS === "android" && API_BASE_URL.includes("localhost")) {
  API_BASE_URL = API_BASE_URL.replace("localhost", "10.0.2.2");
}

const buildHeaders = (token, customHeaders = {}) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = data?.message || response.statusText || "Request failed";
    const errors = data?.errors || [];
    const error = new Error(message);
    error.status = response.status;
    error.errors = errors;
    throw error;
  }

  return data;
};

const request = async (method, path, { body, token, headers } = {}) => {
  const options = {
    method,
    headers: buildHeaders(token, headers),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);
  return handleResponse(response);
};

export const api = {
  auth: {
    register: (payload) => request("POST", "/auth/register", { body: payload }),
    login: (payload) => request("POST", "/auth/login", { body: payload }),
    me: (token) => request("GET", "/auth/me", { token }),
    updateProfile: (token, payload) => request("PUT", "/auth/profile", { token, body: payload }),
    changePassword: (token, payload) => request("PUT", "/auth/password", { token, body: payload }),
  },
  transactions: {
    list: (token, params = {}) => {
      const query = new URLSearchParams(params).toString();
      const path = query ? `/transactions?${query}` : "/transactions";
      return request("GET", path, { token });
    },
    create: (token, payload) => request("POST", "/transactions", { token, body: payload }),
    update: (token, id, payload) => request("PUT", `/transactions/${id}`, { token, body: payload }),
    remove: (token, id) => request("DELETE", `/transactions/${id}`, { token }),
    stats: (token) => request("GET", "/transactions/stats", { token }),
  },
  categories: {
    list: (token) => request("GET", "/categories", { token }),
    create: (token, payload) => request("POST", "/categories", { token, body: payload }),
  },
  reports: {
    monthly: (token, params = {}) => {
      const query = new URLSearchParams(params).toString();
      const path = query ? `/reports/monthly?${query}` : "/reports/monthly";
      return request("GET", path, { token });
    },
  },
  invoices: {
    list: (token) => request("GET", "/invoices", { token }),
    create: (token, payload) => request("POST", "/invoices", { token, body: payload }),
    get: (token, id) => request("GET", `/invoices/${id}`, { token }),
    update: (token, id, payload) => request("PUT", `/invoices/${id}`, { token, body: payload }),
    remove: (token, id) => request("DELETE", `/invoices/${id}`, { token }),
  },
};

export const getApiBaseUrl = () => API_BASE_URL;
