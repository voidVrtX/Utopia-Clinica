import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import { useCrearRecetaViewModel } from '../../viewmodels/useHistorialMedicoViewModel';

export default function CrearRecetaScreen({ route, navigation }: any) {
  const { citaId } = route.params;
  const vm = useCrearRecetaViewModel(citaId);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Nueva receta" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Field label="Diagnóstico" value={vm.diagnostico} onChangeText={vm.setDiagnostico} placeholder="Ej. Migraña tensional" />
        <Field label="Tratamiento" value={vm.tratamiento} onChangeText={vm.setTratamiento} placeholder="Medicamento, dosis y duración" multiline />
        <Field label="Presión arterial" value={vm.presionArterial} onChangeText={vm.setPresionArterial} placeholder="120/80 mmHg" />
        <Field label="Temperatura" value={vm.temperatura} onChangeText={vm.setTemperatura} placeholder="36.5 °C" />
        <Field label="Observaciones" value={vm.observaciones} onChangeText={vm.setObservaciones} placeholder="Indicaciones adicionales" multiline />
        <Button
          title="Generar receta y código QR"
          onPress={() => vm.guardar(() => navigation.navigate('MedicoTabs', { screen: 'HistorialTab' }))}
          loading={vm.enviando}
        />
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline }: any) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textarea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  label: { fontWeight: '700', fontSize: 13, color: colors.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12, backgroundColor: colors.white, color: colors.text },
  textarea: { minHeight: 70, textAlignVertical: 'top' },
});
