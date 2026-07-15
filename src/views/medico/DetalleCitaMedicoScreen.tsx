import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { CitasController } from '../../controllers/CitasController';
import { Cita } from '../../models/Cita';
import { formatFechaLarga } from '../../utils/helpers';

export default function DetalleCitaMedicoScreen({ route, navigation }: any) {
  const { citaId } = route.params;
  const [cita, setCita] = useState<Cita | null>(null);

  useEffect(() => {
    CitasController.obtener(citaId).then(setCita);
  }, [citaId]);

  if (!cita) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Detalles de cita" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.headerRow}>
          <Avatar nombre="Paciente" />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.nombre}>Paciente</Text>
            <Text style={styles.sub}>{cita.especialidad}</Text>
          </View>
          <Badge estado={cita.estado} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información de la cita</Text>
          <Text style={styles.line}>{formatFechaLarga(cita.fechaISO)}</Text>
          <Text style={styles.line}>{cita.hora}</Text>
          <Text style={styles.line}>{cita.consultorio ?? 'Consultorio 1'}</Text>
          <Text style={styles.line}>{cita.motivo ?? '—'}</Text>
        </View>

        {cita.notasPaciente ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notas del paciente</Text>
            <Text style={styles.line}>{cita.notasPaciente}</Text>
          </View>
        ) : null}

        {cita.historialRelevante?.length ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Historial médico relevante</Text>
            <View style={styles.tagsRow}>
              {cita.historialRelevante.map((h) => (
                <View key={h} style={styles.tag}>
                  <Text style={styles.tagText}>{h}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Button title="Generar receta" onPress={() => navigation.navigate('CrearReceta', { citaId: cita.id })} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  nombre: { fontWeight: '700', fontSize: 15, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12.5 },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  cardTitle: { fontWeight: '800', fontSize: 13, color: colors.text, marginBottom: spacing.sm },
  line: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  tagText: { color: colors.primaryDark, fontSize: 12, fontWeight: '600' },
});
