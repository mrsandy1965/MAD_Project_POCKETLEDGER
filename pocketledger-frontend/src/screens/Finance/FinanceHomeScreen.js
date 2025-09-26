import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function FinanceHomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isWebView = width > 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isWebView && styles.containerWeb]}>
        <Text style={styles.header}>Financial Tools</Text>
        <Text style={styles.subHeader}>Generate reports and manage invoices.</Text>
        <View style={styles.cardContainer}>
          <NavCard
            title="Reports & Analytics"
            description="Visualize your income, expenses, and financial trends."
            icon="bar-chart"
            onPress={() => navigation.navigate('Reports')}
          />
          <NavCard
            title="Invoice Management"
            description="Create, send, and track client invoices."
            icon="document-text"
            onPress={() => navigation.navigate('Invoice')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const NavCard = ({ title, description, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={28} color="#007AFF" />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <Ionicons name="arrow-forward" size={20} color="#6B7280" style={styles.arrowIcon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
  container: { flex: 1, padding: 20 },
  containerWeb: { paddingHorizontal: '10%', paddingTop: 30 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 8 },
  subHeader: { fontSize: 16, color: '#6A6A6A', marginBottom: 30 },
  cardContainer: {},
  card: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  cardDescription: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  arrowIcon: { position: 'absolute', right: 24, top: 24 },
});
