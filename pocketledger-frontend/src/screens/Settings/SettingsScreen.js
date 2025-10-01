import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Settings</Text>

        <SettingsGroup title="Account">
          <SettingsItem icon="person-outline" label="Edit Profile" />
          <SettingsItem icon="lock-closed-outline" label="Change Password" />
        </SettingsGroup>

        <SettingsGroup title="Preferences">
          <SettingsItem icon="color-palette-outline" label="Appearance" />
          <SettingsItem icon="notifications-outline" label="Notifications" />
          <SettingsItem icon="language-outline" label="Language" />
        </SettingsGroup>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
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

const SettingsItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#6B7280" />
    <Text style={styles.itemLabel}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
  container: { padding: 20, paddingTop: 40 },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#111827",
  },
  groupContainer: { marginBottom: 30 },
  groupTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  groupItems: { backgroundColor: "#FFFFFF", borderRadius: 16 },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemLabel: { flex: 1, marginLeft: 16, fontSize: 16, color: "#374151" },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: { color: "#DC2626", fontWeight: "bold", fontSize: 16 },
});
