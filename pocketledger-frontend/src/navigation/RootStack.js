import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import AppNavigator from './AppNavigator.js';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import InvoiceScreen from '../screens/Invoices/InvoiceScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="App" component={AppNavigator} /> 
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} />
    </Stack.Navigator>
  );
}