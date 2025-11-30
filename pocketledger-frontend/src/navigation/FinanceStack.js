import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FinanceHomeScreen from "../screens/Finance/FinanceHomeScreen";
import ReportsScreen from "../screens/Reports/ReportsScreen";
import InvoiceScreen from "../screens/Invoices/InvoiceScreen";
import CreateInvoiceScreen from "../screens/Invoices/CreateInvoiceScreen";
import InvoiceDetailScreen from "../screens/Invoices/InvoiceDetailScreen";

const Stack = createNativeStackNavigator();

export default function FinanceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FinanceHome" component={FinanceHomeScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} />
      <Stack.Screen name="InvoiceCreate" component={CreateInvoiceScreen} />
      <Stack.Screen name="InvoiceEdit" component={CreateInvoiceScreen} />
      <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
    </Stack.Navigator>
  );
}
