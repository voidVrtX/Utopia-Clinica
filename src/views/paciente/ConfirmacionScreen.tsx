import React from 'react';
import { StatusBar } from 'react-native';
import { colors } from '../../theme/theme';
import ConfirmacionCard from '../../components/ConfirmacionCard';
import { useSession } from '../../context/SessionContext';

const CONFIG: Record<string, { color: string; titulo: string; mensaje: string }> = {
  agendada: { color: colors.primary, titulo: 'Confirmación', mensaje: '¡Cita registrada correctamente!' },
  modificada: { color: colors.gold, titulo: 'Confirmación de modificación', mensaje: '¡SE MODIFICARÁ TU CITA!' },
  cancelada: { color: colors.danger, titulo: 'Confirmación de cancelación', mensaje: '¡SE CANCELARÁ TU CITA!' },
};

export default function ConfirmacionScreen({ route, navigation }: any) {
  const { tipo } = route.params;
  const { usuario } = useSession();
  const cfg = CONFIG[tipo] ?? CONFIG.agendada;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ConfirmacionCard
        color={cfg.color}
        titulo={cfg.titulo}
        mensaje={cfg.mensaje}
        email={usuario?.email ?? ''}
        onAceptar={() => navigation.navigate('PacienteTabs', { screen: 'InicioTab' })}
      />
    </>
  );
}
