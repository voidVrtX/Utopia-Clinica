import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminTabs from './AdminTabs';
import RegistrarMedicoScreen from '../views/admin/RegistrarMedicoScreen';
import MedicoIndividualAdminScreen from '../views/admin/MedicoIndividualAdminScreen';
import DetalleCitaAdminScreen from '../views/admin/DetalleCitaAdminScreen';
import ReporteDetalleScreen from '../views/admin/ReporteDetalleScreen';
import AvisoGeneralAdminScreen from '../views/admin/AvisoGeneralAdminScreen';
import AvisosScreen from '../views/shared/AvisosScreen';
import PerfilScreen from '../views/shared/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="RegistrarMedico" component={RegistrarMedicoScreen} />
      <Stack.Screen name="MedicoIndividualAdmin" component={MedicoIndividualAdminScreen} />
      <Stack.Screen name="DetalleCitaAdmin" component={DetalleCitaAdminScreen} />
      <Stack.Screen name="ReporteDetalle" component={ReporteDetalleScreen} />
      <Stack.Screen name="AvisoGeneral" component={AvisoGeneralAdminScreen} />
      <Stack.Screen name="AvisosAdmin" component={AvisosScreen} initialParams={{ userId: 'admin' }} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
    </Stack.Navigator>
  );
}
