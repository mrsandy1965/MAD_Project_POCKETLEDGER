import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsScreen({ navigation }) {
    const { width } = useWindowDimensions();
    const isWebView = width > 768;

    return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container, isWebView && styles.containerWeb]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.header}>Reports</Text>
        <Text style={styles.subHeader}>A summary of your financial activity.</Text>
        
        {/* Placeholder for a chart */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Summary (July)</Text>
            <View style={styles.summaryChart}>
                <Text style={styles.chartPlaceholderText}>Chart will be displayed here</Text>
            </View>
        </View>

        {/* Placeholder for category breakdown */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Spending by Category</Text>
            <CategoryItem category="Software" amount={350} percentage={45} color="#3B82F6" />
            <CategoryItem category="Hosting" amount={200} percentage={25} color="#10B981" />
            <CategoryItem category="Meals" amount={150} percentage={20} color="#F97316" />
            <CategoryItem category="Other" amount={50} percentage={10} color="#6B7280" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const CategoryItem = ({ category, amount, percentage, color }) => (
    <View style={styles.categoryItem}>
        <View style={{flex: 1}}>
            <Text style={styles.categoryLabel}>{category}</Text>
            <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
        </View>
        <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.categoryPercentage}>{percentage}%</Text>
    </View>
);

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
    container: { padding: 20, },
    containerWeb: { paddingHorizontal: '10%', paddingTop: 30 },
    backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, padding: 5 },
    header: { fontSize: 32, fontWeight: 'bold', color: '#1C1C1E', textAlign: 'center', marginBottom: 8 },
    subHeader: { fontSize: 16, color: '#6A6A6A', textAlign: 'center', marginBottom: 30 },
    card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 20 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
    summaryChart: { height: 200, backgroundColor: '#F3F4F6', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    chartPlaceholderText: { color: '#9CA3AF', fontWeight: '500' },
    categoryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    categoryLabel: { fontWeight: '600' },
    categoryAmount: { fontSize: 12, color: '#6B7280' },
    progressBar: { flex: 2, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginHorizontal: 12 },
    progressFill: { height: '100%', borderRadius: 4 },
    categoryPercentage: { width: 40, textAlign: 'right', fontWeight: '600' }
});

