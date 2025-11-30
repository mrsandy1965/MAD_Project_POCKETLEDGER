import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useInvoices } from "../../context/InvoicesContext";
import { api } from "../../services/api";
import { Alert } from "react-native";

export default function InvoiceDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { token } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getInvoice, removeInvoice } = useInvoices();

  const fetchInvoice = async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const inv = await getInvoice(id);
      setInvoice(inv || null);
    } catch (err) {
      console.warn('Failed to fetch invoice', err.message);
      if (err.status === 404) {
        Alert.alert('Not found', 'Invoice not found');
      } else {
        Alert.alert('Error', err.message || 'Unable to fetch invoice');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete invoice', 'Are you sure you want to delete this invoice?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeInvoice(id);
            Alert.alert('Deleted', 'Invoice deleted successfully');
            navigation.goBack();
          } catch (err) {
            console.warn('Delete failed', err.message);
            Alert.alert('Failed', err.message || 'Unable to delete invoice');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchInvoice();
  }, [id, token]);

  if (!invoice) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.empty}>{loading ? "Loading..." : "Invoice not found"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Invoice #{invoice.invoiceNumber}</Text>
        <Text style={styles.client}>Client: {invoice.clientName}</Text>
        <Text style={styles.date}>Date: {new Date(invoice.date).toISOString().slice(0, 10)}</Text>

        <View style={styles.section}>
          {invoice.items?.map((it) => (
            <View key={it.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{it.name}</Text>
              <Text style={styles.itemQty}>{it.quantity} x ${it.price.toFixed(2)}</Text>
              <Text style={styles.itemTotal}>${(it.quantity * it.price).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${invoice.totalAmount.toFixed(2)}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={() => navigation.navigate('InvoiceEdit', { id })}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { flex: 1, backgroundColor: '#B91C1C' }]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  client: { color: "#374151", marginBottom: 4 },
  date: { color: "#6B7280", marginBottom: 12 },
  section: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 12 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  itemName: { fontWeight: "600" },
  itemQty: { color: "#6B7280" },
  itemTotal: { fontWeight: "700" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", padding: 12, backgroundColor: "#fff", borderRadius: 12 },
  totalLabel: { fontWeight: "700" },
  totalAmount: { fontSize: 16, fontWeight: "800" },
  button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontWeight: "700" },
  empty: { textAlign: "center", marginTop: 40, color: "#6B7280" },
});
