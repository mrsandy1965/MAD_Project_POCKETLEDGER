import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import { TransactionsProvider } from './src/context/TransactionsContext';

export default function App() {
  return (
    <TransactionsProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </TransactionsProvider>
  );
}
