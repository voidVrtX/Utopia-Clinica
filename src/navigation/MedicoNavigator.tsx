import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MedicoTabs from './MedicoTabs';
import DetalleCitaMedicoScreen from '../views/medico/DetalleCitaMedicoScreen';
import CrearRecetaScreen from '../views/medico/CrearRecetaScreen';
import PerfilScreen from '../views/shared/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function MedicoNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MedicoTabs" component={MedicoTabs} />
      <Stack.Screen name="DetalleCitaMedico" component={DetalleCitaMedicoScreen} />
      <Stack.Screen name="CrearReceta" component={CrearRecetaScreen} />
      <Stack.Screen name="PerfilMedico" component={PerfilScreen} />
    </Stack.Navigator>
  );
}
