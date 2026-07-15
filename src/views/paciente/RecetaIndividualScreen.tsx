import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import RecetaQR from '../../components/RecetaQR';
import { Receta } from '../../models/Receta';
import { RecetasController } from '../../controllers/RecetasController';
import { useRecetasViewModel } from '../../viewmodels/useRecetasViewModel';

export default function RecetaIndividualScreen({ route, navigation }: any) {
  const { recetaId } = route.params;
  const { recetas } = useRecetasViewModel();
  const [receta, setReceta] = useState<Receta | null>(null);

  useEffect(() => {
    const r = recetas.find((x) => x.id === recetaId);
    if (r) setReceta(r);
  }, [recetas, recetaId]);

  if (!receta) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Mis recetas" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Mis recetas" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <Text style={styles.titulo}>RECETA INDIVIDUAL</Text>
          <RecetaQR value={receta.codigoQR} invalida={!receta.valida} />
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
          {receta.observaciones ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observaciones</Text>
              <Text style={styles.sectionText}>{receta.observaciones}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, ...shadow },
  titulo: { fontWeight: '800', fontSize: 13, color: colors.text, textAlign: 'center' },
  section: { marginTop: spacing.sm },
  sectionTitle: { fontWeight: '700', fontSize: 12.5, color: colors.text, marginBottom: 2 },
  sectionText: { color: colors.textMuted, fontSize: 12.5 },
});
