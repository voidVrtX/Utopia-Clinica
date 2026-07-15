import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import { useMisCitasViewModel, FiltroCitas } from '../../viewmodels/useCitasViewModel';
import { MedicosController } from '../../controllers/MedicosController';
import { Medico } from '../../models/User';
import CitaListItem from '../../components/CitaListItem';
import { CitasController } from '../../controllers/CitasController';

const TABS: FiltroCitas[] = ['Todas', 'Próximas', 'Completadas', 'Canceladas'];

export default function MisCitasScreen({ navigation }: any) {
  const { citas, filtro, setFiltro, cargando, recargar } = useMisCitasViewModel();
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    MedicosController.listar().then(setMedicos);
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', recargar);
    return unsub;
  }, [navigation, recargar]);

  const nombreMedico = (id: string) => medicos.find((m) => m.id === id)?.nombre ?? 'Médico';

  const cancelar = async (citaId: string) => {
    await CitasController.cancelar(citaId);
    recargar();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis citas</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}>
        {TABS.map((t) => (
          <Pressable key={t} style={[styles.tab, filtro === t && styles.tabActive]} onPress={() => setFiltro(t)}>
            <Text style={[styles.tabText, filtro === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.body}>
        {cargando ? (
          <Text style={styles.muted}>Cargando citas…</Text>
        ) : citas.length === 0 ? (
          <Text style={styles.muted}>No tienes citas en esta categoría.</Text>
        ) : (
          citas.map((c) => (
            <CitaListItem
              key={c.id}
              titulo="Hola"
              subtitulo={`${c.especialidad}`}
              fechaISO={c.fechaISO}
              hora={c.hora}
              estado={c.estado}
              onPress={() => navigation.navigate('DetalleCita', { citaId: c.id })}
              onModificar={
                c.estado === 'Confirmada' || c.estado === 'Pendiente'
                  ? () => navigation.navigate('ModificarCita', { citaId: c.id })
                  : undefined
              }
              onCancelar={
                c.estado === 'Confirmada' || c.estado === 'Pendiente' ? () => cancelar(c.id) : undefined
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  tabsRow: { backgroundColor: colors.background, paddingVertical: spacing.sm, flexGrow: 0 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.text, fontWeight: '700', fontSize: 12.5 },
  tabTextActive: { color: colors.white },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
