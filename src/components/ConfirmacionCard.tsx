import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';
import Button from './Button';
import { maskEmail } from '../utils/helpers';

interface Props {
  color: string;
  titulo: string;
  mensaje: string;
  email: string;
  onAceptar: () => void;
  logo?: boolean;
  campoOpcional?: React.ReactNode;
}

export default function ConfirmacionCard({ color, titulo, mensaje, email, onAceptar, campoOpcional }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.logoWrap}>
        <Image source={require('../../assets/reemplazar_medikit.png')} style={styles.logoImage} />
        <Text style={styles.brand}>UTOPÍA</Text>
        <Text style={styles.brandSub}>CLÍNICA MÉDICA</Text>
      </View>
      <View style={styles.card}>
        <Text style={[styles.titulo, { color }]}>{titulo}</Text>
        <View style={styles.iconCircle}>
          <Ionicons name="mail" size={34} color={color} />
        </View>
        {campoOpcional}
        <Text style={[styles.mensaje, { color }]}>{mensaje}</Text>
        <Text style={styles.sub}>
          Se ha enviado una notificación al correo electrónico del paciente {maskEmail(email)}.
        </Text>
        <Button title="Aceptar" onPress={onAceptar} style={{ backgroundColor: color, width: '100%' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: spacing.xl * 1.5, paddingHorizontal: spacing.lg },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xl },
  brand: { color: colors.white, fontSize: 26, fontWeight: '800', letterSpacing: 2, marginTop: 6 },
  brandSub: { color: colors.white, fontSize: 10, letterSpacing: 2, marginTop: 2 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  logoImage: { width: 44, height: 44, tintColor: colors.white },
  titulo: { fontSize: 17, fontWeight: '800', marginBottom: spacing.sm },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  mensaje: { fontWeight: '800', fontSize: 14, marginBottom: 6, textAlign: 'center' },
  sub: { color: colors.textMuted, fontSize: 12.5, textAlign: 'center', marginBottom: spacing.md },
});
