import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';

export default function ReporteDetalleScreen({ route, navigation }: any) {
  const { titulo, color } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={titulo} onBack={() => navigation.goBack()} color={color} />
      <View style={styles.rangoRow}>
        <View style={styles.rangoBox}>
          <Ionicons name="calendar-outline" size={14} color={colors.text} />
          <Text style={styles.rangoText}>01/05/2026 - 31/05/2026</Text>
        </View>
        <Pressable style={[styles.exportBtn, { backgroundColor: color }]} onPress={() => navigation.navigate('Exportacion')}>
          <Text style={styles.exportBtnText}>EXPORTAR</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.section}>Hoy</Text>
        <View style={styles.card}>
          <Text style={styles.itemTitulo}>Cita Confirmada</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.itemTitulo}>Recordatorio</Text>
        </View>
        <Text style={[styles.section, { marginTop: spacing.md }]}>Anteriores</Text>
        <View style={[styles.card, { opacity: 0.5 }]}>
          <Text style={styles.itemTitulo}>Cita Cancelada</Text>
          <Text style={styles.itemSub}>Hola</Text>
        </View>
        <View style={[styles.card, { opacity: 0.5 }]}>
          <Text style={styles.itemTitulo}>Correo Enviado</Text>
          <Text style={styles.itemSub}>Hola</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rangoRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, paddingBottom: 0 },
  rangoBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 10, borderRadius: radius.sm, ...shadow },
  rangoText: { fontSize: 12, color: colors.text },
  exportBtn: { paddingHorizontal: 14, justifyContent: 'center', borderRadius: radius.sm },
  exportBtnText: { color: colors.white, fontWeight: '800', fontSize: 11.5 },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  section: { fontWeight: '800', fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  itemTitulo: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  itemSub: { color: colors.textMuted, fontSize: 12 },
});
