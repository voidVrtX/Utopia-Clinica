import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import { useHistorialViewModel } from '../../viewmodels/useHistorialViewModel';
import { MedicosController } from '../../controllers/MedicosController';
import { Medico } from '../../models/User';
import Badge from '../../components/Badge';
import { formatFechaCorta } from '../../utils/helpers';

export default function HistorialScreen({ navigation }: any) {
  const { proximas, historial, cargando } = useHistorialViewModel();
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    MedicosController.listar().then(setMedicos);
  }, []);

  const nombreMedico = (id: string) => medicos.find((m) => m.id === id)?.nombre ?? 'Médico';
  const espMedico = (id: string) => medicos.find((m) => m.id === id)?.especialidad ?? '';

  const Item = ({ cita }: { cita: any }) => (
    <Pressable style={styles.item} onPress={() => navigation.navigate('DetalleCita', { citaId: cita.id })}>
      <Ionicons name="calendar" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitulo}>{formatFechaCorta(cita.fechaISO)}</Text>
        <Text style={styles.itemSub}>{cita.hora} · {nombreMedico(cita.medicoId)} · {espMedico(cita.medicoId)}</Text>
      </View>
      <Badge estado={cita.estado} />
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi historial</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.section}>Próximas citas</Text>
        {cargando ? (
          <Text style={styles.muted}>Cargando…</Text>
        ) : proximas.length === 0 ? (
          <Text style={styles.muted}>No tienes próximas citas.</Text>
        ) : (
          proximas.map((c) => <Item key={c.id} cita={c} />)
        )}

        <Text style={[styles.section, { marginTop: spacing.md }]}>Historial de citas</Text>
        {historial.length === 0 ? (
          <Text style={styles.muted}>Aún no hay historial.</Text>
        ) : (
          historial.map((c) => <Item key={c.id} cita={c} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  section: { fontWeight: '800', fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  itemTitulo: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  itemSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  muted: { color: colors.textMuted, marginBottom: spacing.sm },
});
