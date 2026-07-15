import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Button from '../../components/Button';
import { Receta } from '../../models/Receta';
import { RecetasController } from '../../controllers/RecetasController';
import { useSession } from '../../context/SessionContext';
import { formatFechaCorta } from '../../utils/helpers';

export default function ConfirmarInvalidacionScreen({ route, navigation }: any) {
  const { codigoQR } = route.params;
  const { usuario } = useSession();
  const [receta, setReceta] = useState<Receta | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [invalidada, setInvalidada] = useState(false);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await RecetasController.obtenerPorCodigo(codigoQR);
      setReceta(r);
      if (!r) setError('Código QR no reconocido. No corresponde a una receta de Utopía.');
      else if (!r.valida) setError('Esta receta ya fue utilizada anteriormente.');
    })();
  }, [codigoQR]);

  const confirmar = async () => {
    if (!usuario) return;
    setProcesando(true);
    const res = await RecetasController.invalidarPorCodigo(codigoQR, usuario.id);
    setProcesando(false);
    if (res.receta && !res.error) {
      setReceta(res.receta);
      setInvalidada(true);
    } else if (res.error) {
      setError(res.error);
    }
  };

  if (receta === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Validar receta" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  if (invalidada) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color={colors.white} />
        <Text style={styles.successTitle}>Receta invalidada</Text>
        <Text style={styles.successSub}>El paciente ya no podrá volver a usar este código QR.</Text>
        <Button title="Escanear otra receta" onPress={() => navigation.navigate('EscanearReceta')} style={{ backgroundColor: colors.white, marginTop: spacing.lg }} />
        <Button title="Volver al inicio" variant="ghost" onPress={() => navigation.navigate('FarmaciaInicio')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Validar receta" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        {error && !receta ? (
          <View style={styles.card}>
            <Ionicons name="close-circle" size={40} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : receta ? (
          <View style={styles.card}>
            {error ? (
              <View style={styles.avisoInvalida}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={styles.avisoInvalidaText}>{error}</Text>
              </View>
            ) : null}
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
            {receta.valida ? (
              <Button title="Confirmar entrega e invalidar receta" variant="danger" onPress={confirmar} loading={procesando} />
            ) : null}
          </View>
        ) : null}
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
  sectionTitle: { fontWeight: '700', fontSize: 12.5, color: colors.text, marginBottom: 2 },
  sectionText: { color: colors.textMuted, fontSize: 12.5 },
  successContainer: { flex: 1, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  successTitle: { color: colors.white, fontWeight: '800', fontSize: 20, marginTop: spacing.md },
  successSub: { color: colors.white, opacity: 0.9, textAlign: 'center', marginTop: 6 },
});
