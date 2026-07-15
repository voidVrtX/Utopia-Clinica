import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useHistorialMedicoViewModel } from '../../viewmodels/useHistorialMedicoViewModel';
import { formatFechaCorta } from '../../utils/helpers';
import { ExportService } from '../../services/exportService';

export default function HistorialMedicoScreen({ navigation }: any) {
  const { proximas, cargando } = useHistorialMedicoViewModel();
  const [rango] = useState('01/05/2026 - 31/05/2026');
  const [exportando, setExportando] = useState(false);

  const exportar = async (formato: 'PDF' | 'Excel') => {
    setExportando(true);
    try {
      if (formato === 'PDF') {
        await ExportService.exportarCitasPDF();
      } else {
        await ExportService.exportarCitasExcel();
      }
    } catch {
      Alert.alert('Exportar histórico', 'No se pudo generar el archivo. Intenta de nuevo.');
    } finally {
      setExportando(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi historial</Text>
      </View>
      <ResponsiveContainer style={styles.rangoRow}>
        <View style={styles.rangoBox}>
          <Ionicons name="calendar-outline" size={14} color={colors.text} />
          <Text style={styles.rangoText}>{rango}</Text>
        </View>
        <Pressable
          style={styles.exportBtn}
          disabled={exportando}
          onPress={() =>
            Alert.alert('Exportar histórico', 'Elige el formato', [
              { text: 'PDF', onPress: () => exportar('PDF') },
              { text: 'Excel', onPress: () => exportar('Excel') },
              { text: 'Cancelar', style: 'cancel' },
            ])
          }
        >
          <Text style={styles.exportBtnText}>{exportando ? 'Generando…' : 'EXPORTAR'}</Text>
        </Pressable>
      </ResponsiveContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          <Text style={styles.section}>PRÓXIMAS CITAS</Text>
          {cargando ? (
            <Text style={styles.muted}>Cargando…</Text>
          ) : proximas.length === 0 ? (
            <Text style={styles.muted}>Sin citas próximas.</Text>
          ) : (
            <ResponsiveGrid>
              {proximas.map((c) => (
                <Pressable key={c.id} style={styles.card} onPress={() => navigation.navigate('DetalleCitaMedico', { citaId: c.id })}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nombre}>Paciente</Text>
                    <Text style={styles.sub}>{formatFechaCorta(c.fechaISO)} · {c.hora}</Text>
                    <Text style={styles.motivo}>Motivo: {c.motivo ?? '—'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
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
  rangoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  rangoBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.sm, ...shadow },
  rangoText: { fontSize: 12, color: colors.text },
  exportBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.sm },
  exportBtnText: { color: colors.white, fontWeight: '800', fontSize: 11.5 },
  body: { padding: spacing.md, paddingTop: 0, paddingBottom: spacing.xl },
  section: { fontWeight: '800', fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  nombre: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12 },
  motivo: { color: colors.text, fontSize: 12, marginTop: 2 },
  muted: { color: colors.textMuted },
});
