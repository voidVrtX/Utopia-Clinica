import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import DocumentScanner from '../../components/DocumentScanner';
import { useAdminMedicosViewModel } from '../../viewmodels/useAdminViewModels';
import { notificationManager } from '../../services/notificationService';

export default function RegistrarMedicoScreen({ navigation }: any) {
  const { crearMedico } = useAdminMedicosViewModel();
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
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmar = async () => {
    if (!nombre.trim() || !email.trim() || !especialidad.trim()) {
      setError('Completa al menos nombre, correo y especialidad.');
      return;
    }
    if (!cedula) {
      setError('Debes capturar la cédula de identidad.');
      return;
    }
    if (!cedulaProfesional) {
      setError('Debes capturar la cédula profesional.');
      return;
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

    await crearMedico(doctorData as any);

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
        <DocumentScanner
          label="Cédula de Identidad"
          documentType="cedula"
          onCapture={(uri) => {
            setCedula(uri);
            notificationManager.notifyAlert('Cédula capturada', 'Se guardó la cédula de identidad correctamente.');
          }}
        />

        <DocumentScanner
          label="Cédula Profesional"
          documentType="cedula_profesional"
          onCapture={(uri) => {
            setCedulaProfesional(uri);
            notificationManager.notifyAlert('Cédula profesional capturada', 'Se guardó la cédula profesional correctamente.');
          }}
        />

        {cedula && (
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#2E9E5B" />
            <Text style={styles.successText}>Cédula de identidad capturada</Text>
          </View>
        )}

        {cedulaProfesional && (
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#2E9E5B" />
            <Text style={styles.successText}>Cédula profesional capturada</Text>
          </View>
        )}

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
