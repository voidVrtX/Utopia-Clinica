import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme/theme';

const MAP: Record<string, { bg: string; fg: string }> = {
  Confirmada: { bg: colors.successBg, fg: colors.success },
  Completada: { bg: colors.successBg, fg: colors.success },
  Activo: { bg: colors.successBg, fg: colors.success },
  Pendiente: { bg: colors.warningBg, fg: colors.warning },
  'En sala de espera': { bg: colors.warningBg, fg: colors.warning },
  Inactivo: { bg: colors.warningBg, fg: colors.warning },
  'En consulta': { bg: colors.infoBg, fg: colors.info },
  Cancelada: { bg: colors.dangerBg, fg: colors.danger },
};

export default function Badge({ estado }: { estado: string }) {
  const c = MAP[estado] ?? { bg: colors.primaryLight, fg: colors.primary };
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{estado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '700' },
});
