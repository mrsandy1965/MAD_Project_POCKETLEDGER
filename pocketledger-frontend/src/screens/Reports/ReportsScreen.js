import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ReportsScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isWebView = width > 768;
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const now = new Date();
      const response = await api.reports.monthly(token, {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      setReport(response.data || response);
    } catch (err) {
      console.warn("Failed to load report", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [token]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isWebView && styles.containerWeb,
        ]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchReport} />
        }
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.header}>Reports</Text>
        <Text style={styles.subHeader}>
          A summary of your financial activity.
        </Text>

        {report ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Monthly Summary ({report.month}/{report.year})
              </Text>
              <View style={styles.summaryChart}>
                <Text style={styles.summaryLine}>
                  Income: ${report.totalIncome?.toFixed(2) || "0.00"}
                </Text>
                <Text style={styles.summaryLine}>
                  Expenses: ${report.totalExpenses?.toFixed(2) || "0.00"}
                </Text>
                <Text style={styles.summaryLine}>
                  Profit: ${report.profit?.toFixed(2) || "0.00"}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Category Breakdown</Text>
              {report.categoryBreakdown?.length ? (
                report.categoryBreakdown.map((category) => (
                  <CategoryItem
                    key={category.category}
                    category={category.category}
                    amount={category.expense}
                    percentage={Math.min(
                      100,
                      ((category.expense || 0) / (report.totalExpenses || 1)) *
                        100
                    )}
                    color="#3B82F6"
                  />
                ))
              ) : (
                <Text style={styles.chartPlaceholderText}>
                  No category data
                </Text>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.chartPlaceholderText}>
            {loading ? "Loading report..." : "No report data yet"}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const CategoryItem = ({ category, amount, percentage, color }) => (
  <View style={styles.categoryItem}>
    <View style={{ flex: 1 }}>
      <Text style={styles.categoryLabel}>{category}</Text>
      <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
    </View>
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          { width: `${percentage}%`, backgroundColor: color },
        ]}
      />
    </View>
    <Text style={styles.categoryPercentage}>{percentage}%</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
  container: { padding: 20 },
  containerWeb: { paddingHorizontal: "10%", paddingTop: 30 },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: "#6A6A6A",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  summaryChart: {
    height: 200,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryLine: { fontSize: 16, fontWeight: "600", marginVertical: 4 },
  chartPlaceholderText: { color: "#9CA3AF", fontWeight: "500" },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryLabel: { fontWeight: "600" },
  categoryAmount: { fontSize: 12, color: "#6B7280" },
  progressBar: {
    flex: 2,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginHorizontal: 12,
  },
  progressFill: { height: "100%", borderRadius: 4 },
  categoryPercentage: { width: 40, textAlign: "right", fontWeight: "600" },
});
