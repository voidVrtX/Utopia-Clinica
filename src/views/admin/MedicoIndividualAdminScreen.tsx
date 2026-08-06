import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import { Medico } from '../../models/User';
import { MedicosController } from '../../controllers/MedicosController';
import { AvisosController } from '../../controllers/AvisosController';
import { notificationManager } from '../../services/notificationService';

export default function MedicoIndividualAdminScreen({ route, navigation }: any) {
  const { medicoId } = route.params;
  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(false);

  const cargar = () => MedicosController.obtener(medicoId).then(setMedico);
  useEffect(() => {
    cargar();
  }, [medicoId]);

  if (!medico) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  const confirmAction = async (message: string) => {
    if (Platform.OS === 'web') {
      return window.confirm(message);
    }

    return new Promise<boolean>((resolve) => {
      Alert.alert('Confirmar', message, [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Aceptar', style: 'default', onPress: () => resolve(true) },
      ]);
    });
  };

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      return;
    }
    notificationManager.notifyAlert(title, message);
  };

  const confirmarToggleActivo = async () => {
    const action = medico.activo ? 'Desactivar' : 'Activar';
    const confirmed = await confirmAction(`¿Deseas ${action.toLowerCase()} al Dr. ${medico.nombre}?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await MedicosController.establecerActivo(medico.id, !medico.activo);
      cargar();
      if (medico.activo) {
        await AvisosController.crear({
          paraUserId: 'admin',
          tipo: 'Recordatorio',
          titulo: 'Aviso amarillo',
          detalle: `El Dr. ${medico.nombre} ha sido desactivado.`,
          fechaISO: new Date().toISOString().slice(0, 10),
        });
        showMessage('Aviso amarillo', `El Dr. ${medico.nombre} ha sido desactivado.`);
      } else {
        showMessage('Médico activado', `El Dr. ${medico.nombre} ha sido activado de nuevo.`);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'No se pudo actualizar el estado del médico. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminar = async () => {
    const confirmed = await confirmAction(`¿Estás seguro que deseas eliminar al Dr. ${medico.nombre}?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await MedicosController.eliminar(medico.id);
      await AvisosController.crear({
        paraUserId: 'admin',
        tipo: 'Recordatorio',
        titulo: 'Aviso rojo',
        detalle: `El Dr. ${medico.nombre} ha sido dado de baja del sistema.`,
        fechaISO: new Date().toISOString().slice(0, 10),
      });
      showMessage('Aviso rojo', `El Dr. ${medico.nombre} ha sido dado de baja del sistema.`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'No se pudo eliminar el médico. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
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
        <View style={styles.buttonGroup}>
          <Button
            title="EDITAR"
            variant="outline"
            onPress={() => navigation.navigate('RegistrarMedico', { medicoId: medico.id })}
            style={{ width: '100%' }}
            disabled={loading}
          />
        </View>
        <View style={styles.buttonGroup}>
          <Button
            title={medico.activo ? 'DESACTIVAR' : 'ACTIVAR'}
            variant={medico.activo ? 'warning' : 'primary'}
            onPress={confirmarToggleActivo}
            style={{ width: '100%' }}
            loading={loading}
            disabled={loading}
          />
        </View>
        <View style={styles.buttonGroup}>
          <Button
            title="ELIMINAR"
            variant="danger"
            onPress={confirmarEliminar}
            style={{ width: '100%' }}
            loading={loading}
            disabled={loading}
          />
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
  buttonGroup: { marginBottom: spacing.sm },
});
