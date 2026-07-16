import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import WeekStrip from '../../components/WeekStrip';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { useAgendaMedicaViewModel } from '../../viewmodels/useMedicoAgendaViewModel';
import { formatFechaLarga } from '../../utils/helpers';

const FECHA_LIMITE = '2026-12-31';

export default function AgendaMedicaScreen({ navigation }: any) {
  const vm = useAgendaMedicaViewModel();
  const citasDelDia = vm.citas.filter((c) => c.fechaISO === vm.selectedDateISO);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Agenda médica" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <ResponsiveContainer maxWidth={760}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{vm.resumen.total}</Text>
              <Text style={styles.summaryLabel}>Citas</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{vm.resumen.atendidas}</Text>
              <Text style={styles.summaryLabel}>Atendidas</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{vm.resumen.pendientes}</Text>
              <Text style={styles.summaryLabel}>Pendientes</Text>
            </View>
          </View>

          <WeekStrip
            selectedISO={vm.selectedDateISO}
            onSelect={vm.setSelectedDateISO}
            mode={vm.vista}
            onModeChange={vm.setVista}
            maxDate={new Date(2026, 11, 31)}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agenda para {formatFechaLarga(vm.selectedDateISO)}</Text>
            <Text style={styles.sectionHint}>Hasta {FECHA_LIMITE}</Text>
          </View>

          {vm.cargando ? (
            <Text style={styles.muted}>Cargando agenda…</Text>
          ) : citasDelDia.length === 0 ? (
            <Text style={styles.muted}>No hay citas para esta fecha.</Text>
          ) : (
            <View style={styles.list}>
              {citasDelDia.map((cita) => (
                <Pressable key={cita.id} style={styles.item} onPress={() => navigation.navigate('DetalleCitaMedico', { citaId: cita.id })}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTime}>{cita.hora}</Text>
                    <Text style={styles.itemTitle}>{cita.especialidad}</Text>
                    <Text style={styles.itemSub}>{cita.motivo ?? 'Consulta'}</Text>
                  </View>
                  <Text style={styles.itemState}>{cita.estado}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingVertical: spacing.md, paddingBottom: spacing.xl },
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  summaryCard: { flex: 1, minWidth: 100, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, ...shadow },
  summaryValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  summaryLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  sectionHeader: { marginTop: spacing.md, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  sectionHint: { fontSize: 11.5, color: colors.textMuted, marginTop: 2 },
  list: { paddingHorizontal: spacing.md, gap: spacing.sm },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, ...shadow },
  itemTime: { fontWeight: '800', fontSize: 13, color: colors.primary },
  itemTitle: { fontWeight: '700', fontSize: 13.5, color: colors.text, marginTop: 2 },
  itemSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  itemState: { color: colors.textMuted, fontSize: 12, marginLeft: spacing.sm },
  muted: { color: colors.textMuted, paddingHorizontal: spacing.md },
});