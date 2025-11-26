import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useTransactions } from "../../context/TransactionsContext";
import { getApiBaseUrl } from "../../services/api";

export default function SettingsScreen() {
  const { user, logout, authLoading, updateProfile, changePassword } = useAuth();
  const { transactions, stats } = useTransactions();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const apiBase = getApiBaseUrl();

  const totals = useMemo(
    () => ({
      transactions: transactions.length,
      income: stats?.totalIncome || 0,
      expenses: stats?.totalExpenses || 0,
    }),
    [transactions.length, stats]
  );

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const setStatus = (message, type = "success") => {
    setStatusMessage(message);
    setStatusType(type);
    if (message) {
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  const handleProfileSave = async () => {
    if (!name.trim() || !email.trim()) {
      setStatus("Name and email are required", "error");
      return;
    }
    setSavingProfile(true);
    setStatus("");
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setStatus("Profile updated successfully");
    } catch (err) {
      setStatus(err.message || "Unable to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus("Please fill all password fields", "error");
      return;
    }
    if (newPassword.length < 8) {
      setStatus("New password must be at least 8 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("New password and confirmation do not match", "error");
      return;
    }

    setChangingPassword(true);
    setStatus("");
    try {
      await changePassword({ currentPassword, newPassword });
      setStatus("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatus(err.message || "Unable to change password", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  const openSupport = () => Linking.openURL("mailto:support@pocketledger.app");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Settings</Text>

        {user && (
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {user.name?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.profileMeta}>API: {apiBase}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text style={styles.badgeText}>Secure</Text>
            </View>
          </View>
        )}

        <View style={styles.metricsRow}>
          <MetricCard label="Transactions" value={totals.transactions} icon="swap-vertical" />
          <MetricCard label="Income (7d)" value={`$${totals.income.toFixed(0)}`} icon="trending-up" highlight />
          <MetricCard label="Expenses (7d)" value={`$${totals.expenses.toFixed(0)}`} icon="trending-down" />
        </View>

        <SettingsGroup title="Profile">
          <OutlinedInput
            icon="person-outline"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <OutlinedInput
            icon="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <PrimaryButton
            label={savingProfile ? "Saving..." : "Save Profile"}
            onPress={handleProfileSave}
            disabled={savingProfile}
          />
        </SettingsGroup>

        <SettingsGroup title="Preferences">
          <SettingsToggle
            icon="notifications-outline"
            label="Push Notifications"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            helper="Receive reminders for bills, reports, and invoices."
          />
          <SettingsToggle
            icon="moon-outline"
            label="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
            helper="Automatically adapt to your system appearance."
          />
        </SettingsGroup>

        <SettingsGroup title="Security">
          <OutlinedInput
            icon="lock-closed-outline"
            placeholder="Current Password"
            value={currentPassword}
            secureTextEntry
            onChangeText={setCurrentPassword}
          />
          <OutlinedInput
            icon="key-outline"
            placeholder="New Password"
            value={newPassword}
            secureTextEntry
            onChangeText={setNewPassword}
          />
          <OutlinedInput
            icon="checkmark-done-outline"
            placeholder="Confirm New Password"
            value={confirmPassword}
            secureTextEntry
            onChangeText={setConfirmPassword}
          />
          <SecondaryButton
            label={changingPassword ? "Updating..." : "Change Password"}
            onPress={handlePasswordChange}
            disabled={changingPassword}
          />
        </SettingsGroup>

        <SettingsGroup title="Support">
          <ActionRow
            icon="help-circle-outline"
            title="Need help?"
            subtitle="Reach out to our support team"
            onPress={openSupport}
          />
          <ActionRow
            icon="document-text-outline"
            title="Terms & Privacy"
            subtitle="Read how we manage your data"
            onPress={() => Linking.openURL("https://pocketledger.app/privacy")}
          />
        </SettingsGroup>

        {!!statusMessage && (
          <View
            style={[
              styles.statusBanner,
              statusType === "error" ? styles.statusError : styles.statusSuccess,
            ]}
          >
            <Text style={styles.statusBannerText}>{statusMessage}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.logoutButton, authLoading && { opacity: 0.6 }]}
          onPress={logout}
          disabled={authLoading}
        >
          <Text style={styles.logoutButtonText}>
            {authLoading ? "Logging out..." : "Log Out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const SettingsGroup = ({ title, children }) => (
  <View style={styles.groupContainer}>
    <Text style={styles.groupTitle}>{title}</Text>
    <View style={styles.groupItems}>{children}</View>
  </View>
);

const OutlinedInput = ({ icon, ...props }) => (
  <View style={styles.inputWrapper}>
    <Ionicons name={icon} size={18} color="#6B7280" style={{ marginRight: 8 }} />
    <TextInput style={styles.input} placeholderTextColor="#9CA3AF" {...props} />
  </View>
);

const SettingsToggle = ({ icon, label, helper, value, onValueChange }) => (
  <View style={styles.toggleItem}>
    <View style={styles.toggleIconContainer}>
      <Ionicons name={icon} size={20} color="#2563EB" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.toggleLabel}>{label}</Text>
      {!!helper && <Text style={styles.toggleHint}>{helper}</Text>}
    </View>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const ActionRow = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.actionRow} onPress={onPress}>
    <View style={styles.actionIcon}>
      <Ionicons name={icon} size={18} color="#1F2937" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
  </TouchableOpacity>
);

const MetricCard = ({ label, value, icon, highlight }) => (
  <View style={[styles.metricCard, highlight && styles.metricCardHighlight]}>
    <View style={styles.metricIcon}>
      <Ionicons name={icon} size={18} color={highlight ? "#F59E0B" : "#2563EB"} />
    </View>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const PrimaryButton = ({ label, ...props }) => (
  <TouchableOpacity style={styles.primaryButton} {...props}>
    <Text style={styles.primaryButtonText}>{label}</Text>
  </TouchableOpacity>
);

const SecondaryButton = ({ label, ...props }) => (
  <TouchableOpacity style={styles.secondaryButton} {...props}>
    <Text style={styles.secondaryButtonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F1F5F9" },
  container: { padding: 20, paddingTop: 32 },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#0F172A",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileAvatarText: { fontSize: 20, fontWeight: "700", color: "#0C4A6E" },
  profileName: { fontSize: 20, fontWeight: "bold", color: "#0F172A" },
  profileEmail: { color: "#6B7280", marginTop: 2 },
  profileMeta: { color: "#94A3B8", marginTop: 2, fontSize: 12 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4,
  },
  badgeText: { fontWeight: "600", color: "#15803D" },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderBottomWidth: 3,
    borderBottomColor: "#E5E7EB",
  },
  metricCardHighlight: {
    borderBottomColor: "#FBBF24",
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  metricLabel: { fontSize: 12, color: "#94A3B8" },
  metricValue: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  groupContainer: { marginBottom: 24 },
  groupTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  groupItems: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0F172A",
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  toggleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleLabel: { fontSize: 15, fontWeight: "600", color: "#111827" },
  toggleHint: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  actionTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  actionSubtitle: { fontSize: 12, color: "#94A3B8" },
  primaryButton: {
    backgroundColor: "#2563EB",
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "700" },
  secondaryButton: {
    borderColor: "#2563EB",
    borderWidth: 1,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#2563EB", fontWeight: "700" },
  statusBanner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  statusSuccess: { backgroundColor: "#DCFCE7" },
  statusError: { backgroundColor: "#FEE2E2" },
  statusBannerText: { fontWeight: "600", color: "#134E4A" },
  logoutButton: {
    backgroundColor: "#1F2937",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  logoutButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});
