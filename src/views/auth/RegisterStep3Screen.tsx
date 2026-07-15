import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { useRegisterDraft } from '../../context/RegisterDraftContext';
import { useSession } from '../../context/SessionContext';
import { AuthController } from '../../controllers/AuthController';

export default function RegisterStep3Screen({ navigation }: any) {
  const { draft, update, reset } = useRegisterDraft();
  const { registrarPacienteExitoso } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [correoDuplicado, setCorreoDuplicado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const terminar = async () => {
    if (!draft.contactoNombre.trim() || !draft.contactoParentesco.trim() || !draft.contactoTelefono.trim()) {
      setError('Completa el contacto de emergencia.');
      return;
    }
    setError(null);
    setCorreoDuplicado(false);
    setCargando(true);
    const res = await AuthController.registrarPaciente({
      email: draft.email,
      password: draft.password,
      nombre: draft.nombre,
      apellidoPaterno: draft.apellidoPaterno,
      apellidoMaterno: draft.apellidoMaterno,
      sexo: draft.sexo as any,
      fechaNacimiento: draft.fechaNacimiento,
      telefono: draft.telefono,
      direccion: draft.direccion || undefined,
      seguroMedico: draft.seguroMedico || undefined,
      tipoSangre: draft.tipoSangre || undefined,
      alergias: draft.alergias.length ? draft.alergias : undefined,
      contactoEmergencia: {
        nombreCompleto: draft.contactoNombre,
        parentesco: draft.contactoParentesco,
        telefono: draft.contactoTelefono,
      },
    });
    setCargando(false);
    if (!res.user) {
      setError(res.error ?? 'No se pudo completar el registro.');
      setCorreoDuplicado(res.error === 'Ese correo ya está registrado.');
      return;
    }
    reset();
    registrarPacienteExitoso(res.user);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.headerBg}>
        <Ionicons name="arrow-back" size={22} color={colors.white} onPress={() => navigation.goBack()} style={styles.back} />
        <Ionicons name="medkit" size={40} color={colors.white} />
        <Text style={styles.brand}>UTOPÍA</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <ResponsiveContainer maxWidth={480}>
        <View style={styles.card}>
          <Text style={styles.title}>Contacto de emergencia</Text>
          <Text style={styles.subtitle}>Registra una nueva cuenta</Text>
          <TextField label="Nombre completo" placeholder="Ingresa el nombre completo" value={draft.contactoNombre} onChangeText={(v) => update({ contactoNombre: v })} />
          <TextField label="Parentesco" placeholder="Ingresa el parentesco que tiene contigo" value={draft.contactoParentesco} onChangeText={(v) => update({ contactoParentesco: v })} />
          <TextField label="Teléfono celular" placeholder="Ingresa su número de teléfono" keyboardType="phone-pad" value={draft.contactoTelefono} onChangeText={(v) => update({ contactoTelefono: v })} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {correoDuplicado && (
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('RegisterStep1')}
            >
              Corregir correo
            </Text>
          )}
          <Button title="Terminar registro" onPress={terminar} loading={cargando} />
        </View>
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: { backgroundColor: colors.primary, alignItems: 'center', paddingTop: spacing.xl * 1.4, paddingBottom: spacing.xl * 1.6 },
  back: { position: 'absolute', top: spacing.xl * 1.4, left: spacing.md },
  brand: { color: colors.white, fontSize: 24, fontWeight: '800', letterSpacing: 2, marginTop: spacing.xs },
  body: { flexGrow: 1, padding: spacing.lg, marginTop: -30 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg },
  title: { fontSize: 17, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  error: { color: colors.danger, fontSize: 12.5, marginBottom: spacing.sm },
  link: { color: colors.primary, fontWeight: '700', fontSize: 13, marginBottom: spacing.md },
});
