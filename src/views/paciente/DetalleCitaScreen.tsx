import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useDetalleCitaViewModel } from '../../viewmodels/useCitasViewModel';
import { MedicosController } from '../../controllers/MedicosController';
import { Medico } from '../../models/User';
import { formatFechaLarga } from '../../utils/helpers';

export default function DetalleCitaScreen({ route, navigation }: any) {
  const { citaId } = route.params;
  const { cita, cargando, cancelar } = useDetalleCitaViewModel(citaId);
  const [medico, setMedico] = useState<Medico | null>(null);
  const [mostrarCancelar, setMostrarCancelar] = useState(false);
  const [motivoCancel, setMotivoCancel] = useState('');

  useEffect(() => {
    if (cita) MedicosController.obtener(cita.medicoId).then(setMedico);
  }, [cita]);

  if (cargando || !cita) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Detalles de la cita" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  const puedeAccionar = cita.estado === 'Confirmada' || cita.estado === 'Pendiente';

  const confirmarCancelacion = async () => {
    await cancelar(motivoCancel);
    navigation.replace('Confirmacion', { tipo: 'cancelada' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Detalles de la cita" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.headerRow}>
          <Avatar nombre={medico?.nombre ?? 'Médico'} />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={styles.nombre}>{medico?.nombre ?? 'Médico'}</Text>
            <Text style={styles.esp}>{cita.especialidad}</Text>
          </View>
          <Badge estado={cita.estado} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información de la cita</Text>
          <Text style={styles.infoLine}>{formatFechaLarga(cita.fechaISO)}</Text>
          <Text style={styles.infoLine}>{cita.hora}</Text>
          {cita.consultorio ? <Text style={styles.infoLine}>{cita.consultorio}</Text> : null}
          {cita.motivo ? <Text style={styles.infoLine}>{cita.motivo}</Text> : null}
        </View>

        {cita.notasPaciente ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notas del paciente</Text>
            <Text style={styles.infoLine}>{cita.notasPaciente}</Text>
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

        {puedeAccionar && !mostrarCancelar && (
          <View style={styles.accionesRow}>
            <Button title="MODIFICAR" variant="outline" onPress={() => navigation.navigate('ModificarCita', { citaId: cita.id })} style={{ flex: 1 }} />
            <Button title="Cancelar cita" variant="danger" onPress={() => setMostrarCancelar(true)} style={{ flex: 1 }} />
          </View>
        )}

        {mostrarCancelar && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Motivo de cancelación</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Describe brevemente el motivo para cancelar la cita…"
              placeholderTextColor={colors.textMuted}
              multiline
              value={motivoCancel}
              onChangeText={setMotivoCancel}
            />
            <Button title="Confirmar cancelación" variant="danger" onPress={confirmarCancelacion} />
            <Pressable onPress={() => setMostrarCancelar(false)} style={{ marginTop: spacing.sm, alignItems: 'center' }}>
              <Text style={{ color: colors.textMuted }}>Volver</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  nombre: { fontWeight: '700', fontSize: 15, color: colors.text },
  esp: { color: colors.textMuted, fontSize: 12.5 },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  cardTitle: { fontWeight: '800', fontSize: 13, color: colors.text, marginBottom: spacing.sm },
  infoLine: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  tagText: { color: colors.primaryDark, fontSize: 12, fontWeight: '600' },
  accionesRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  textarea: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12, minHeight: 70, textAlignVertical: 'top', color: colors.text, marginBottom: spacing.sm },
});
