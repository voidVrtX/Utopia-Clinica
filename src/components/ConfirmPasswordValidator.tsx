import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

interface ConfirmPasswordValidatorProps {
  value: string;
  passwordValue: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ConfirmPasswordValidator({
  value,
  passwordValue,
  onChangeText,
  label = 'Confirmar contraseña',
  placeholder = 'Confirma tu contraseña',
}: ConfirmPasswordValidatorProps) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordsMatch = value.length > 0 && value === passwordValue;
  const showWarning = value.length > 0 && !passwordsMatch;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {showWarning && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={16} color="#D98E00" style={styles.warningIcon} />
          <Text style={styles.warningText}>Verifica que tu contraseña coincida</Text>
        </View>
      )}

      {passwordsMatch && value.length > 0 && (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={16} color="#2E9E5B" style={styles.successIcon} />
          <Text style={styles.successText}>Las contraseñas coinciden</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  input: {
    height: 52,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.text,
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -12,
    fontSize: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB900',
  },
  warningIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  warningText: {
    fontSize: 13,
    color: '#D98E00',
    fontWeight: '500',
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F6EA',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#2E9E5B',
  },
  successIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  successText: {
    fontSize: 13,
    color: '#2E9E5B',
    fontWeight: '500',
    flex: 1,
  },
});
