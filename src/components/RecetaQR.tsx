import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, radius, spacing } from '../theme/theme';

export default function RecetaQR({ value, invalida }: { value: string; invalida?: boolean }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.titulo}>ESCANEA CÓDIGO QR EN FARMACIA</Text>
      <View style={[styles.qrBox, invalida && styles.qrBoxInvalida]}>
        <QRCode value={value} size={190} color={invalida ? colors.disabled : colors.text} backgroundColor={colors.white} />
      </View>
      {invalida ? (
        <View style={styles.invalidaBadge}>
          <Text style={styles.invalidaTexto}>RECETA YA UTILIZADA</Text>
        </View>
      ) : null}
      <Text style={styles.codigo}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.lg },
  titulo: { fontWeight: '800', fontSize: 13, color: colors.text, marginBottom: spacing.md, letterSpacing: 0.5 },
  qrBox: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrBoxInvalida: { opacity: 0.35 },
  invalidaBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.dangerBg,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  invalidaTexto: { color: colors.danger, fontWeight: '800', fontSize: 12 },
  codigo: { marginTop: spacing.sm, color: colors.textMuted, fontSize: 11 },
});
