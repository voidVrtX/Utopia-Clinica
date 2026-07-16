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
import DatePickerCalendar from '../../components/DatePickerCalendar';
import { Modal } from 'react-native';

export default function HistorialMedicoScreen({ navigation }: any) {
  const { proximas, cargando } = useHistorialMedicoViewModel();
  const [rango] = useState('01/05/2026 - 31/05/2026');
  const [exportando, setExportando] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const exportar = async (formato: 'PDF' | 'Excel') => {
    setExportando(true);
    try {
      if (formato === 'PDF') {
        await ExportService.exportarCitasPDF(startDate ? { startDate, endDate } : undefined);
      } else {
        await ExportService.exportarCitasExcel(startDate ? { startDate, endDate } : undefined);
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
        <Pressable style={styles.rangoBox} onPress={() => setShowCalendar(true)}>
          <Ionicons name="calendar-outline" size={14} color={colors.text} />
          <Text style={styles.rangoText}>{startDate ? `${startDate} - ${endDate}` : rango}</Text>
        </Pressable>
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
      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12 }}>
            <DatePickerCalendar
              value={''}
              validateAdult={false}
              onChangeText={(text) => {
                const parts = text.split('/');
                if (parts.length === 3) {
                  const month = parts[1].padStart(2, '0');
                  const year = parts[2];
                  const start = `${year}-${month}-01`;
                  const endDay = new Date(Number(year), Number(month), 0).getDate();
                  const end = `${year}-${month}-${String(endDay).padStart(2, '0')}`;
                  setStartDate(start);
                  setEndDate(end);
                  setShowCalendar(false);
                }
              }}
            />
          </View>
        </View>
      </Modal>
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
