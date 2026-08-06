import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import { Aviso } from '../../models/Aviso';
import Button from '../../components/Button';

export default function AvisoDetalleScreen({ route, navigation }: any) {
  const aviso: Aviso | undefined = route?.params?.aviso;
  const titulo = aviso?.titulo ?? 'Aviso';
  const detalle = aviso?.detalle ?? 'No hay detalles disponibles.';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{titulo}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="notifications" size={24} color={colors.primary} style={{ marginRight: spacing.sm }} />
            <Text style={styles.type}>{aviso?.tipo ?? 'Aviso'}</Text>
          </View>
          <Text style={styles.detailText}>{detalle}</Text>
          {aviso?.fechaISO ? <Text style={styles.meta}>Fecha: {aviso.fechaISO}</Text> : null}
          {aviso?.hora ? <Text style={styles.meta}>Hora: {aviso.hora}</Text> : null}
        </View>
        <Button title="Regresar" variant="outline" onPress={() => navigation.goBack()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  body: { padding: spacing.md, flexGrow: 1 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  type: { fontWeight: '700', color: colors.text, fontSize: 14 },
  detailText: { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: spacing.sm },
  meta: { color: colors.textMuted, marginTop: spacing.sm, fontSize: 12.5 },
});
