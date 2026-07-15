import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';
import { AuthController } from '../controllers/AuthController';

interface EmailValidatorProps {
  value: string;
  onChangeText: (text: string) => void;
  onValidChange?: (isValid: boolean) => void;
  label?: string;
}

export default function EmailValidator({
  value,
  onChangeText,
  onValidChange,
  label = 'Correo electrónico',
}: EmailValidatorProps) {
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (value.length === 0) {
      setIsValid(false);
      setMessage(null);
      onValidChange?.(false);
      return;
    }

    setValidating(true);

    const timer = setTimeout(async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const formatValid = emailRegex.test(value);

      if (!formatValid) {
        setIsValid(false);
        setMessage('Correo inválido');
        onValidChange?.(false);
        setValidating(false);
        return;
      }

      // Validar que el email no exista
      try {
        const exists = await AuthController.verificarEmailExistente(value);
        if (exists) {
          setIsValid(false);
          setMessage('Este correo ya está registrado');
          onValidChange?.(false);
        } else {
          setIsValid(true);
          setMessage('Correo disponible');
          onValidChange?.(true);
        }
      } catch (error) {
        setIsValid(true);
        setMessage('Correo válido');
        onValidChange?.(true);
      }
      setValidating(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [value, onValidChange]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
        />
        {validating && <ActivityIndicator size="small" color={colors.primary} style={styles.icon} />}
        {!validating && value.length > 0 && (
          <Ionicons
            name={isValid ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={isValid ? '#2E9E5B' : colors.danger}
            style={styles.icon}
          />
        )}
      </View>

      {message && (
        <Text style={[styles.message, { color: isValid ? '#2E9E5B' : colors.danger }]}>
          {message}
        </Text>
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
  icon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -10,
  },
  message: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
});
