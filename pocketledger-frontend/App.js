import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import { AuthProvider } from './src/context/AuthContext';
import { TransactionsProvider } from './src/context/TransactionsContext';

export default function App() {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </TransactionsProvider>
    </AuthProvider>
  );
}
