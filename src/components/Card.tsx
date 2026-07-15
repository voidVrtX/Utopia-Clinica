import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/theme';

export default function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
});
