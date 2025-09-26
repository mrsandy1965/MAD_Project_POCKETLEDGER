import React, { useState } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ScannerScreen from '../screens/Scanner/ReceiptScanner';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import FinanceStack from './FinanceStack';
import TransactionsStack from './TransactionsStack'; // <-- IMPORT NEW STACK

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const appScreens = [
  { name: 'Dashboard', component: DashboardScreen, icon: 'grid' },
  // 👇 USE THE NEW STACK HERE
  { name: 'Transactions', component: TransactionsStack, icon: 'receipt' },
  { name: 'Finance', component: FinanceStack, icon: 'stats-chart' },
  { name: 'Scanner', component: ScannerScreen, icon: 'camera' },
];

// --- Custom Gemini-Style Drawer Component (No changes needed here) ---
const CustomDrawerContent = ({ isCollapsed, setIsCollapsed, ...props }) => {
    // ... (rest of the component is unchanged)
    const activeRouteName = props.state.routes[props.state.index].name;
    const settingsRoute = { name: 'Settings', component: SettingsScreen, icon: 'settings' };

    const renderDrawerItem = (screen, collapsed) => {
        const isActive = activeRouteName === screen.name;
        return (
        <TouchableOpacity
            key={screen.name}
            style={[
            styles.drawerItem,
            isActive && styles.drawerItemActive,
            collapsed && styles.drawerItemCollapsed,
            ]}
            onPress={() => props.navigation.navigate(screen.name)}
        >
            <Ionicons name={isActive ? screen.icon : `${screen.icon}-outline`} size={22} color={isActive ? '#FFFFFF' : '#374151'} />
            {!collapsed && <Text style={[styles.drawerLabel, isActive && styles.drawerLabelActive]}>{screen.name}</Text>}
        </TouchableOpacity>
        );
    };
    
    return (
        <View style={styles.drawerContainer}>
        <View style={[styles.drawerHeader, isCollapsed && styles.drawerHeaderCollapsed]}>
            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#111827" />
            </TouchableOpacity>
        </View>
        <DrawerContentScrollView {...props}>
            {appScreens.map(screen => renderDrawerItem(screen, isCollapsed))}
        </DrawerContentScrollView>
        <View style={styles.drawerFooter}>
            {renderDrawerItem(settingsRoute, isCollapsed)}
        </View>
        </View>
    );
};

// --- Mobile Bottom Tab Layout (Updated to use new stack) ---
const MobileNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const screenConfig = [...appScreens, { name: 'Settings', icon: 'settings' }].find(screen => screen.name === route.name);
        if (!screenConfig) return null;
        const iconName = focused ? screenConfig.icon : `${screenConfig.icon}-outline`;
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    {appScreens.map(screen => (
      <Tab.Screen key={screen.name} name={screen.name} component={screen.component} />
    ))}
     <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

// --- Main Component Deciding Layout (No changes needed here) ---
export default function AppNavigator() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const drawerWidth = isCollapsed ? 90 : 260;

    if (isDesktop) {
        return (
        <Drawer.Navigator
            drawerContent={(props) => (
            <CustomDrawerContent {...props} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            )}
            screenOptions={{
            headerShown: false,
            drawerType: 'permanent',
            drawerStyle: {
                width: drawerWidth,
                borderRightWidth: 1,
                borderRightColor: '#E5E7EB',
                transition: 'width 0.2s ease-in-out',
            },
            }}
        >
            {[...appScreens, { name: 'Settings', component: SettingsScreen }].map(screen => (
            <Drawer.Screen key={screen.name} name={screen.name} component={screen.component} />
            ))}
        </Drawer.Navigator>
        );
    } else {
        return <MobileNavigator />;
    }
}

// --- Styles for the Custom Drawer (No changes needed here) ---
const styles = StyleSheet.create({
    drawerContainer: { flex: 1, backgroundColor: '#F9FAFB' },
    drawerHeader: { paddingHorizontal: 20, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#E5E7EB' },
    drawerHeaderCollapsed: { paddingHorizontal: 0, justifyContent: 'center' },
    menuButton: { padding: 6 },
    drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 28, marginVertical: 4, marginHorizontal: 12, borderRadius: 8 },
    drawerItemActive: { backgroundColor: '#007AFF' },
    drawerItemCollapsed: { paddingHorizontal: 0, justifyContent: 'center' },
    drawerLabel: { marginLeft: 20, fontSize: 15, fontWeight: '500', color: '#374151' },
    drawerLabelActive: { color: '#FFFFFF' },
    drawerFooter: { paddingBottom: 20, borderTopWidth: 1, borderColor: '#E5E7EB' },
});
