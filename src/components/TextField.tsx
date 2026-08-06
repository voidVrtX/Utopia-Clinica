import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export default function TextField({ label, error, style, showPasswordToggle, ...rest }: Props) {
  const { secureTextEntry = false, ...textInputProps } = rest;
  const [secureText, setSecureText] = useState(secureTextEntry);

  useEffect(() => {
    setSecureText(secureTextEntry);
  }, [secureTextEntry]);

  const toggleSecureText = () => setSecureText((prev) => !prev);

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        secureTextEntry={showPasswordToggle ? secureText : secureTextEntry}
        style={[
          styles.input,
          error ? { borderColor: colors.danger } : null,
          showPasswordToggle ? { paddingRight: 44 } : null,
          style,
        ]}
        {...textInputProps}
      />
      {showPasswordToggle && secureTextEntry ? (
        <TouchableOpacity style={styles.eyeIcon} onPress={toggleSecureText}>
          <Ionicons name={secureText ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    top: '50%',
    marginTop: -10,
  },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
});
