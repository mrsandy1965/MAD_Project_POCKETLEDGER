import React from 'react';import React from 'react';

import AppNavigator from './src/navigation/AppNavigator';import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {import { SafeAreaView, Text } from 'react-native';

  return <AppNavigator />;

}const Stack = createNativeStackNavigator();


function LoginScreen() {
  return (
    <SafeAreaView>
      <Text>Login Screen</Text>
    </SafeAreaView>
  );
}

function DashboardScreen() {
  return (
    <SafeAreaView>
      <Text>Dashboard Screen</Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
