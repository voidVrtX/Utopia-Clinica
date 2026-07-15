import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import WeekStrip from '../../components/WeekStrip';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useAgendaMedicaViewModel } from '../../viewmodels/useMedicoAgendaViewModel';
import { formatFechaLarga } from '../../utils/helpers';

export default function AgendaMedicaScreen({ navigation }: any) {
  const { fechaISO, setFechaISO, citas, resumen, cargando } = useAgendaMedicaViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda médica</Text>
      </View>
      <WeekStrip selectedISO={fechaISO} onSelect={setFechaISO} />
      <ResponsiveContainer style={{ width: '100%' }}>
        <View style={styles.resumenRow}>
          <ResumenPill label="Total Citas" value={resumen.total} color={colors.info} />
          <ResumenPill label="Atendidas" value={resumen.atendidas} color={colors.success} />
          <ResumenPill label="Pendientes" value={resumen.pendientes} color={colors.gold} />
        </View>
      </ResponsiveContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          <Text style={styles.fechaLarga}>Agenda del día — {formatFechaLarga(fechaISO)}</Text>
          {cargando ? (
            <Text style={styles.muted}>Cargando…</Text>
          ) : citas.length === 0 ? (
            <Text style={styles.muted}>No hay citas para este día.</Text>
          ) : (
            <ResponsiveGrid>
              {citas.map((c) => (
                <Pressable key={c.id} style={styles.row} onPress={() => navigation.navigate('DetalleCitaMedico', { citaId: c.id })}>
                  <Text style={styles.hora}>{c.hora}</Text>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.titulo}>{c.motivo ?? 'Consulta'}</Text>
                  </View>
                  <Badge estado={c.estado} />
                </Pressable>
              ))}
            </ResponsiveGrid>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

function ResumenPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.pill}>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  resumenRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.sm, backgroundColor: colors.card, marginHorizontal: spacing.md, borderRadius: radius.md, ...shadow },
  pill: { alignItems: 'center' },
  pillValue: { fontWeight: '800', fontSize: 18 },
  pillLabel: { fontSize: 10.5, color: colors.textMuted },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  fechaLarga: { fontWeight: '700', fontSize: 13, color: colors.text, marginBottom: spacing.sm, textTransform: 'capitalize' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, ...shadow },
  hora: { fontWeight: '800', color: colors.primary, fontSize: 13, width: 54 },
  titulo: { fontWeight: '600', color: colors.text, fontSize: 13 },
  muted: { color: colors.textMuted },
});
