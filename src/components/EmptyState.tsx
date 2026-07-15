import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

interface FeatureTip {
  icon: string;
  title: string;
  description: string;
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tips?: FeatureTip[];
}

export default function EmptyState({
  icon = 'document',
  title,
  description,
  actionLabel,
  onAction,
  tips,
}: EmptyStateProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={64} color={colors.primary} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Ionicons name="add-circle" size={20} color={colors.white} />
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}

      {tips && tips.length > 0 && (
        <View style={styles.tipsContainer}>
          <View style={styles.tipsTitleRow}>
            <Ionicons name="bulb" size={16} color={colors.text} />
            <Text style={styles.tipsTitle}>Consejos útiles</Text>
          </View>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tip}>
              <Ionicons name={tip.icon as any} size={18} color={colors.primary} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    padding: spacing.lg,
    paddingVertical: spacing.xl * 2,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E4F2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
    maxWidth: '85%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  tipsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tipDescription: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },
});
