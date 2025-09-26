// src/navigation/RootStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import AppNavigator from './AppNavigator.js'; // <-- IMPORT the new navigator
import ReportsScreen from '../screens/Reports/ReportsScreen';
import InvoiceScreen from '../screens/Invoices/InvoiceScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* USE the new AppNavigator here */}
      <Stack.Screen name="App" component={AppNavigator} /> 
      {/* These screens can be reached from within the FinanceStack now */}
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} />
    </Stack.Navigator>
  );
}