import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Pressable } from 'react-native';
import { colors, radius, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import CalendarPicker from '../../components/CalendarPicker';
import Button from '../../components/Button';
import { useModificarCitaViewModel } from '../../viewmodels/useCitasViewModel';
import { useSession } from '../../context/SessionContext';

export default function ModificarCitaScreen({ route, navigation }: any) {
  const { citaId } = route.params;
  const { usuario } = useSession();
  const vm = useModificarCitaViewModel(citaId);

  if (!vm.cita) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Modificar cita" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.hola}>Hola {usuario?.nombre?.split(' ')[0]} · elige una especialidad: {vm.cita.especialidad}</Text>

        <Text style={styles.label}>Selecciona una fecha</Text>
        <CalendarPicker selectedISO={vm.fechaISO} onSelect={vm.setFechaISO} markedISO={['2026-06-12', '2026-06-13', '2026-06-18', '2026-06-23']} />

        <Text style={styles.label}>Horarios disponibles - Turno Matutino</Text>
        <View style={styles.horariosGrid}>
          {vm.HORARIOS.map((h) => {
            const sel = vm.hora === h;
            return (
              <Pressable key={h} style={[styles.horaChip, sel && styles.horaChipSel]} onPress={() => vm.setHora(h)}>
                <Text style={[styles.horaText, sel && styles.horaTextSel]}>{h}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Motivo de consulta (opcional)</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Describe brevemente el motivo de tu visita…"
          placeholderTextColor={colors.textMuted}
          multiline
          value={vm.motivo}
          onChangeText={vm.setMotivo}
        />

        <Button
          title="Modificar cita"
          onPress={() => vm.guardar(() => navigation.replace('Confirmacion', { tipo: 'modificada' }))}
          loading={vm.enviando}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  hola: { fontWeight: '700', fontSize: 14, color: colors.text, marginBottom: spacing.md },
  label: { fontWeight: '700', fontSize: 13, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.xs },
  horariosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  horaChip: { width: '31%', paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.white },
  horaChipSel: { backgroundColor: colors.gold, borderColor: colors.gold },
  horaText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  horaTextSel: { color: colors.white },
  textarea: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12, minHeight: 70, textAlignVertical: 'top', backgroundColor: colors.white, color: colors.text, marginBottom: spacing.md },
});
