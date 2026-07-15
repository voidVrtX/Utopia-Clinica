import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import { useAvisosViewModel } from '../../viewmodels/useAvisosViewModel';
import { useSession } from '../../context/SessionContext';

const ICONS: Record<string, any> = {
  'Cita Confirmada': 'checkmark-circle',
  Recordatorio: 'alarm',
  'Cita Modificada': 'create',
  'Cita Cancelada': 'close-circle',
  'Correo Enviado': 'mail',
  'Mantenimiento programado': 'construct',
};

export default function AvisosScreen({ navigation, route }: any) {
  const { usuario } = useSession();
  const userId = route?.params?.userId ?? usuario?.id ?? 'admin';
  const { avisosHoy, avisosAnteriores, cargando, limpiarTodo } = useAvisosViewModel(userId);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avisos</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.rowTop}>
          <Text style={styles.section}>Hoy</Text>
          <Pressable onPress={limpiarTodo}>
            <Text style={styles.limpiar}>Limpiar todo</Text>
          </Pressable>
        </View>
        {cargando ? (
          <Text style={styles.muted}>Cargando…</Text>
        ) : avisosHoy.length === 0 ? (
          <Text style={styles.muted}>Sin avisos por hoy.</Text>
        ) : (
          avisosHoy.map((a) => (
            <View key={a.id} style={styles.card}>
              <Ionicons name={ICONS[a.tipo] ?? 'notifications'} size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.titulo}>{a.titulo}</Text>
                {a.detalle ? <Text style={styles.detalle}>{a.detalle}</Text> : null}
              </View>
            </View>
          ))
        )}

        {avisosAnteriores.length > 0 && (
          <>
            <Text style={[styles.section, { marginTop: spacing.md }]}>Anteriores</Text>
            {avisosAnteriores.map((a) => (
              <View key={a.id} style={[styles.card, { opacity: 0.55 }]}>
                <Ionicons name={ICONS[a.tipo] ?? 'notifications'} size={20} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.titulo}>{a.titulo}</Text>
                  {a.detalle ? <Text style={styles.detalle}>{a.detalle}</Text> : null}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  section: { fontWeight: '800', fontSize: 13, color: colors.textMuted },
  limpiar: { color: colors.primary, fontWeight: '700', fontSize: 12.5 },
  card: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  titulo: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  detalle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  muted: { color: colors.textMuted },
});
