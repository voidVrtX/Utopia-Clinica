import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../views/auth/LoginScreen';
import RegisterStep1Screen from '../views/auth/RegisterStep1Screen';
import RegisterStep2Screen from '../views/auth/RegisterStep2Screen';
import RegisterStep3Screen from '../views/auth/RegisterStep3Screen';
import RegistroDetallesScreen from '../views/paciente/RegistroDetallesScreen';
import { RegisterDraftProvider } from '../context/RegisterDraftContext';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <RegisterDraftProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterStep1" component={RegisterStep1Screen} />
        <Stack.Screen name="RegisterStep2" component={RegisterStep2Screen} />
        <Stack.Screen name="RegistroDetalles" component={RegistroDetallesScreen} />
        <Stack.Screen name="RegisterStep3" component={RegisterStep3Screen} />
      </Stack.Navigator>
    </RegisterDraftProvider>
  );
}
