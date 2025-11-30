import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useInvoices } from "../../context/InvoicesContext";
import { api } from "../../services/api";

export default function CreateInvoiceScreen({ navigation, route }) {
  const { token } = useAuth();
  const { createInvoice, updateInvoice } = useInvoices();
  const invoiceId = route?.params?.id;
  const [editing, setEditing] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const addEmptyItem = () => {
    setItems((prev) => [...prev, { id: Date.now().toString(), name: "", quantity: 1, price: 0 }]);
  };

  const updateItem = (id, key, value) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  };

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const handleSave = async () => {
    if (!invoiceNumber || !clientName) {
      Alert.alert("Validation", "Invoice number and client name are required");
      return;
    }
    if (items.length === 0) {
      Alert.alert('Validation', 'Please add at least one item to the invoice');
      return;
    }

    // basic per-item validation
    for (let i = 0; i < items.length; i += 1) {
      const it = items[i];
      if (!it.name || String(it.name).trim() === '') {
        Alert.alert('Validation', `Item ${i + 1} must have a name`);
        return;
      }
      if (Number(it.quantity) <= 0) {
        Alert.alert('Validation', `Item ${i + 1} must have quantity greater than 0`);
        return;
      }
      if (Number(it.price) < 0) {
        Alert.alert('Validation', `Item ${i + 1} must have a non-negative price`);
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        invoiceNumber,
        clientName,
        items: items.map((it) => ({ name: it.name, quantity: Number(it.quantity) || 0, price: Number(it.price) || 0 })),
      };

      if (editing && invoiceId) {
        await updateInvoice(invoiceId, payload);
      } else {
        await createInvoice(payload);
      }

      navigation.goBack();
    } catch (err) {
      console.warn("Save invoice failed", err.message);
      Alert.alert("Failed", err.message || "Unable to save invoice");
    } finally {
      setSaving(false);
    }
  };

  const computeTotal = () =>
    items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);

  useEffect(() => {
    const load = async () => {
      if (!invoiceId || !token) return;
      try {
        const response = await api.invoices.get(token, invoiceId);
        const payload = response.data || response;
        const inv = payload.invoice || payload;
        setInvoiceNumber(inv.invoiceNumber || "");
        setClientName(inv.clientName || "");
        setItems(
          (inv.items || []).map((it) => ({ id: it.id || Date.now().toString(), name: it.name || "", quantity: it.quantity || 1, price: it.price || 0 }))
        );
        setEditing(true);
      } catch (err) {
        console.warn('Failed to load invoice for edit', err.message);
        Alert.alert('Error', err.message || 'Unable to load invoice for editing');
      }
    };

    load();
  }, [invoiceId, token]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>New Invoice</Text>

        <TextInput
          style={styles.input}
          placeholder="Invoice Number"
          value={invoiceNumber}
          onChangeText={setInvoiceNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Client Name"
          value={clientName}
          onChangeText={setClientName}
        />

        <View style={styles.itemsHeader}>
          <Text style={styles.itemsTitle}>Items</Text>
          <TouchableOpacity style={styles.addItemBtn} onPress={addEmptyItem}>
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <TextInput
                style={[styles.input, styles.itemInput]}
                placeholder="Item name"
                value={item.name}
                onChangeText={(v) => updateItem(item.id, "name", v)}
              />
              <TextInput
                style={[styles.input, styles.itemSmall]}
                placeholder="Qty"
                keyboardType="numeric"
                value={String(item.quantity)}
                onChangeText={(v) => updateItem(item.id, "quantity", v)}
              />
              <TextInput
                style={[styles.input, styles.itemSmall]}
                placeholder="Price"
                keyboardType="numeric"
                value={String(item.price)}
                onChangeText={(v) => updateItem(item.id, "price", v)}
              />
              <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No items yet</Text>}
        />

        <View style={styles.totalPreview}>
          <Text style={styles.totalPreviewText}>Total: ${computeTotal().toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={[styles.button, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? "Saving..." : "Create Invoice"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
  container: { flex: 1, padding: 20 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  input: { backgroundColor: "#FFFFFF", padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  itemsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  itemsTitle: { fontWeight: "700" },
  addItemBtn: { padding: 8, backgroundColor: "#007AFF", borderRadius: 8 },
  addItemText: { color: "#fff" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  itemInput: { flex: 1, marginBottom: 0 },
  itemSmall: { width: 80, marginBottom: 0 },
  removeBtn: { padding: 8 },
  removeText: { color: "#B91C1C" },
  emptyText: { textAlign: "center", color: "#6B7280", marginVertical: 12 },
  button: { backgroundColor: "#007AFF", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 12 },
  buttonText: { color: "#fff", fontWeight: "700" },
});
