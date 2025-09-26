import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionList from '../screens/Transactions/TransactionList';
import AddTransactionScreen from '../screens/Transactions/AddTransaction';

const Stack = createNativeStackNavigator();

export default function TransactionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionList" component={TransactionList} />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen} 
        options={{ presentation: 'modal' }} // Opens the screen as a modal
      />
    </Stack.Navigator>
  );
}
