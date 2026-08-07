import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import ScreenHeader from '../../components/ScreenHeader';
import { useMedicoPacientesViewModel } from '../../viewmodels/useMedicoPacientesViewModel';

export default function PacientesMedicoScreen({ navigation }: any) {
  const { pacientes, cargando } = useMedicoPacientesViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Pacientes" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          {cargando ? (
            <Text style={styles.muted}>Cargando…</Text>
          ) : pacientes.length === 0 ? (
            <Text style={styles.muted}>No hay pacientes con cita agendada.</Text>
          ) : (
            <ResponsiveGrid>
              {pacientes.map((paciente) => (
                <Pressable
                  key={paciente.id}
                  style={styles.card}
                  onPress={() => navigation.navigate('PacienteDetalleMedico', { pacienteId: paciente.id })}
                >
                  <Avatar nombre={paciente.nombre} />
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.nombre}>{paciente.nombre}</Text>
                    <Text style={styles.sub}>{paciente.email}</Text>
                    <Text style={styles.sub}>{paciente.telefono ?? 'Teléfono no registrado'}</Text>
                  </View>
                  <Badge estado="Confirmada" />
                </Pressable>
              ))}
            </ResponsiveGrid>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  nombre: { fontWeight: '700', fontSize: 14, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12 },
  muted: { color: colors.textMuted },
});
