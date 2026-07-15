import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';
import { useRecetasViewModel } from '../../viewmodels/useRecetasViewModel';
import { formatFechaCorta } from '../../utils/helpers';

export default function MisRecetasScreen({ navigation }: any) {
  const { recetas, cargando } = useRecetasViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Mis recetas" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          <Text style={styles.section}>RECETAS</Text>
          {cargando ? (
            <Text style={styles.muted}>Cargando…</Text>
          ) : recetas.length === 0 ? (
            <Text style={styles.muted}>Aún no tienes recetas.</Text>
          ) : (
            <ResponsiveGrid>
              {recetas.map((r) => (
                <View key={r.id} style={styles.card}>
                  <Ionicons name="document-text" size={24} color={colors.primary} style={{ marginRight: spacing.sm }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fecha}>{formatFechaCorta(r.fecha)}</Text>
                    <Text style={styles.sub}>{r.diagnostico}</Text>
                  </View>
                  <Pressable
                    style={[styles.verBtn, !r.valida && styles.verBtnInvalida]}
                    onPress={() => navigation.navigate('RecetaIndividual', { recetaId: r.id })}
                  >
                    <Text style={[styles.verBtnText, !r.valida && styles.verBtnTextInvalida]}>
                      {r.valida ? 'Ver receta' : 'Ya utilizada'}
                    </Text>
                  </Pressable>
                </View>
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
  section: { fontWeight: '800', fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm, letterSpacing: 0.5 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  fecha: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  verBtn: { backgroundColor: colors.successBg, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill },
  verBtnInvalida: { backgroundColor: colors.dangerBg },
  verBtnText: { color: colors.success, fontWeight: '700', fontSize: 11.5 },
  verBtnTextInvalida: { color: colors.danger },
  muted: { color: colors.textMuted },
});
