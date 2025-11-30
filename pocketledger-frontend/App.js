import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import { AuthProvider } from './src/context/AuthContext';
import { TransactionsProvider } from './src/context/TransactionsContext';
import { InvoicesProvider } from './src/context/InvoicesContext';

export default function App() {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <InvoicesProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </InvoicesProvider>
      </TransactionsProvider>
    </AuthProvider>
  );
}
