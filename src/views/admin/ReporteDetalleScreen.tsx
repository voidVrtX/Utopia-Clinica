import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Badge from '../../components/Badge';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import {
  ReportesController,
  TipoReporte,
  CitaReporte,
  PacienteReporte,
  MedicoReporte,
} from '../../controllers/ReportesController';
import { ExportService } from '../../services/exportService';

const EXPORTADORES: Record<TipoReporte, { pdf: () => Promise<void>; excel: () => Promise<void> } | null> = {
  citas: { pdf: () => ExportService.exportarCitasPDF(), excel: () => ExportService.exportarCitasExcel() },
  cancelaciones: {
    pdf: () => ExportService.exportarCancelacionesPDF(),
    excel: () => ExportService.exportarCancelacionesExcel(),
  },
  pacientes: { pdf: () => ExportService.exportarPacientesPDF(), excel: () => ExportService.exportarPacientesExcel() },
  medicos: { pdf: () => ExportService.exportarMedicosPDF(), excel: () => ExportService.exportarMedicosExcel() },
};

export default function ReporteDetalleScreen({ route, navigation }: any) {
  const { titulo, color, tipo } = route.params as { titulo: string; color: string; tipo: TipoReporte };
  const [datos, setDatos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    setCargando(true);
    ReportesController.obtener(tipo)
      .then(setDatos)
      .finally(() => setCargando(false));
  }, [tipo]);

  const exportar = () => {
    const exportador = EXPORTADORES[tipo];
    if (!exportador) return;
    Alert.alert('Exportar reporte', 'Elige el formato', [
      {
        text: 'PDF',
        onPress: async () => {
          setExportando(true);
          try {
            await exportador.pdf();
          } catch {
            Alert.alert('Exportar', 'No se pudo generar el archivo. Intenta de nuevo.');
          } finally {
            setExportando(false);
          }
        },
      },
      {
        text: 'Excel',
        onPress: async () => {
          setExportando(true);
          try {
            await exportador.excel();
          } catch {
            Alert.alert('Exportar', 'No se pudo generar el archivo. Intenta de nuevo.');
          } finally {
            setExportando(false);
          }
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={titulo} onBack={() => navigation.goBack()} color={color} />
      <ResponsiveContainer style={styles.rangoRow}>
        <View style={styles.rangoBox}>
          <Ionicons name="stats-chart-outline" size={14} color={colors.text} />
          <Text style={styles.rangoText}>{datos.length} registro{datos.length === 1 ? '' : 's'}</Text>
        </View>
        <Pressable style={[styles.exportBtn, { backgroundColor: color }]} onPress={exportar} disabled={exportando}>
          {exportando ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.exportBtnText}>EXPORTAR</Text>
          )}
        </Pressable>
      </ResponsiveContainer>

      {cargando ? (
        <Text style={styles.muted}>Cargando…</Text>
      ) : datos.length === 0 ? (
        <Text style={styles.muted}>No hay datos para este reporte.</Text>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
        <ResponsiveGrid>
          {tipo === 'citas' || tipo === 'cancelaciones'
            ? (datos as CitaReporte[]).map((c) => (
                <View key={c.id} style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitulo}>
                      {c.paciente} → {c.medico}
                    </Text>
                    <Text style={styles.itemSub}>
                      {c.fechaISO} · {c.hora} · {c.especialidad}
                    </Text>
                    {c.motivo ? <Text style={styles.itemSub}>Motivo: {c.motivo}</Text> : null}
                  </View>
                  <Badge estado={c.estado} />
                </View>
              ))
            : null}

          {tipo === 'pacientes'
            ? (datos as PacienteReporte[]).map((p) => (
                <View key={p.id} style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitulo}>{p.nombre}</Text>
                    <Text style={styles.itemSub}>{p.email}{p.telefono ? ` · ${p.telefono}` : ''}</Text>
                    <Text style={styles.itemSub}>Registrado el {p.registradoEl}</Text>
                  </View>
                  <View style={styles.badgeNum}>
                    <Text style={styles.badgeNumText}>{p.totalCitas}</Text>
                    <Text style={styles.badgeNumLabel}>citas</Text>
                  </View>
                </View>
              ))
            : null}

          {tipo === 'medicos'
            ? (datos as MedicoReporte[]).map((m) => (
                <View key={m.id} style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitulo}>{m.nombre}</Text>
                    <Text style={styles.itemSub}>{m.especialidad}</Text>
                    <Text style={styles.itemSub}>
                      {m.totalCitas} citas · {m.completadas} completadas · {m.canceladas} canceladas
                    </Text>
                  </View>
                  <Badge estado={m.activo ? 'Activo' : 'Inactivo'} />
                </View>
              ))
            : null}
        </ResponsiveGrid>
        </ResponsiveContainer>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rangoRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, paddingBottom: 0 },
  rangoBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 10, borderRadius: radius.sm, ...shadow },
  rangoText: { fontSize: 12, color: colors.text },
  exportBtn: { paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center', borderRadius: radius.sm, minWidth: 90 },
  exportBtnText: { color: colors.white, fontWeight: '800', fontSize: 11.5 },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  itemTitulo: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  itemSub: { color: colors.textMuted, fontSize: 12 },
  badgeNum: { alignItems: 'center', paddingLeft: spacing.sm },
  badgeNumText: { fontWeight: '800', fontSize: 16, color: colors.primary },
  badgeNumLabel: { fontSize: 10, color: colors.textMuted },
});
