import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
// Se eliminó el escáner para cédulas: ahora se ingresan manualmente
import { useAdminMedicosViewModel } from '../../viewmodels/useAdminViewModels';
import { MedicosController } from '../../controllers/MedicosController';
import { notificationManager } from '../../services/notificationService';

export default function RegistrarMedicoScreen({ route, navigation }: any) {
  const { crearMedico } = useAdminMedicosViewModel();
  const medicoId = route?.params?.medicoId ?? null;
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [aniosExperiencia, setAniosExperiencia] = useState('');
  const [sobreElMedico, setSobreElMedico] = useState('');
  const [ubicacionAtencion, setUbicacionAtencion] = useState('');
  const [cedula, setCedula] = useState<string | null>(null);
  const [cedulaProfesional, setCedulaProfesional] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmar = async () => {
    if (!nombre.trim() || !email.trim() || !especialidad.trim()) {
      setError('Completa al menos nombre, correo y especialidad.');
      return;
    }
    if (!cedula || !cedula.trim()) {
      setError('Ingresa la cédula de identidad.');
      return;
    }
    if (!cedulaProfesional || !cedulaProfesional.trim()) {
      setError('Ingresa la cédula profesional.');
      return;
    }
    if (!password) {
      // generate one if missing
      const p = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-2);
      setPassword(p);
    }
    setError(null);
    setEnviando(true);

    const doctorData = {
      nombre,
      email,
      telefono,
      especialidad,
      institucion,
      aniosExperiencia,
      sobreElMedico,
      ubicacionAtencion,
      cedula,
      cedulaProfesional,
    };

    if (medicoId) {
      // modo edición
      await MedicosController.actualizar(medicoId, doctorData as any);
    } else {
      await crearMedico({ ...(doctorData as any), password: password ?? undefined });
    }

    // Enviar notificación
    notificationManager.notifyDoctorRegistered(
      nombre,
      `doctor_${Date.now()}`,
      email
    );
    notificationManager.notifyDocumentVerified(nombre, 'Cédula y Cédula Profesional');

    setEnviando(false);
    navigation.goBack();
  };

  useEffect(() => {
    if (!medicoId) return;
    (async () => {
      const m = await MedicosController.obtener(medicoId);
      if (!m) return;
      setNombre(m.nombre ?? '');
      setEmail(m.email ?? '');
      setTelefono(m.telefono ?? '');
      setEspecialidad(m.especialidad ?? '');
      setInstitucion(m.institucion ?? '');
      setAniosExperiencia(m.aniosExperiencia ?? '');
      setSobreElMedico(m.sobreElMedico ?? '');
      setUbicacionAtencion(m.ubicacionAtencion ?? '');
      setEditando(true);
    })();
  }, [medicoId]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Médico" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Field label="Nombre completo" value={nombre} onChangeText={setNombre} />
        <Field label="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Field label="No. Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        <Text style={styles.section}>Información profesional</Text>
        <Field label="Especialidad" value={especialidad} onChangeText={setEspecialidad} />
        <Field label="Institución" value={institucion} onChangeText={setInstitucion} />
        <Field label="Años de experiencia" value={aniosExperiencia} onChangeText={setAniosExperiencia} />
        <Field label="Sobre el médico" value={sobreElMedico} onChangeText={setSobreElMedico} multiline />
        <Field label="Ubicación de atención" value={ubicacionAtencion} onChangeText={setUbicacionAtencion} />

        <Text style={styles.section}>Documentos requeridos</Text>
        <Field label="Cédula de Identidad" value={cedula ?? ''} onChangeText={(t: string) => setCedula(t)} />
        <Field label="Cédula Profesional" value={cedulaProfesional ?? ''} onChangeText={(t: string) => setCedulaProfesional(t)} />
        <Text style={styles.section}>Cuenta</Text>
        <View style={{ marginBottom: spacing.md }}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TextInput style={[styles.input, { flex: 1 }]} value={password ?? ''} placeholder="Generada automáticamente" editable={false} />
            <Button title="Generar" onPress={() => {
              const p = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-2);
              setPassword(p);
            }} />
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Confirmar" onPress={confirmar} loading={enviando} />
      </ScrollView>
    </View>
  );
}

function Field({ label, ...rest }: any) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, rest.multiline && styles.textarea]} placeholderTextColor={colors.textMuted} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  section: { fontWeight: '800', fontSize: 13, color: colors.text, marginTop: spacing.sm, marginBottom: spacing.sm },
  label: { fontWeight: '700', fontSize: 12.5, color: colors.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12, backgroundColor: colors.white, color: colors.text },
  textarea: { minHeight: 70, textAlignVertical: 'top' },
  error: { color: colors.danger, marginBottom: spacing.sm, fontSize: 12.5 },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#E3F6EA',
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#2E9E5B',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  successText: {
    color: '#2E9E5B',
    fontWeight: '600',
    fontSize: 13,
  },
});
