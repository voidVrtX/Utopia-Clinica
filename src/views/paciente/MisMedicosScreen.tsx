import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useMedicosViewModel } from '../../viewmodels/useMedicosViewModel';

export default function MisMedicosScreen({ navigation }: any) {
  const { medicos, cargando } = useMedicosViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Mis Médicos" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          {cargando ? (
            <Text style={styles.muted}>Cargando…</Text>
          ) : (
            <ResponsiveGrid>
              {medicos.map((m) => (
                <Pressable key={m.id} style={styles.item} onPress={() => navigation.navigate('MedicoIndividual', { medicoId: m.id })}>
                  <Avatar nombre={m.nombre} />
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.nombre}>{m.nombre}</Text>
                    <Text style={styles.esp}>{m.especialidad}</Text>
                  </View>
                  <Badge estado={m.activo ? 'Activo' : 'Inactivo'} />
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
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  nombre: { fontWeight: '700', fontSize: 14, color: colors.text },
  esp: { color: colors.textMuted, fontSize: 12 },
  muted: { color: colors.textMuted },
});
