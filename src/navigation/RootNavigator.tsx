import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../theme/theme';
import { useSession } from '../context/SessionContext';
import AuthNavigator from './AuthNavigator';
import PacienteNavigator from './PacienteNavigator';
import MedicoNavigator from './MedicoNavigator';
import AdminNavigator from './AdminNavigator';
import FarmaciaNavigator from './FarmaciaNavigator';
import BiometricPrompt from '../components/BiometricPrompt';

export default function RootNavigator() {
  const { cargando, usuario } = useSession();

  if (cargando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator color={colors.white} size="large" />
      </View>
    );
  }

  let RoleNavigator: React.ComponentType = AuthNavigator;
  if (usuario) {
    if (usuario.role === 'paciente') RoleNavigator = PacienteNavigator;
    else if (usuario.role === 'medico') RoleNavigator = MedicoNavigator;
    else if (usuario.role === 'admin') RoleNavigator = AdminNavigator;
    else if (usuario.role === 'farmacia') RoleNavigator = FarmaciaNavigator;
  }

  return (
    <NavigationContainer>
      <RoleNavigator />
      <BiometricPrompt />
    </NavigationContainer>
  );
}
