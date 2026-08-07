import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useMedicoPacienteDetalleViewModel } from '../../viewmodels/useMedicoPacientesViewModel';
import { formatFechaCorta } from '../../utils/helpers';

export default function PacienteDetalleMedicoScreen({ route, navigation }: any) {
  const { pacienteId } = route.params;
  const { paciente, citasCompletadas, cargando } = useMedicoPacienteDetalleViewModel(pacienteId);

  if (cargando) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  if (!paciente) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ margin: spacing.md, color: colors.textMuted }}>Paciente no encontrado.</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Detalle del paciente" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          <View style={styles.headerRow}>
            <Avatar nombre={paciente.nombre} size={64} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.nombre}>{paciente.nombre}</Text>
              <Text style={styles.sub}>{paciente.email}</Text>
              <Text style={styles.sub}>{paciente.telefono ?? 'Teléfono no registrado'}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Información personal</Text>
            <Row label="Fecha de nacimiento" value={paciente.fechaNacimiento ?? '—'} />
            <Row label="Género" value={paciente.sexo ?? '—'} />
            <Row label="Dirección" value={paciente.direccion ?? '—'} />
            <Row label="Seguro médico" value={paciente.seguroMedico ?? '—'} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Historial de citas completadas</Text>
            {citasCompletadas.length === 0 ? (
              <Text style={styles.muted}>Aún no hay citas completadas.</Text>
            ) : (
              <ResponsiveGrid>
                {citasCompletadas.map((c) => (
                  <View key={c.id} style={styles.historiaCard}>
                    <View style={styles.historiaHeader}>
                      <Text style={styles.historiaFecha}>{formatFechaCorta(c.fechaISO)}</Text>
                      <Badge estado={c.estado} />
                    </View>
                    <Text style={styles.historiaLinea}>Hora: {c.hora}</Text>
                    <Text style={styles.historiaLinea}>Especialidad: {c.especialidad}</Text>
                    <Text style={styles.historiaLinea}>Motivo: {c.motivo ?? '—'}</Text>
                  </View>
                ))}
              </ResponsiveGrid>
            )}
          </View>
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.rowItem}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  nombre: { fontWeight: '800', fontSize: 17, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12 },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  cardTitle: { fontWeight: '800', fontSize: 13, color: colors.text, marginBottom: spacing.sm },
  rowItem: { marginBottom: spacing.sm },
  rowLabel: { color: colors.textMuted, fontSize: 11.5, marginBottom: 2 },
  rowValue: { color: colors.text, fontSize: 13.5, fontWeight: '600' },
  muted: { color: colors.textMuted },
  historiaCard: { backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  historiaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  historiaFecha: { fontWeight: '700', color: colors.text },
  historiaLinea: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
