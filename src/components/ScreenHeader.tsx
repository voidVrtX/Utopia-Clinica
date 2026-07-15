import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';

export default function ScreenHeader({
  title,
  onBack,
  right,
  color = colors.primary,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  color?: string;
}) {
  return (
    <View style={[styles.header, { backgroundColor: color }]}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} style={styles.side}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  side: { width: 32, alignItems: 'flex-end' },
  title: { flex: 1, textAlign: 'center', color: colors.white, fontSize: 17, fontWeight: '700' },
});
