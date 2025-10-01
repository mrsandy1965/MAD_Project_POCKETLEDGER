import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcomeBox}>
          <Text style={styles.header}>Welcome Back!</Text>
          <Text style={styles.subHeader}>
            Here's a snapshot of your financial health.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            label="Total Revenue"
            value="$6,250.00"
            change="↑20.1% from last month"
            changeColor="#34A853"
            icon="↑"
          />
          <StatCard
            label="Total Expenses"
            value="$346.23"
            change="↓18.1% from last month"
            changeColor="#EA4335"
            icon="↓"
          />
          <StatCard
            label="Net Profit"
            value="$5,903.77"
            change="↑19% from last month"
            changeColor="#34A853"
            icon="$"
          />
        </View>

        <ProfitLossChart />

        <SpendingByCategory />

        <RecentTransactions />
      </ScrollView>
    </SafeAreaView>
  );
}

const StatCard = ({ label, value, change, changeColor, icon }) => {
  return (
    <View style={styles.statCard}>
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={[styles.statChange, { color: changeColor }]}>
          {change}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Text style={styles.statIcon}>{icon}</Text>
      </View>
    </View>
  );
};

const ProfitLossChart = () => {
  const yAxisLabels = ["$8k", "$6k", "$4k", "$2k", "$0k"];
  const incomeValue = 6250;
  const expenseValue = 346.23;
  const maxValue = 8000;

  const incomePosition = (incomeValue / maxValue) * 100;
  const expensePosition = (expenseValue / maxValue) * 100;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Profit & Loss</Text>
      <Text style={styles.cardSubtitle}>Monthly income vs. expenses.</Text>

      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          {yAxisLabels.map((label) => (
            <Text key={label} style={styles.yAxisLabel}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.chartArea}>
          {yAxisLabels.map((_, index) => (
            <View key={index} style={styles.dottedLine} />
          ))}

          <View
            style={[
              styles.dataPointContainer,
              { bottom: `${incomePosition}%` },
            ]}
          >
            <View style={[styles.dataPoint, { backgroundColor: "#34A853" }]} />
          </View>
          <View
            style={[
              styles.dataPointContainer,
              { bottom: `${expensePosition}%` },
            ]}
          >
            <View style={[styles.dataPoint, { backgroundColor: "#424242" }]} />
          </View>

          <Text style={styles.xAxisLabel}>Jul</Text>
        </View>
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
            style={[styles.legendColorBox, { backgroundColor: "#424242" }]}
          />
          <Text style={styles.legendText}>Expense</Text>
        </View>
      </View>
    </View>
  );
};

const RecentTransactions = () => {
  const transactionsData = [
    {
      id: 1,
      vendor: "Webflow",
      date: "2024-07-20",
      type: "expense",
      category: "Software",
      amount: 50.0,
    },
    {
      id: 2,
      vendor: "Client Project A",
      date: "2024-07-19",
      type: "income",
      category: "Client Work",
      amount: 2500.0,
    },
    {
      id: 3,
      vendor: "Amazon Web Services",
      date: "2024-07-18",
      type: "expense",
      category: "Hosting",
      amount: 125.5,
    },
    {
      id: 4,
      vendor: "Upwork",
      date: "2024-07-17",
      type: "income",
      category: "Freelance",
      amount: 750.0,
    },
    {
      id: 5,
      vendor: "Starbucks",
      date: "2024-07-16",
      type: "expense",
      category: "Meals",
      amount: 5.75,
    },
  ];

  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Recent Transactions</Text>
      <Text style={styles.cardSubtitle}>
        A list of your most recent income and expenses.
      </Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.th, { flex: 2 }]}>Vendor</Text>
        <Text style={[styles.th, { flex: 1.2 }]}>Type</Text>
        <Text style={[styles.th, { flex: 1.5 }]}>Category</Text>
        <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Amount</Text>
      </View>
      {transactionsData.map((item) => (
        <View key={item.id} style={styles.tableRow}>
          <View style={{ flex: 2 }}>
            <Text style={styles.tdVendor}>{item.vendor}</Text>
            <Text style={styles.tdDate}>{item.date}</Text>
          </View>
          <View style={{ flex: 1.2, alignItems: "flex-start" }}>
            <View
              style={[
                styles.typePill,
                item.type === "income" ? styles.incomePill : styles.expensePill,
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
    </View>
  );
};

const SpendingByCategory = () => {
  const data = [
    { label: "Hosting", percentage: 95, color: "#4285F4" },
    { label: "Software", percentage: 95, color: "#4285F4" },
    { label: "Office Supplies", percentage: 65, color: "#4285F4" },
    { label: "Meals", percentage: 15, color: "#4285F4" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Spending by Category</Text>
      <Text style={styles.cardSubtitle}>Breakdown of your expenses.</Text>
      <View style={styles.barChartContainer}>
        {data.map((item) => (
          <View key={item.label} style={styles.barRow}>
            <Text style={styles.barLabel}>{item.label}</Text>
            <View style={styles.barBackground}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  scrollContainer: {
    padding: 16,
  },
  welcomeBox: {
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  subHeader: {
    fontSize: 16,
    color: "#6A6A6A",
    marginTop: 4,
  },
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
  statLabel: {
    fontSize: 13,
    color: "#6A6A6A",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 4,
    marginBottom: 6,
  },
  statChange: {
    fontSize: 12,
    fontWeight: "500",
  },
  iconContainer: {
    backgroundColor: "#F0F4F8",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6A6A6A",
  },
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6A6A6A",
    marginTop: 2,
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: "row",
    height: 200,
  },
  yAxis: {
    justifyContent: "space-between",
    paddingRight: 10,
  },
  yAxisLabel: {
    fontSize: 12,
    color: "#6A6A6A",
  },
  chartArea: {
    flex: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EAEAEA",
    justifyContent: "space-between",
  },
  dottedLine: {
    width: "100%",
    height: 1,
    borderTopWidth: 1,
    borderColor: "#EAEAEA",
    borderStyle: "dashed",
    position: "relative",
  },
  xAxisLabel: {
    position: "absolute",
    bottom: -20,
    left: "45%",
    fontSize: 12,
    color: "#6A6A6A",
  },
  dataPointContainer: {
    position: "absolute",
    left: "48%",
    transform: [{ translateX: -4 }],
  },
  dataPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColorBox: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#6A6A6A",
  },
  barChartContainer: {
    marginTop: 10,
  },
  barRow: {
    marginBottom: 15,
  },
  barLabel: {
    fontSize: 14,
    color: "#6A6A6A",
    marginBottom: 6,
  },
  barBackground: {
    height: 20,
    backgroundColor: "#F0F4F8",
    borderRadius: 10,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 10,
  },
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
  td: {
    fontSize: 14,
    color: "#374151",
  },
  tdVendor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  tdDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  tdAmount: {
    fontWeight: "bold",
    textAlign: "right",
  },
  typePill: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  incomePill: {
    backgroundColor: "#DEF7EC",
  },
  expensePill: {
    backgroundColor: "#E0F2FE",
  },
  pillText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  incomePillText: {
    color: "#047857",
  },
  expensePillText: {
    color: "#0C4A6E",
  },
});
