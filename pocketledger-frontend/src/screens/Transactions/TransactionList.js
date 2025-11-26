import React, { useState, useMemo } from "react";
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
import { useTransactions } from "../../context/TransactionsContext";

export default function TransactionList({ navigation }) {
  const { transactions, loading, refreshTransactions } = useTransactions();
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState("All");

  const filteredTransactions = useMemo(() => {
    if (filter === "All") return transactions;
    return transactions.filter((t) => t.type === filter.toLowerCase());
  }, [filter, transactions]);

  const isWebView = width > 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isWebView && styles.containerWeb]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transactions</Text>
          <View style={styles.filterContainer}>
            {["All", "Income", "Expense"].map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterButton,
                  filter === f && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? "Loading transactions..." : "No transactions found."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TransactionItem item={item} />}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refreshTransactions}
                tintColor="#007AFF"
              />
            }
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddTransaction")}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const TransactionItem = ({ item }) => {
  const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;
  const isIncome = item.type === "income";
  const title = item.vendor || item.title || item.category || "Entry";
  const displayDate = item.date
    ? new Date(item.date).toISOString().slice(0, 10)
    : "";

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemVendor}>{title}</Text>
        <Text style={styles.itemDate}>
          {displayDate}
          {item.category ? ` • ${item.category}` : ""}
        </Text>
      </View>
      <Text
        style={[
          styles.itemAmount,
          isIncome ? styles.incomeText : styles.expenseText,
        ]}
      >
        {isIncome ? "" : "-"}
        {formatCurrency(item.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
  container: { flex: 1, padding: 16 },
  containerWeb: { paddingHorizontal: "10%", paddingTop: 30 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: "bold", color: "#1C1C1E" },
  filterContainer: { flexDirection: "row", marginTop: 16, gap: 10 },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterButtonActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  filterText: { fontWeight: "600", color: "#4B5563" },
  filterTextActive: { color: "#FFFFFF" },
  listContent: { paddingBottom: 80 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#6A6A6A" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemDetails: {},
  itemVendor: { fontWeight: "bold", fontSize: 16, color: "#111827" },
  itemDate: { color: "#6B7280", marginTop: 4 },
  itemAmount: { fontWeight: "bold", fontSize: 16 },
  incomeText: { color: "#16A34A" },
  expenseText: { color: "#DC2626" },
});
