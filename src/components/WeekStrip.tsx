import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function WeekStrip({
  centerDate = new Date(2026, 5, 10),
  selectedISO,
  onSelect,
  daysCount = 7,
}: {
  centerDate?: Date;
  selectedISO: string;
  onSelect: (iso: string) => void;
  daysCount?: number;
}) {
  const start = new Date(centerDate);
  const items = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const letra = DIAS[(d.getDay() + 6) % 7];
    return { iso, letra, num: d.getDate() };
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((it) => {
        const sel = it.iso === selectedISO;
        return (
          <Pressable key={it.iso} style={styles.cell} onPress={() => onSelect(it.iso)}>
            <Text style={[styles.letra, sel && styles.letraSel]}>{it.letra}</Text>
            <View style={[styles.numCircle, sel && styles.numCircleSel]}>
              <Text style={[styles.num, sel && styles.numSel]}>{it.num}</Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.sm, gap: 4 },
  cell: { alignItems: 'center', width: 40, marginHorizontal: 2 },
  letra: { fontSize: 11, color: colors.textMuted, marginBottom: 4, fontWeight: '600' },
  letraSel: { color: colors.primary },
  numCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  numCircleSel: { backgroundColor: colors.primary },
  num: { fontSize: 13, color: colors.text, fontWeight: '600' },
  numSel: { color: colors.white },
});
