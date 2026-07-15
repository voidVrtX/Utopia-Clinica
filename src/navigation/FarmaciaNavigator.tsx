import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioFarmaciaScreen from '../views/farmacia/InicioFarmaciaScreen';
import EscanearRecetaScreen from '../views/farmacia/EscanearRecetaScreen';
import ConfirmarInvalidacionScreen from '../views/farmacia/ConfirmarInvalidacionScreen';

const Stack = createNativeStackNavigator();

export default function FarmaciaNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FarmaciaInicio" component={InicioFarmaciaScreen} />
      <Stack.Screen name="EscanearReceta" component={EscanearRecetaScreen} />
      <Stack.Screen name="ConfirmarInvalidacion" component={ConfirmarInvalidacionScreen} />
    </Stack.Navigator>
  );
}
