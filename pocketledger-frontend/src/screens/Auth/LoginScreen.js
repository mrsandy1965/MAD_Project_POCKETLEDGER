import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>PocketLedger Login</Text>
      <TouchableOpacity
        style={styles.button}
        // 👇 This line was changed to navigate to 'App' instead of 'MainTabs'
        onPress={() => navigation.replace('App')} 
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, width: '60%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});