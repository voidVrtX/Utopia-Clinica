import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import { useSession } from '../../context/SessionContext';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import LocationBanner from '../../components/LocationBanner';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';

const QUICK_ACTIONS: { key: string; label: string; icon: any; bg: string; screen: string }[] = [
  { key: 'agendar', label: 'Agendar\nCita', icon: 'calendar', bg: '#DCEBFF', screen: 'AgendarCita' },
  { key: 'historial', label: 'Mi\nHistorial', icon: 'time', bg: '#E4F2EE', screen: 'HistorialTab' },
  { key: 'recetas', label: 'Mis\nRecetas', icon: 'document-text', bg: '#FCEFD6', screen: 'MisRecetas' },
  { key: 'medicos', label: 'Mis\nMédicos', icon: 'people', bg: '#F3E4F8', screen: 'MisMedicos' },
];

export default function InicioScreen({ navigation }: any) {
  const { usuario } = useSession();
  const { medicos, especialidades, especialidadFiltro, setEspecialidadFiltro, cargando } = useHomeViewModel();
  const nombreCorto = usuario?.nombre?.split(' ')[0] ?? '';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.hola}>HOLA {nombreCorto.toUpperCase()}</Text>
        <Pressable onPress={() => navigation.navigate('Perfil')}>
          <Avatar nombre={usuario?.nombre ?? ''} light size={46} />
        </Pressable>
      </View>

      <LocationBanner />

      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map((qa) => (
          <Pressable key={qa.key} style={[styles.quickCard, { backgroundColor: qa.bg }]} onPress={() => navigation.navigate(qa.screen)}>
            <Ionicons name={qa.icon} size={22} color={colors.primaryDark} />
            <Text style={styles.quickLabel}>{qa.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Especialidades</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
        <Pressable
          style={[styles.chip, !especialidadFiltro && styles.chipActive]}
          onPress={() => setEspecialidadFiltro(null)}
        >
          <Text style={[styles.chipText, !especialidadFiltro && styles.chipTextActive]}>Todas</Text>
        </Pressable>
        {especialidades.map((esp) => (
          <Pressable
            key={esp}
            style={[styles.chip, especialidadFiltro === esp && styles.chipActive]}
            onPress={() => setEspecialidadFiltro(esp)}
          >
            <Text style={[styles.chipText, especialidadFiltro === esp && styles.chipTextActive]}>{esp}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Médicos Disponibles</Text>
      {cargando ? (
        <Text style={styles.muted}>Cargando médicos…</Text>
      ) : (
        medicos.map((m) => (
          <Pressable key={m.id} style={styles.medicoCard} onPress={() => navigation.navigate('MedicoIndividual', { medicoId: m.id })}>
            <Avatar nombre={m.nombre} size={48} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.medicoNombre}>{m.nombre}</Text>
              <Text style={styles.medicoEsp}>{m.especialidad}</Text>
            </View>
            <Badge estado={m.activo ? 'Activo' : 'Inactivo'} />
          </Pressable>
        ))
      )}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  hola: { color: colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  sectionTitle: { fontWeight: '800', fontSize: 15, color: colors.text, marginTop: spacing.sm, marginBottom: spacing.sm },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  quickCard: { flex: 1, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', gap: 6, minHeight: 78, justifyContent: 'center' },
  quickLabel: { fontSize: 11, fontWeight: '700', color: colors.primaryDark, textAlign: 'center' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, marginRight: 8, ...shadow },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 12.5, fontWeight: '700', color: colors.text },
  chipTextActive: { color: colors.white },
  medicoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, ...shadow },
  medicoNombre: { fontWeight: '700', fontSize: 14, color: colors.text },
  medicoEsp: { fontSize: 12, color: colors.textMuted },
  muted: { color: colors.textMuted },
});
