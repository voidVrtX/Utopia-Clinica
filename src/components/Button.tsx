import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({ title, onPress, variant = 'primary', disabled, loading, style }: Props) {
  const bg =
    variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : 'transparent';
  const borderColor = variant === 'outline' ? colors.primary : variant === 'danger' ? colors.danger : 'transparent';
  const textColor = variant === 'outline' ? colors.primary : variant === 'ghost' ? colors.primary : colors.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: bg, borderColor, borderWidth: variant === 'outline' ? 1.5 : 0 },
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  text: { fontSize: 15, fontWeight: '700' },
});
