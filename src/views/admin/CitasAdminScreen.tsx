import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useAdminCitasViewModel } from '../../viewmodels/useAdminViewModels';
import { formatFechaCorta } from '../../utils/helpers';

export default function CitasAdminScreen({ navigation }: any) {
  const { citas, cargando, nombreMedico, espMedico } = useAdminCitasViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Citas</Text>
      </View>
      <ResponsiveContainer style={{ width: '100%' }}>
        <View style={styles.rangoBox}>
          <Ionicons name="calendar-outline" size={14} color={colors.text} />
          <Text style={styles.rangoText}>01/06/2026 - 12/06/2026</Text>
          <Ionicons name="chevron-down" size={14} color={colors.text} />
        </View>
      </ResponsiveContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          {cargando ? (
            <Text style={styles.muted}>Cargando…</Text>
          ) : (
            <ResponsiveGrid>
              {citas.map((c) => (
                <Pressable key={c.id} style={styles.card} onPress={() => navigation.navigate('DetalleCitaAdmin', { citaId: c.id })}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nombre}>{nombreMedico(c.medicoId)}</Text>
                    <Text style={styles.sub}>{espMedico(c.medicoId)} · {formatFechaCorta(c.fechaISO)} {c.hora}</Text>
                  </View>
                  <Badge estado={c.estado} />
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={{ marginLeft: 6 }} />
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
  rangoBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, marginHorizontal: spacing.md, marginTop: spacing.md, paddingHorizontal: 12, paddingVertical: 10, borderRadius: radius.sm, ...shadow },
  rangoText: { flex: 1, fontSize: 12.5, color: colors.text },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  nombre: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 11.5 },
  muted: { color: colors.textMuted },
});
