import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import { useSession } from '../../context/SessionContext';
import Avatar from '../../components/Avatar';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useAdminHomeViewModel } from '../../viewmodels/useAdminHomeViewModel';
import { formatFechaCorta } from '../../utils/helpers';

export default function InicioAdminScreen({ navigation }: any) {
  const { usuario } = useSession();
  const { totalMedicos, totalCitas, confirmadas, pendientes, canceladas, avisos, cargando } = useAdminHomeViewModel();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ flexGrow: 1 }}>
      <ResponsiveContainer style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.bienvenido}>Bienvenido, Administrador</Text>
          <Text style={styles.sub}>Panel de control</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Perfil')}>
          <Avatar nombre={usuario?.nombre ?? ''} light size={44} />
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Resumen del día</Text>
      <View style={styles.resumenRow}>
        <ResumenCard label="Médicos" value={totalMedicos} bg="#DCEBFF" />
        <ResumenCard label="Pendientes" value={pendientes} bg="#FCEFD6" />
        <ResumenCard label="Citas hoy" value={totalCitas} bg="#E4F2EE" />
        <ResumenCard label="Canceladas" value={canceladas} bg="#F3E4F8" />
      </View>

      <Text style={styles.sectionTitle}>Citas hoy</Text>
      <View style={styles.card}>
        <Row label="Confirmadas" value={confirmadas} />
        <Row label="Pendientes" value={pendientes} />
        <Row label="Canceladas" value={canceladas} />
      </View>

      <View style={styles.rowTop}>
        <Text style={styles.sectionTitle}>Avisos importantes</Text>
        <Pressable onPress={() => navigation.navigate('AvisosAdmin')}>
          <Text style={styles.verTodos}>Ver todos</Text>
        </Pressable>
      </View>
      {cargando ? (
        <Text style={styles.muted}>Cargando…</Text>
      ) : (
        <ResponsiveGrid>
          {avisos.map((a) => (
            <View key={a.id} style={styles.avisoCard}>
              <Ionicons name="construct" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.avisoTitulo}>{a.titulo}</Text>
                <Text style={styles.avisoSub}>{formatFechaCorta(a.fechaISO)} {a.hora ?? ''}</Text>
              </View>
            </View>
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

function Row({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.rowItem}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  bienvenido: { color: colors.white, fontWeight: '800', fontSize: 15 },
  sub: { color: colors.primaryLight, fontSize: 12 },
  sectionTitle: { fontWeight: '800', fontSize: 14, color: colors.text, marginTop: spacing.sm, marginBottom: spacing.sm },
  resumenRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  resumenCard: { width: '47%', borderRadius: radius.md, padding: spacing.md },
  resumenValue: { fontWeight: '800', fontSize: 22, color: colors.primaryDark },
  resumenLabel: { fontSize: 11.5, color: colors.primaryDark, fontWeight: '600' },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rowLabel: { color: colors.textMuted, fontSize: 13 },
  rowValue: { color: colors.text, fontWeight: '700', fontSize: 13 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verTodos: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  avisoCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  avisoTitulo: { fontWeight: '700', fontSize: 13, color: colors.text },
  avisoSub: { color: colors.textMuted, fontSize: 11.5 },
  muted: { color: colors.textMuted },
});
