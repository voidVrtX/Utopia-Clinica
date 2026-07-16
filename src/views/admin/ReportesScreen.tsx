import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import DatePickerCalendar from '../../components/DatePickerCalendar';
import { Modal } from 'react-native';

const REPORTES = [
  { key: 'citas', titulo: 'Reportes de citas', sub: 'Resumen de citas agregadas', color: colors.info, icon: 'calendar' },
  { key: 'pacientes', titulo: 'Reportes de pacientes', sub: 'Información de nuevos pacientes', color: colors.success, icon: 'people' },
  { key: 'medicos', titulo: 'Reporte de médicos', sub: 'Rendimiento y consultas', color: colors.gold, icon: 'medkit' },
  { key: 'cancelaciones', titulo: 'Reporte de cancelación', sub: 'Citas canceladas', color: colors.danger, icon: 'close-circle' },
  { key: 'avisos', titulo: 'Avisos', sub: 'Avisos importantes', color: colors.purple, icon: 'notifications' },
];

export default function ReportesScreen({ navigation }: any) {
  const [rangoLabel, setRangoLabel] = React.useState('01/05/2026 - 31/05/2026');
  const [showCalendar, setShowCalendar] = React.useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reportes</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          <Pressable style={styles.rangoBox} onPress={() => setShowCalendar(true)}>
            <Ionicons name="calendar-outline" size={14} color={colors.text} />
            <Text style={styles.rangoText}>{rangoLabel}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.text} />
          </Pressable>
          <Modal visible={showCalendar} transparent animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }}>
              <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12 }}>
                <DatePickerCalendar
                  value={'01/05/2026'}
                  validateAdult={false}
                  onChangeText={(text) => {
                    // Convert selected date to month range
                    const parts = text.split('/');
                    if (parts.length === 3) {
                      const day = parts[0];
                      const month = parts[1];
                      const year = parts[2];
                      const start = `01/${month}/${year}`;
                      const end = new Date(Number(year), Number(month), 0).getDate();
                      const endLabel = `${String(end).padStart(2, '0')}/${month}/${year}`;
                      setRangoLabel(`${start} - ${endLabel}`);
                      setShowCalendar(false);
                    }
                  }}
                />
              </View>
            </View>
          </Modal>
          <Pressable style={styles.avisoGeneralBtn} onPress={() => navigation.navigate('AvisoGeneral')}>
            <Ionicons name="megaphone" size={18} color={colors.white} />
            <Text style={styles.avisoGeneralText}>Enviar aviso general</Text>
          </Pressable>
          <ResponsiveGrid>
            {REPORTES.map((r) => (
              <Pressable
                key={r.key}
                style={styles.card}
                onPress={() =>
                  r.key === 'avisos'
                    ? navigation.navigate('AvisosAdmin')
                    : navigation.navigate('ReporteDetalle', { tipo: r.key, titulo: r.titulo, color: r.color })
                }
              >
                <Ionicons name={r.icon as any} size={22} color={r.color} style={{ marginRight: spacing.sm }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.titulo}>{r.titulo}</Text>
                  <Text style={styles.sub}>{r.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  rangoBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 10, borderRadius: radius.sm, marginBottom: spacing.md, ...shadow },
  rangoText: { flex: 1, fontSize: 12.5, color: colors.text },
  avisoGeneralBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.purple, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.md },
  avisoGeneralText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  titulo: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 11.5 },
});
