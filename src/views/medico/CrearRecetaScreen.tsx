import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import MedicamentoPicker from '../../components/MedicamentoPicker';
import { useCrearRecetaViewModel } from '../../viewmodels/useHistorialMedicoViewModel';

export default function CrearRecetaScreen({ route, navigation }: any) {
  const { citaId } = route.params;
  const vm = useCrearRecetaViewModel(citaId);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Nueva receta" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <TextField label="Diagnóstico" value={vm.diagnostico} onChangeText={vm.setDiagnostico} placeholder="Ej. Migraña tensional" />
        <TextField label="Presión arterial" value={vm.presionArterial} onChangeText={vm.setPresionArterial} placeholder="120/80 mmHg" />
        <TextField label="Temperatura" value={vm.temperatura} onChangeText={vm.setTemperatura} placeholder="36.5 °C" />
        <TextField label="Observaciones" value={vm.observaciones} onChangeText={vm.setObservaciones} placeholder="Indicaciones adicionales" multiline />

        <Text style={styles.sectionTitle}>Agregar medicamento</Text>
        <MedicamentoPicker
          value={vm.nuevoMedicamentoNombre}
          onChangeValue={vm.setNuevoMedicamentoNombre}
          onSelectCatalogo={(item) => vm.setNuevoMedicamentoNombre(item.nombre)}
          placeholder="Buscar medicamento o escribir nombre"
        />
        <TextField label="Dosis" value={vm.nuevoMedicamentoDosis} onChangeText={vm.setNuevoMedicamentoDosis} placeholder="Ej. 500 mg cada 8h" />
        <Button title="Agregar medicamento" onPress={vm.agregarMedicamento} />

        {vm.medicamentos.length > 0 ? (
          <View style={styles.medicamentosList}>
            <Text style={styles.sectionTitle}>Medicamentos en la receta</Text>
            {vm.medicamentos.map((med) => (
              <View key={med.id} style={styles.medCard}>
                <Text style={styles.medName}>{med.nombre}</Text>
                <Text style={styles.medDosis}>{med.dosis}</Text>
                <Button title="Quitar" variant="outline" onPress={() => vm.quitarMedicamento(med.id)} />
              </View>
            ))}
          </View>
        ) : null}

        <Button
          title="Generar receta y código QR"
          onPress={() => vm.guardar(() => navigation.navigate('MedicoTabs', { screen: 'HistorialTab' }))}
          loading={vm.enviando}
          disabled={vm.medicamentos.length === 0}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  sectionTitle: { color: colors.text, fontWeight: '800', marginVertical: spacing.sm },
  medicamentosList: { marginTop: spacing.md },
  medCard: { backgroundColor: colors.white, borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  medName: { color: colors.text, fontWeight: '700', marginBottom: spacing.xs },
  medDosis: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm },
});
