import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import InicioAdminScreen from '../views/admin/InicioAdminScreen';
import MedicosAdminScreen from '../views/admin/MedicosAdminScreen';
import CitasAdminScreen from '../views/admin/CitasAdminScreen';
import ReportesScreen from '../views/admin/ReportesScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, any> = {
  InicioTab: 'home',
  MedicosTab: 'medkit',
  CitasTab: 'calendar',
  ReportesTab: 'bar-chart',
};

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="InicioTab" component={InicioAdminScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="MedicosTab" component={MedicosAdminScreen} options={{ title: 'Médicos' }} />
      <Tab.Screen name="CitasTab" component={CitasAdminScreen} options={{ title: 'Citas' }} />
      <Tab.Screen name="ReportesTab" component={ReportesScreen} options={{ title: 'Reportes' }} />
    </Tab.Navigator>
  );
}
