import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';
import InicioMedicoScreen from '../views/medico/InicioMedicoScreen';
import AgendaMedicaScreen from '../views/medico/AgendaMedicaScreen';
import PacientesDelDiaScreen from '../views/medico/PacientesDelDiaScreen';
import HistorialMedicoScreen from '../views/medico/HistorialMedicoScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, any> = {
  InicioTab: 'home',
  AgendaTab: 'calendar',
  PacienteTab: 'people',
  HistorialTab: 'time',
};

export default function MedicoTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="InicioTab" component={InicioMedicoScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="AgendaTab" component={AgendaMedicaScreen} options={{ title: 'Agenda' }} />
      <Tab.Screen name="PacienteTab" component={PacientesDelDiaScreen} options={{ title: 'Paciente' }} />
      <Tab.Screen name="HistorialTab" component={HistorialMedicoScreen} options={{ title: 'Historial' }} />
    </Tab.Navigator>
  );
}
