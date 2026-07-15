import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import { Medico } from '../../models/User';
import { MedicosController } from '../../controllers/MedicosController';

export default function MedicoIndividualAdminScreen({ route, navigation }: any) {
  const { medicoId } = route.params;
  const [medico, setMedico] = useState<Medico | null>(null);

  const cargar = () => MedicosController.obtener(medicoId).then(setMedico);
  useEffect(() => {
    cargar();
  }, [medicoId]);

  if (!medico) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  const eliminarDesactivar = () => {
    Alert.alert('Confirmar', `¿${medico.activo ? 'Desactivar' : 'Activar'} a ${medico.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: medico.activo ? 'Desactivar' : 'Activar',
        style: medico.activo ? 'destructive' : 'default',
        onPress: async () => {
          await MedicosController.establecerActivo(medico.id, !medico.activo);
          cargar();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Médico" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.headerRow}>
          <Avatar nombre={medico.nombre} size={56} />
          <View style={{ marginLeft: spacing.sm }}>
            <Text style={styles.nombre}>{medico.nombre}</Text>
            <Text style={styles.sub}>Tel. {medico.telefono ?? '—'}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información profesional</Text>
          <Row label="Especialidad" value={medico.especialidad} />
          <Row label="Institución" value={medico.institucion ?? '—'} />
          <Row label="Años de experiencia" value={medico.aniosExperiencia ?? '—'} />
        </View>
        {medico.sobreElMedico ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sobre el médico</Text>
            <Text style={styles.text}>{medico.sobreElMedico}</Text>
          </View>
        ) : null}
        <View style={styles.accionesRow}>
          <Button title="EDITAR" variant="outline" onPress={() => Alert.alert('Editar', 'Formulario de edición próximamente.')} style={{ flex: 1 }} />
          <Button title={medico.activo ? 'ELIMINAR/DESACTIVAR' : 'ACTIVAR'} variant="danger" onPress={eliminarDesactivar} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={{ color: colors.textMuted, fontSize: 12.5 }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 12.5, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  nombre: { fontWeight: '800', fontSize: 16, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12 },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  cardTitle: { fontWeight: '800', fontSize: 13, color: colors.text, marginBottom: spacing.sm },
  text: { color: colors.textMuted, fontSize: 12.5, lineHeight: 18 },
  accionesRow: { flexDirection: 'row', gap: spacing.sm },
});
