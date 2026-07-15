import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PacienteTabs from './PacienteTabs';
import AgendarCitaScreen from '../views/paciente/AgendarCitaScreen';
import MisRecetasScreen from '../views/paciente/MisRecetasScreen';
import RecetaIndividualScreen from '../views/paciente/RecetaIndividualScreen';
import MisMedicosScreen from '../views/paciente/MisMedicosScreen';
import MedicoIndividualScreen from '../views/paciente/MedicoIndividualScreen';
import DetalleCitaScreen from '../views/paciente/DetalleCitaScreen';
import ModificarCitaScreen from '../views/paciente/ModificarCitaScreen';
import ConfirmacionScreen from '../views/paciente/ConfirmacionScreen';
import PerfilScreen from '../views/shared/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function PacienteNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PacienteTabs" component={PacienteTabs} />
      <Stack.Screen name="AgendarCita" component={AgendarCitaScreen} />
      <Stack.Screen name="MisRecetas" component={MisRecetasScreen} />
      <Stack.Screen name="RecetaIndividual" component={RecetaIndividualScreen} />
      <Stack.Screen name="MisMedicos" component={MisMedicosScreen} />
      <Stack.Screen name="MedicoIndividual" component={MedicoIndividualScreen} />
      <Stack.Screen name="DetalleCita" component={DetalleCitaScreen} />
      <Stack.Screen name="ModificarCita" component={ModificarCitaScreen} />
      <Stack.Screen name="Confirmacion" component={ConfirmacionScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
    </Stack.Navigator>
  );
}
