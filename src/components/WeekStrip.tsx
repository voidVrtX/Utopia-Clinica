import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

const DIAS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function WeekStrip({
  centerDate = new Date(2026, 5, 10),
  selectedISO,
  onSelect,
  daysCount = 7,
  showMonthYear = false,
}: {
  centerDate?: Date;
  selectedISO: string;
  onSelect: (iso: string) => void;
  daysCount?: number;
  showMonthYear?: boolean;
}) {
  const start = new Date(centerDate);
  // start the strip on Sunday of the week containing centerDate
  start.setDate(centerDate.getDate() - start.getDay());

  const items = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const letra = DIAS[d.getDay()];
    return { iso, letra, num: d.getDate() };
  });

  return (
    <View>
      {showMonthYear ? (
        <View style={styles.monthYearWrap}>
          <Text style={styles.monthYearText}>{MONTHS[centerDate.getMonth()]} {centerDate.getFullYear()}</Text>
        </View>
      ) : null}
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.sm, gap: 6, alignItems: 'center', justifyContent: 'center' },
  cell: { alignItems: 'center', width: 48, marginHorizontal: 4 },
  letra: { fontSize: 14, color: colors.textMuted, marginBottom: 6, fontWeight: '800', textAlign: 'center' },
  letraSel: { color: colors.primary },
  numCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  numCircleSel: { backgroundColor: colors.primary },
  num: { fontSize: 14, color: colors.text, fontWeight: '700' },
  numSel: { color: colors.white },
  monthYearWrap: { alignItems: 'center', paddingVertical: spacing.xs },
  monthYearText: { fontSize: 13, fontWeight: '700', color: colors.text },
});
