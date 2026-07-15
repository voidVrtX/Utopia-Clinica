import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import Button from '../../components/Button';

export default function ExportacionScreen({ navigation }: any) {
  const exportar = (formato: string) => {
    Alert.alert('Exportación', `Histórico exportado como ${formato} correctamente.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Ionicons name="medkit" size={40} color={colors.white} />
      <Text style={styles.brand}>UTOPÍA</Text>
      <View style={styles.card}>
        <Text style={styles.titulo}>Exportar Histórico</Text>
        <Pressable style={styles.opcion} onPress={() => exportar('PDF')}>
          <Ionicons name="document" size={22} color={colors.danger} />
          <Text style={styles.opcionText}>Exportar como PDF</Text>
        </Pressable>
        <Pressable style={styles.opcion} onPress={() => exportar('Excel')}>
          <Ionicons name="grid" size={22} color={colors.success} />
          <Text style={styles.opcionText}>Exportar como Excel</Text>
        </Pressable>
        <Button title="Cerrar" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, alignItems: 'center', paddingTop: spacing.xl * 1.5, padding: spacing.lg },
  brand: { color: colors.white, fontSize: 22, fontWeight: '800', letterSpacing: 2, marginBottom: spacing.xl, marginTop: spacing.sm },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, width: '100%' },
  titulo: { fontWeight: '800', fontSize: 16, color: colors.primary, textAlign: 'center', marginBottom: spacing.md },
  opcion: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  opcionText: { fontWeight: '700', color: colors.text, fontSize: 13.5 },
});
