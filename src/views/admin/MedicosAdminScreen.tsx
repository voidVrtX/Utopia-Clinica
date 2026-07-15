import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useAdminMedicosViewModel } from '../../viewmodels/useAdminViewModels';

export default function MedicosAdminScreen({ navigation }: any) {
  const { medicos, query, setQuery, cargando } = useAdminMedicosViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Médicos</Text>
        <Pressable onPress={() => navigation.navigate('RegistrarMedico')}>
          <Text style={styles.nuevo}>Nuevo</Text>
        </Pressable>
      </View>
      <ResponsiveContainer style={{ width: '100%' }}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Buscar médico" placeholderTextColor={colors.textMuted} value={query} onChangeText={setQuery} />
        </View>
      </ResponsiveContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          {cargando ? (
            <Text style={styles.muted}>Cargando…</Text>
          ) : (
            <ResponsiveGrid>
              {medicos.map((m) => (
                <Pressable key={m.id} style={styles.card} onPress={() => navigation.navigate('MedicoIndividualAdmin', { medicoId: m.id })}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nombre}>{m.nombre}</Text>
                    <Text style={styles.sub}>{m.especialidad}</Text>
                  </View>
                  <Badge estado={m.activo ? 'Activo' : 'Inactivo'} />
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
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18 },
  nuevo: { color: colors.white, fontWeight: '700', fontSize: 13 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, marginHorizontal: spacing.md, marginTop: spacing.md, paddingHorizontal: 12, borderRadius: radius.sm, gap: 8, ...shadow },
  searchInput: { flex: 1, paddingVertical: 10, color: colors.text },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  nombre: { fontWeight: '700', fontSize: 14, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12 },
  muted: { color: colors.textMuted },
});
