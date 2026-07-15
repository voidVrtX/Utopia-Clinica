import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import InicioScreen from '../views/paciente/InicioScreen';
import MisCitasScreen from '../views/paciente/MisCitasScreen';
import HistorialScreen from '../views/paciente/HistorialScreen';
import AvisosScreen from '../views/shared/AvisosScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, any> = {
  InicioTab: 'home',
  CitasTab: 'calendar',
  HistorialTab: 'time',
  AvisosTab: 'notifications',
};

export default function PacienteTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="InicioTab" component={InicioScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="CitasTab" component={MisCitasScreen} options={{ title: 'Citas' }} />
      <Tab.Screen name="HistorialTab" component={HistorialScreen} options={{ title: 'Historial' }} />
      <Tab.Screen name="AvisosTab" component={AvisosScreen} options={{ title: 'Alertas' }} />
    </Tab.Navigator>
  );
}
