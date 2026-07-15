import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import { useSession } from '../../context/SessionContext';
import Button from '../../components/Button';

export default function InicioFarmaciaScreen({ navigation }: any) {
  const { usuario, logout } = useSession();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.hola}>Hola, {usuario?.nombre}</Text>
        <Text style={styles.sub}>Farmacia · Utopía Clínica</Text>
      </View>

      <Pressable style={styles.scanCard} onPress={() => navigation.navigate('EscanearReceta')}>
        <View style={styles.scanIcon}>
          <Ionicons name="qr-code" size={44} color={colors.white} />
        </View>
        <Text style={styles.scanTitulo}>Escanear receta</Text>
        <Text style={styles.scanSub}>Usa la cámara para leer el código QR y validar la entrega de medicamentos.</Text>
      </Pressable>

      <Button title="Cerrar sesión" variant="outline" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'space-between' },
  hola: { fontWeight: '800', fontSize: 20, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  scanCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center' },
  scanIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  scanTitulo: { color: colors.white, fontWeight: '800', fontSize: 17, marginBottom: 6 },
  scanSub: { color: colors.primaryLight, fontSize: 12.5, textAlign: 'center' },
});
