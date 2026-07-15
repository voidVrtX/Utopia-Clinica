import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import { useSession } from '../../context/SessionContext';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useMedicoHomeViewModel } from '../../viewmodels/useMedicoAgendaViewModel';

export default function InicioMedicoScreen({ navigation }: any) {
  const { usuario } = useSession();
  const medico = usuario as any;
  const { citasHoy, resumen, pendientesList, cargando } = useMedicoHomeViewModel();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ flexGrow: 1 }}>
      <ResponsiveContainer style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.bienvenido}>Bienvenido, {usuario?.nombre}</Text>
          <Text style={styles.especialidad}>{medico?.especialidad}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('PerfilMedico')}>
          <Avatar nombre={usuario?.nombre ?? ''} light size={44} />
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Resumen del día</Text>
      <View style={styles.resumenRow}>
        <ResumenCard label="Citas de hoy" value={resumen.citasHoy} bg="#DCEBFF" />
        <ResumenCard label="Pendientes" value={resumen.pendientes} bg="#FCEFD6" />
        <ResumenCard label="En consulta" value={resumen.enConsulta} bg="#E4F2EE" />
        <ResumenCard label="Canceladas" value={resumen.canceladas} bg="#F3E4F8" />
      </View>

      <Text style={styles.sectionTitle}>Citas pendientes</Text>
      {cargando ? (
        <Text style={styles.muted}>Cargando…</Text>
      ) : pendientesList.length === 0 ? (
        <Text style={styles.muted}>No hay citas pendientes.</Text>
      ) : (
        <ResponsiveGrid>
          {pendientesList.map((c) => (
            <Pressable key={c.id} style={styles.card} onPress={() => navigation.navigate('DetalleCitaMedico', { citaId: c.id })}>
              <Avatar nombre="Paciente" />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.pacienteNombre}>{c.motivo ?? 'Consulta'}</Text>
                <Text style={styles.pacienteSub}>{c.consultorio ?? 'Consultorio 1'} · {c.hora}</Text>
              </View>
              <Badge estado={c.estado} />
            </Pressable>
          ))}
        </ResponsiveGrid>
      )}
      <View style={{ height: 24 }} />
      </ResponsiveContainer>
    </ScrollView>
  );
}

function ResumenCard({ label, value, bg }: { label: string; value: number; bg: string }) {
  return (
    <View style={[styles.resumenCard, { backgroundColor: bg }]}>
      <Text style={styles.resumenValue}>{value}</Text>
      <Text style={styles.resumenLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  bienvenido: { color: colors.white, fontWeight: '800', fontSize: 15 },
  especialidad: { color: colors.primaryLight, fontSize: 12 },
  sectionTitle: { fontWeight: '800', fontSize: 14, color: colors.text, marginTop: spacing.sm, marginBottom: spacing.sm },
  resumenRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  resumenCard: { width: '47%', borderRadius: radius.md, padding: spacing.md },
  resumenValue: { fontWeight: '800', fontSize: 22, color: colors.primaryDark },
  resumenLabel: { fontSize: 11.5, color: colors.primaryDark, fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, ...shadow },
  pacienteNombre: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  pacienteSub: { color: colors.textMuted, fontSize: 11.5 },
  muted: { color: colors.textMuted },
});
