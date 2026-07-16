import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import { Receta } from '../../models/Receta';
import { RecetasController } from '../../controllers/RecetasController';
import { useSession } from '../../context/SessionContext';
import { formatFechaCorta } from '../../utils/helpers';

export default function ConfirmarInvalidacionScreen({ route, navigation }: any) {
  const { receta: recetaParam, codigoQR } = route.params;
  const { usuario } = useSession();
  const [receta, setReceta] = useState<Receta | null>(recetaParam ?? null);
  const [error, setError] = useState<string | null>(null);
  const [invalidada, setInvalidada] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [selecciones, setSelecciones] = useState<Record<string, boolean>>(
    (recetaParam?.medicamentos ?? []).reduce((acc: Record<string, boolean>, item: any) => {
      acc[item.id] = true;
      return acc;
    }, {})
  );

  useEffect(() => {
    if (recetaParam) return;

    (async () => {
      const r = await RecetasController.obtenerPorCodigo(codigoQR);
      setReceta(r);
      if (!r) {
        setError('Código QR no reconocido. No corresponde a una receta de Utopía.');
        return;
      }
      if (!r.valida) {
        setError('Esta receta ya fue utilizada anteriormente.');
      }
      setSelecciones(
        (r?.medicamentos ?? []).reduce((acc: Record<string, boolean>, item) => {
          acc[item.id] = true;
          return acc;
        }, {})
      );
    })();
  }, [recetaParam, codigoQR]);

  const toggleMedicamento = (id: string) => {
    setSelecciones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const confirmar = async () => {
    if (!usuario || !receta) return;
    setProcesando(true);
    try {
      const resultado = await RecetasController.entregar(
        receta.id,
        receta.medicamentos.map((item) => ({
          ...item,
          entregado: Boolean(selecciones[item.id]),
        }))
      );

      setProcesando(false);
      setInvalidada(true);
      setReceta(resultado.receta);
      if (resultado.reemplazo) {
        setError(`Se generó receta de reemplazo con ${resultado.reemplazo.medicamentos.length} medicamento(s) agotado(s).`);
      } else {
        setError(null);
      }
    } catch (err) {
      setProcesando(false);
      setError(err instanceof Error ? err.message : 'Error al procesar la entrega.');
    }
  };

  if (receta === null) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Validar receta" onBack={() => navigation.goBack()} />
        <View style={styles.card}>
          <Text style={styles.errorText}>{error ?? 'Buscando receta...'}</Text>
        </View>
      </View>
    );
  }

  if (invalidada) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color={colors.white} />
        <Text style={styles.successTitle}>Receta completada</Text>
        <Text style={styles.successSub}>El paciente ya no podrá volver a usar este código QR.</Text>
        {error ? <Text style={styles.successSub}>{error}</Text> : null}
        <Button title="Escanear otra receta" variant="outline" onPress={() => navigation.navigate('EscanearReceta')} style={{ backgroundColor: colors.white, marginTop: spacing.lg }} />
        <Button title="Volver al inicio" variant="ghost" onPress={() => navigation.navigate('FarmaciaInicio')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Validar receta" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        {error ? (
          <View style={styles.avisoInvalida}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
            <Text style={styles.avisoInvalidaText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.fecha}>Receta del {formatFechaCorta(receta.fecha)}</Text>
          {receta.diagnostico ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Diagnóstico</Text>
              <Text style={styles.sectionText}>{receta.diagnostico}</Text>
            </View>
          ) : null}
          {receta.tratamiento ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tratamiento</Text>
              <Text style={styles.sectionText}>{receta.tratamiento}</Text>
            </View>
          ) : null}
          <View style={[styles.section, { marginTop: spacing.lg }]}> 
            <Text style={styles.sectionTitle}>Medicamentos</Text>
            {receta.medicamentos.map((item) => (
              <Pressable key={item.id} style={styles.medicamentoRow} onPress={() => toggleMedicamento(item.id)}>
                <View style={styles.checkbox}>
                  {selecciones[item.id] ? (
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  ) : null}
                </View>
                <View style={styles.medicamentoTexto}>
                  <Text style={styles.medicamentoNombre}>{item.nombre}</Text>
                  <Text style={styles.medicamentoDosis}>{item.dosis}</Text>
                </View>
                <Text style={styles.medicamentoStatus}>{selecciones[item.id] ? 'Entregado' : 'Agotado'}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.helpText}>Marca los medicamentos entregados. Los no marcados se considerarán agotados.</Text>
          {receta.valida ? (
            <Button title="Completado" variant="danger" onPress={confirmar} loading={procesando} />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, alignItems: 'stretch', ...shadow },
  errorText: { color: colors.danger, fontWeight: '700', textAlign: 'center', marginTop: spacing.sm },
  avisoInvalida: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.dangerBg, padding: spacing.sm, borderRadius: radius.sm, marginBottom: spacing.sm },
  avisoInvalidaText: { color: colors.danger, fontSize: 12, flexShrink: 1, fontWeight: '600' },
  fecha: { fontWeight: '800', fontSize: 15, color: colors.text, marginBottom: spacing.sm },
  section: { marginBottom: spacing.sm },
  sectionTitle: { fontWeight: '700', fontSize: 12.5, color: colors.text, marginBottom: 4 },
  sectionText: { color: colors.textMuted, fontSize: 12.5 },
  medicamentoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  checkbox: { width: 24, height: 24, borderWidth: 1.5, borderColor: colors.border, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm, backgroundColor: colors.primary },
  medicamentoTexto: { flex: 1 },
  medicamentoNombre: { color: colors.text, fontWeight: '700' },
  medicamentoDosis: { color: colors.textMuted, fontSize: 12 },
  medicamentoStatus: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  helpText: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm, marginBottom: spacing.md },
  successContainer: { flex: 1, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  successTitle: { color: colors.white, fontWeight: '800', fontSize: 20, marginTop: spacing.md },
  successSub: { color: colors.white, opacity: 0.9, textAlign: 'center', marginTop: 6 },
});
