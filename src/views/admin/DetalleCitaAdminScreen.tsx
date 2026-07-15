import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import { Cita } from '../../models/Cita';
import { CitasController } from '../../controllers/CitasController';
import { Medico } from '../../models/User';
import { MedicosController } from '../../controllers/MedicosController';
import { formatFechaLarga } from '../../utils/helpers';

export default function DetalleCitaAdminScreen({ route, navigation }: any) {
  const { citaId } = route.params;
  const [cita, setCita] = useState<Cita | null>(null);
  const [medico, setMedico] = useState<Medico | null>(null);

  useEffect(() => {
    CitasController.obtener(citaId).then((c) => {
      setCita(c);
      if (c) MedicosController.obtener(c.medicoId).then(setMedico);
    });
  }, [citaId]);

  if (!cita) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Detalles de la cita" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.headerRow}>
          <Avatar nombre={medico?.nombre ?? 'Médico'} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.nombre}>{medico?.nombre ?? 'Médico'}</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  nombre: { fontWeight: '700', fontSize: 15, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12.5 },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, ...shadow },
  cardTitle: { fontWeight: '800', fontSize: 13, color: colors.text, marginBottom: spacing.sm },
  line: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },
});
