import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

interface PrivacyAgreementProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

const PRIVACY_ITEMS = [
  {
    icon: 'lock-closed',
    title: 'Datos Encriptados',
    description: 'Tu información médica se guarda con cifrado de nivel hospital',
  },
  {
    icon: 'shield',
    title: 'Cumplimiento HIPAA',
    description: 'Seguimos estrictamente las normas de privacidad internacionales',
  },
  {
    icon: 'eye-off',
    title: 'No se comparte',
    description: 'Tu información no se vende ni se comparte con terceros',
  },
  {
    icon: 'key',
    title: 'Control Total',
    description: 'Tú tienes control total sobre tu información médica',
  },
];

export default function PrivacyAgreement({ onAccept, onDecline }: PrivacyAgreementProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    onAccept?.();
  };

  const handleDecline = () => {
    Alert.alert(
      'Declinar privacidad',
      'Debes aceptar la política de privacidad para continuar',
      [{ text: 'OK' }]
    );
    onDecline?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
        <Text style={styles.title}>Tu Privacidad es Importante</Text>
        <Text style={styles.subtitle}>Cómo protegemos tu información</Text>
      </View>

      <View style={styles.items}>
        {PRIVACY_ITEMS.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemIcon}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, !accepted && styles.buttonDisabled]}
          onPress={handleAccept}
          disabled={accepted}
        >
          <Ionicons name="checkmark-circle" size={20} color={colors.white} />
          <Text style={styles.buttonText}>
            {accepted ? 'Privacidad Aceptada' : 'Aceptar & Continuar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Al continuar, aceptas nuestra política de privacidad y términos de servicio.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  items: {
    marginBottom: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: '#E4F2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemDescription: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  actions: {
    marginBottom: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
