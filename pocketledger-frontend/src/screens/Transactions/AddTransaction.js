import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionsContext } from '../../context/TransactionsContext';

export default function AddTransactionScreen({ navigation }) {
  const { addTransaction } = useContext(TransactionsContext);
  const [type, setType] = useState('expense'); // 'income' or 'expense'
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSave = () => {
    if (!vendor || !amount || !category) {
      alert('Please fill all fields.');
      return;
    }
    const newTransaction = {
      id: Date.now(),
      vendor,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    addTransaction(newTransaction);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Add Transaction</Text>

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="Vendor or Description" value={vendor} onChangeText={setVendor} />
        <TextInput style={styles.input} placeholder="Category (e.g., Software, Meals)" value={category} onChangeText={setCategory} />
        <TextInput style={styles.input} placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
    container: { flex: 1, padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20 },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    typeSelector: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 10, padding: 4, marginBottom: 20 },
    typeButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
    typeButtonActive: { backgroundColor: '#FFFFFF', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 },
    typeButtonText: { fontWeight: '600', color: '#4B5563' },
    typeButtonTextActive: { color: '#007AFF' },
    input: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { backgroundColor: 'transparent' },
    cancelButtonText: { color: '#6B7280', fontWeight: 'bold', fontSize: 16 },
});
