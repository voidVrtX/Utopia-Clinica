import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useMedicoHomeViewModel } from '../../viewmodels/useMedicoAgendaViewModel';

export default function PacientesDelDiaScreen({ navigation }: any) {
  const { citasHoy, cargando } = useMedicoHomeViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pacientes</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          {cargando ? (
            <Text style={styles.muted}>Cargando…</Text>
          ) : citasHoy.length === 0 ? (
            <Text style={styles.muted}>No hay pacientes agendados hoy.</Text>
          ) : (
            <ResponsiveGrid>
              {citasHoy.map((c) => (
                <Pressable key={c.id} style={styles.card} onPress={() => navigation.navigate('DetalleCitaMedico', { citaId: c.id })}>
                  <Avatar nombre="Paciente" />
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.nombre}>{c.motivo ?? 'Consulta'}</Text>
                    <Text style={styles.sub}>{c.hora}</Text>
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

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  nombre: { fontWeight: '700', fontSize: 14, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12 },
  muted: { color: colors.textMuted },
});
