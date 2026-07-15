import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

interface MedicalSummaryProps {
  bloodType?: string;
  allergies?: string[];
  address?: {
    calle: string;
    numero: string;
    municipio: string;
    estado: string;
  };
  distance?: number;
  expanded?: boolean;
}

export default function MedicalSummary({
  bloodType,
  allergies,
  address,
  distance,
  expanded = false,
}: MedicalSummaryProps) {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerContent}>
          <Ionicons name="medkit" size={24} color={colors.primary} />
          <Text style={styles.title}>Resumen Médico</Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {bloodType && (
            <View style={styles.item}>
              <View style={styles.itemIcon}>
                <Ionicons name="water" size={20} color={colors.primary} />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Tipo de sangre</Text>
                <Text style={styles.itemValue}>{bloodType}</Text>
              </View>
            </View>
          )}

          {allergies && allergies.length > 0 && (
            <View style={styles.item}>
              <View style={styles.itemIcon}>
                <Ionicons name="warning" size={20} color={colors.warning} />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Alergias ({allergies.length})</Text>
                <View style={styles.allergyChips}>
                  {allergies.map((allergy) => (
                    <View key={allergy} style={styles.allergyChip}>
                      <Text style={styles.allergyText}>{allergy}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {address && (
            <View style={styles.item}>
              <View style={styles.itemIcon}>
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Dirección</Text>
                <Text style={styles.itemValue} numberOfLines={2}>
                  {address.calle} #{address.numero}, {address.municipio}, {address.estado}
                </Text>
              </View>
            </View>
          )}

          {distance !== undefined && (
            <View style={styles.item}>
              <View style={styles.itemIcon}>
                <Ionicons name="navigate" size={20} color={colors.primary} />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>Distancia a la clínica</Text>
                <Text style={styles.itemValue}>{distance} km</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    padding: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#E4F2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  allergyChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  allergyChip: {
    backgroundColor: '#FFF3E0',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  allergyText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.warning,
  },
});
