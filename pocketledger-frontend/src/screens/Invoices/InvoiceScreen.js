import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const mockInvoices = [
  {
    id: "1",
    client: "TechCorp",
    amount: 1200,
    status: "Paid",
    date: "2024-07-15",
  },
  {
    id: "2",
    client: "Innovate LLC",
    amount: 3500,
    status: "Due",
    date: "2024-08-01",
  },
  {
    id: "3",
    client: "DesignCo",
    amount: 850,
    status: "Overdue",
    date: "2024-06-20",
  },
];

const statusStyles = {
  Paid: { bg: "#DEF7EC", text: "#047857" },
  Due: { bg: "#FEF3C7", text: "#B45309" },
  Overdue: { bg: "#FEE2E2", text: "#B91C1C" },
};

export default function InvoiceScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isWebView = width > 768;

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
          data={mockInvoices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <InvoiceItem item={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

const InvoiceItem = ({ item }) => (
  <View style={styles.card}>
    <View>
      <Text style={styles.clientName}>{item.client}</Text>
      <Text style={styles.invoiceDate}>Due: {item.date}</Text>
    </View>
    <View style={{ alignItems: "flex-end" }}>
      <Text style={styles.invoiceAmount}>${item.amount.toFixed(2)}</Text>
      <View
        style={[
          styles.statusPill,
          { backgroundColor: statusStyles[item.status].bg },
        ]}
      >
        <Text
          style={[styles.statusText, { color: statusStyles[item.status].text }]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  </View>
);

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
});
