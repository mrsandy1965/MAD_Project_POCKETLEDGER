import React from 'react';import React from 'react';

import { NavigationContainer } from '@react-navigation/native';import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';import LoginScreen from '../screens/LoginScreen';

import DashboardScreen from '../screens/DashboardScreen';import DashboardScreen from '../screens/DashboardScreen';



const Stack = createNativeStackNavigator();const Stack = createNativeStackNavigator();



export default function AppNavigator() {export default function AppNavigator() {

  return (  return (

    <NavigationContainer>    <NavigationContainer>

      <Stack.Navigator initialRouteName="Login">      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen name="Login" component={LoginScreen} />        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Dashboard" component={DashboardScreen} />        <Stack.Screen name="Dashboard" component={DashboardScreen} />

      </Stack.Navigator>      </Stack.Navigator>

    </NavigationContainer>    </NavigationContainer>

  );  );

}}

