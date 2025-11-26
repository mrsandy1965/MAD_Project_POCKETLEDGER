import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactions } from "../../context/TransactionsContext";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const { stats, transactions, statsLoading, refreshStats, refreshTransactions } = useTransactions();

  const chartData = useMemo(() => stats?.graphData ?? [], [stats]);
  const totalIncome = stats?.totalIncome ?? 0;
  const totalExpenses = stats?.totalExpenses ?? 0;
  const totalProfit = stats ? stats.totalProfit : totalIncome - totalExpenses;
  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={statsLoading}
            onRefresh={() => {
              refreshStats();
              refreshTransactions();
            }}
          />
        }
      >
        <View style={styles.welcomeBox}>
          <Text style={styles.header}>Welcome Back!</Text>
          <Text style={styles.subHeader}>
            Here's a snapshot of your financial health.
          </Text>
        </View>

        {/* Top Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            label="Total Revenue"
            value={`$${totalIncome.toFixed(2)}`}
            change="Last 7 days"
            changeColor="#34A853"
            icon="↑"
          />
          <StatCard
            label="Total Expenses"
            value={`$${totalExpenses.toFixed(2)}`}
            change="Last 7 days"
            changeColor="#EA4335"
            icon="↓"
          />
          <StatCard
            label="Net Profit"
            value={`$${totalProfit.toFixed(2)}`}
            change="Revenue - Expenses"
            changeColor="#34A853"
            icon="$"
          />
        </View>

        {/* Dynamic Profit & Loss Chart */}
        <ProfitLossChart data={chartData} />

        <SpendingByCategory stats={stats} />

        <RecentTransactions transactions={recentTransactions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const StatCard = ({ label, value, change, changeColor, icon }) => (
  <View style={styles.statCard}>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statChange, { color: changeColor }]}>{change}</Text>
    </View>
    <View style={styles.iconContainer}>
      <Text style={styles.statIcon}>{icon}</Text>
    </View>
  </View>
);

const ProfitLossChart = ({ data }) => {
  if (!data.length) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profit & Loss (Last 7 days)</Text>
        <Text style={styles.cardSubtitle}>No data yet</Text>
      </View>
    );
  }

  const maxValue = Math.max(
    ...data.map((entry) => Math.max(entry.income || 0, entry.expense || 0)),
    1
  );

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Profit & Loss (Dynamic)</Text>
      <Text style={styles.cardSubtitle}>Monthly income vs. expenses</Text>

      <View style={styles.barChartWrapper}>
        {data.map((entry) => {
          const incomeBar = ((entry.income || 0) / maxValue) * 100;
          const expenseBar = ((entry.expense || 0) / maxValue) * 100;
          return (
            <View key={entry.date} style={styles.barGroup}>
              <Text style={styles.barMonth}>
                {entry.date.slice(5)}
              </Text>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barItem,
                    { height: `${incomeBar}%`, backgroundColor: "#34A853" },
                  ]}
                />
                <View
                  style={[
                    styles.barItem,
                    { height: `${expenseBar}%`, backgroundColor: "#EA4335" },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColorBox, { backgroundColor: "#34A853" }]}
          />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColorBox, { backgroundColor: "#EA4335" }]}
          />
          <Text style={styles.legendText}>Expense</Text>
        </View>
      </View>
    </View>
  );
};

const RecentTransactions = ({ transactions }) => {
  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Recent Transactions</Text>
      <Text style={styles.cardSubtitle}>Latest financial activities</Text>

      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>No transactions yet</Text>
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Vendor</Text>
            <Text style={[styles.th, { flex: 1.2 }]}>Type</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>Category</Text>
            <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>
              Amount
            </Text>
          </View>
          {transactions.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.tdVendor}>{item.title || item.vendor}</Text>
                <Text style={styles.tdDate}>
                  {new Date(item.date).toISOString().slice(0, 10)}
                </Text>
              </View>
              <View style={{ flex: 1.2 }}>
                <View
                  style={[
                    styles.typePill,
                    item.type === "income"
                      ? styles.incomePill
                      : styles.expensePill,
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      item.type === "income"
                        ? styles.incomePillText
                        : styles.expensePillText,
                    ]}
                  >
                    {item.type}
                  </Text>
                </View>
              </View>
              <Text style={[styles.td, { flex: 1.5 }]}>{item.category}</Text>
              <Text style={[styles.td, styles.tdAmount, { flex: 1 }]}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

const SpendingByCategory = ({ stats }) => {
  if (!stats?.graphData?.length) {
    return null;
  }

  const income = stats.totalIncome || 0;
  const expenses = stats.totalExpenses || 0;
  const data = [
    { label: "Income", percentage: income ? 100 : 0, color: "#34A853" },
    { label: "Expenses", percentage: expenses ? 100 : 0, color: "#EA4335" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Spending by Category</Text>
      <Text style={styles.cardSubtitle}>Breakdown of your expenses</Text>
      <View style={styles.barChartContainer}>
        {data.map((item) => (
          <View key={item.label} style={styles.barRow}>
            <Text style={styles.barLabel}>{item.label}</Text>
            <View style={styles.barBackgroundLine}>
              <View
                style={[
                  styles.bar,
                  { width: `${item.percentage}%`, backgroundColor: item.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  scrollContainer: { padding: 16 },
  welcomeBox: { marginBottom: 20 },
  header: { fontSize: 26, fontWeight: "bold", color: "#1C1C1E" },
  subHeader: { fontSize: 16, color: "#6A6A6A", marginTop: 4 },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  statLabel: { fontSize: 13, color: "#6A6A6A" },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 4,
    marginBottom: 6,
  },
  statChange: { fontSize: 12, fontWeight: "500" },
  iconContainer: {
    backgroundColor: "#F0F4F8",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: { fontSize: 14, fontWeight: "bold", color: "#6A6A6A" },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1C1C1E" },
  cardSubtitle: { fontSize: 14, color: "#6A6A6A", marginBottom: 20 },

  barChartWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 200,
    marginBottom: 20,
  },
  barGroup: { alignItems: "center" },
  barMonth: { fontSize: 12, color: "#6A6A6A", marginBottom: 8 },
  barBackground: {
    width: 20,
    height: 150,
    backgroundColor: "#F0F4F8",
    borderRadius: 6,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  barItem: {
    width: 8,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendColorBox: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: { fontSize: 12, color: "#6A6A6A" },

  // Spending Chart
  barChartContainer: { marginTop: 10 },
  barRow: { marginBottom: 15 },
  barLabel: { fontSize: 14, color: "#6A6A6A", marginBottom: 6 },
  barBackgroundLine: {
    height: 20,
    backgroundColor: "#F0F4F8",
    borderRadius: 10,
    overflow: "hidden",
  },
  bar: { height: "100%", borderRadius: 10 },

  // Transactions
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  th: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tdVendor: { fontSize: 14, fontWeight: "bold", color: "#111827" },
  tdDate: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  tdAmount: { fontWeight: "bold", textAlign: "right" },
  typePill: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  incomePill: { backgroundColor: "#DEF7EC" },
  expensePill: { backgroundColor: "#FEE2E2" },
  pillText: { fontSize: 12, fontWeight: "500" },
  incomePillText: { color: "#047857" },
  expensePillText: { color: "#B91C1C" },
  emptyText: { fontSize: 14, color: "#6A6A6A", textAlign: "center" },
});
