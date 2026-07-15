import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/theme';
import Badge from './Badge';
import { formatFechaCorta } from '../utils/helpers';

export default function CitaListItem({
  titulo,
  subtitulo,
  fechaISO,
  hora,
  estado,
  onPress,
  onModificar,
  onCancelar,
}: {
  titulo: string;
  subtitulo: string;
  fechaISO: string;
  hora: string;
  estado: string;
  onPress?: () => void;
  onModificar?: () => void;
  onCancelar?: () => void;
}) {
  const puedeAccionar = estado === 'Confirmada' || estado === 'Pendiente';
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.rowTop}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Badge estado={estado} />
      </View>
      <Text style={styles.sub}>{subtitulo}</Text>
      <Text style={styles.fecha}>
        {formatFechaCorta(fechaISO)} · {hora}
      </Text>
      {puedeAccionar && (onModificar || onCancelar) ? (
        <View style={styles.acciones}>
          {onModificar ? (
            <Pressable style={styles.btnOutline} onPress={onModificar}>
              <Text style={styles.btnOutlineText}>Modificar</Text>
            </Pressable>
          ) : null}
          {onCancelar ? (
            <Pressable style={styles.btnDanger} onPress={onCancelar}>
              <Text style={styles.btnDangerText}>Cancelar</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderLeftWidth: 4, borderLeftColor: colors.primary, ...shadow },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  titulo: { fontWeight: '700', fontSize: 14, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12.5, marginBottom: 2 },
  fecha: { color: colors.text, fontSize: 12, fontWeight: '600' },
  acciones: { flexDirection: 'row', gap: 8, marginTop: spacing.sm },
  btnOutline: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.primary },
  btnOutlineText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  btnDanger: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.danger },
  btnDangerText: { color: colors.danger, fontWeight: '700', fontSize: 12 },
});
