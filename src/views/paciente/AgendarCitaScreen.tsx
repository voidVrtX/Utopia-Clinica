import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import CalendarPicker from '../../components/CalendarPicker';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import { useAgendarCitaViewModel } from '../../viewmodels/useCitasViewModel';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { useSession } from '../../context/SessionContext';

export default function AgendarCitaScreen({ navigation }: any) {
  const { usuario } = useSession();
  const { especialidades, medicos } = useHomeViewModel();
  const vm = useAgendarCitaViewModel();
  const [mostrarEsp, setMostrarEsp] = useState(false);

  const medicosDisponibles = vm.especialidad
    ? medicos.filter((m) => m.especialidad === vm.especialidad)
    : [];

  // Si cambia la especialidad, la elección de médico anterior ya no aplica.
  useEffect(() => {
    vm.setMedicoId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vm.especialidad]);

  const onAgendar = () => {
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

        {vm.especialidad && (
          <>
            <Text style={styles.label}>Elige tu médico</Text>
            {medicosDisponibles.length === 0 ? (
              <Text style={styles.sinMedicos}>
                No hay médicos disponibles para {vm.especialidad} por ahora.
              </Text>
            ) : (
              medicosDisponibles.map((m) => {
                const sel = vm.medicoId === m.id;
                return (
                  <Pressable
                    key={m.id}
                    style={[styles.medicoCard, sel && styles.medicoCardSel]}
                    onPress={() => vm.setMedicoId(m.id)}
                  >
                    <Avatar nombre={m.nombre} size={40} />
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <Text style={styles.medicoNombre}>{m.nombre}</Text>
                      {m.institucion ? <Text style={styles.medicoSub}>{m.institucion}</Text> : null}
                    </View>
                    <Ionicons
                      name={sel ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={sel ? colors.primary : colors.textMuted}
                    />
                  </Pressable>
                );
              })
            )}
          </>
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
  sinMedicos: { color: colors.textMuted, fontSize: 12.5, marginBottom: spacing.md },
  medicoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  medicoCardSel: { borderColor: colors.primary, backgroundColor: '#E4F2EE' },
  medicoNombre: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  medicoSub: { color: colors.textMuted, fontSize: 12 },
  horariosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  horaChip: { width: '31%', paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.white },
  horaChipSel: { backgroundColor: colors.primary, borderColor: colors.primary },
  horaText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  horaTextSel: { color: colors.white },
  textarea: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12, minHeight: 70, textAlignVertical: 'top', backgroundColor: colors.white, color: colors.text, marginBottom: spacing.md },
  error: { color: colors.danger, marginBottom: spacing.sm, fontSize: 12.5 },
});
