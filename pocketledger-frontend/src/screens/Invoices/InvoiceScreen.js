import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const statusStyles = {
  paid: { bg: "#DEF7EC", text: "#047857", label: "Paid" },
  unpaid: { bg: "#FEE2E2", text: "#B91C1C", label: "Unpaid" },
};

export default function InvoiceScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isWebView = width > 768;
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await api.invoices.list(token);
      const payload = response.data || response;
      setInvoices(payload.invoices || []);
    } catch (err) {
      console.warn("Failed to fetch invoices", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isWebView && styles.containerWeb]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Invoices</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>New Invoice</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <InvoiceItem item={item} />}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchInvoices} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading ? "Loading invoices..." : "No invoices found"}
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const InvoiceItem = ({ item }) => {
  const statusKey = item.status?.toLowerCase() || "unpaid";
  const statusConfig = statusStyles[statusKey] || statusStyles.unpaid;

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <Text style={styles.invoiceDate}>
          Due: {new Date(item.date).toISOString().slice(0, 10)}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.invoiceAmount}>${item.totalAmount.toFixed(2)}</Text>
        <View
          style={[styles.statusPill, { backgroundColor: statusConfig.bg }]}
        >
          <Text style={[styles.statusText, { color: statusConfig.text }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
  container: { flex: 1, padding: 20 },
  containerWeb: { paddingHorizontal: "10%", paddingTop: 30 },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 40,
  },
  headerTitle: { fontSize: 32, fontWeight: "bold" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  addButtonText: { color: "#FFFFFF", fontWeight: "600", marginLeft: 6 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  clientName: { fontSize: 16, fontWeight: "bold" },
  invoiceDate: { color: "#6B7280", marginTop: 4 },
  invoiceAmount: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  statusPill: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10 },
  statusText: { fontSize: 12, fontWeight: "600" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#6B7280" },
});
