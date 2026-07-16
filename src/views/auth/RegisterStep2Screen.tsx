import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import TextField from '../../components/TextField';
import DatePickerCalendar from '../../components/DatePickerCalendar';
import SelectChips from '../../components/SelectChips';
import Button from '../../components/Button';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { useRegisterDraft } from '../../context/RegisterDraftContext';

export default function RegisterStep2Screen({ navigation }: any) {
  const { draft, update } = useRegisterDraft();
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const continuar = () => {
    if (!draft.nombre.trim() || !draft.apellidoPaterno.trim() || !draft.sexo || !draft.fechaNacimiento.trim() || !draft.telefono.trim()) {
      setError('Completa los campos obligatorios.');
      return;
    }
    if (dateError) {
      setError(dateError);
      return;
    }
    setError(null);
    navigation.navigate('RegistroDetalles');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.headerBg}>
        <Ionicons name="arrow-back" size={22} color={colors.white} onPress={() => navigation.goBack()} style={styles.back} />
        <Image source={require('../../assets/brand/logo-negro.png')} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode="contain" />
        <Text style={styles.brand}>UTOPÍA</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <ResponsiveContainer maxWidth={480}>
        <View style={styles.card}>
          <Text style={styles.title}>Datos principales</Text>
          <Text style={styles.subtitle}>Registra una nueva cuenta</Text>
          <TextField label="Nombre(s)" placeholder="Ingresa tu nombre" value={draft.nombre} onChangeText={(v) => update({ nombre: v })} />
          <TextField label="Apellido paterno" placeholder="Ingresa tu apellido paterno" value={draft.apellidoPaterno} onChangeText={(v) => update({ apellidoPaterno: v })} />
          <TextField label="Apellido materno" placeholder="Ingresa tu apellido materno" value={draft.apellidoMaterno} onChangeText={(v) => update({ apellidoMaterno: v })} />
          <SelectChips label="Sexo" options={['Masculino', 'Femenino', 'Otro']} value={draft.sexo} onChange={(v) => update({ sexo: v as any })} />
          <DatePickerCalendar
            label="Fecha de nacimiento"
            value={draft.fechaNacimiento}
            onChangeText={(v) => update({ fechaNacimiento: v })}
            onDateError={setDateError}
          />
          <TextField label="Teléfono celular" placeholder="Ingresa tu número de teléfono" keyboardType="phone-pad" value={draft.telefono} onChangeText={(v) => update({ telefono: v })} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Continuar" onPress={continuar} />
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
});
