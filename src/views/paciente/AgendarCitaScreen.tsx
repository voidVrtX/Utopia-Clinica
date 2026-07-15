import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import CalendarPicker from '../../components/CalendarPicker';
import Button from '../../components/Button';
import { useAgendarCitaViewModel } from '../../viewmodels/useCitasViewModel';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { useSession } from '../../context/SessionContext';

export default function AgendarCitaScreen({ navigation }: any) {
  const { usuario } = useSession();
  const { especialidades, medicos } = useHomeViewModel();
  const vm = useAgendarCitaViewModel();
  const [mostrarEsp, setMostrarEsp] = useState(false);

  const medicoSugerido = vm.especialidad
    ? medicos.find((m) => m.especialidad === vm.especialidad)
    : null;

  const onAgendar = () => {
    if (medicoSugerido) vm.setMedicoId(medicoSugerido.id);
    vm.agendar((citaId) => navigation.replace('Confirmacion', { tipo: 'agendada', citaId }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Agendar cita" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.hola}>Hola {usuario?.nombre?.split(' ')[0]}</Text>

        <Pressable style={styles.selector} onPress={() => setMostrarEsp((v) => !v)}>
          <Text style={vm.especialidad ? styles.selectorText : styles.selectorPlaceholder}>
            {vm.especialidad ?? 'Elige una especialidad'}
          </Text>
        </Pressable>
        {mostrarEsp && (
          <View style={styles.dropdown}>
            {especialidades.map((esp) => (
              <Pressable
                key={esp}
                style={styles.dropdownItem}
                onPress={() => {
                  vm.setEspecialidad(esp);
                  setMostrarEsp(false);
                }}
              >
                <Text style={styles.dropdownText}>{esp}</Text>
              </Pressable>
            ))}
          </View>
        )}

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
          numberOfLines={3}
          value={vm.motivo}
          onChangeText={vm.setMotivo}
        />

        {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
        <Button title="Agendar cita" onPress={onAgendar} loading={vm.enviando} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  hola: { fontWeight: '700', fontSize: 15, color: colors.text, marginBottom: spacing.md },
  selector: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 14, backgroundColor: colors.white, marginBottom: spacing.md },
  selectorText: { color: colors.text, fontWeight: '600' },
  selectorPlaceholder: { color: colors.textMuted },
  dropdown: { backgroundColor: colors.white, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, marginTop: -8, marginBottom: spacing.md },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  dropdownText: { color: colors.text },
  label: { fontWeight: '700', fontSize: 13, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.xs },
  horariosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  horaChip: { width: '31%', paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.white },
  horaChipSel: { backgroundColor: colors.primary, borderColor: colors.primary },
  horaText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  horaTextSel: { color: colors.white },
  textarea: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12, minHeight: 70, textAlignVertical: 'top', backgroundColor: colors.white, color: colors.text, marginBottom: spacing.md },
  error: { color: colors.danger, marginBottom: spacing.sm, fontSize: 12.5 },
});
