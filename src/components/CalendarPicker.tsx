import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function CalendarPicker({
  selectedISO,
  onSelect,
  markedISO = [],
}: {
  selectedISO: string | null;
  onSelect: (iso: string) => void;
  markedISO?: string[];
}) {
  const initial = selectedISO ? new Date(selectedISO + 'T00:00:00') : new Date(2026, 5, 1);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  // getDay: 0=domingo .. 6=sabado -> convertir a lunes-inicio
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <View>
      <View style={styles.monthRow}>
        <Pressable onPress={goPrev} hitSlop={10}>
          <Ionicons name="chevron-back" size={18} color={colors.text} />
        </Pressable>
        <Text style={styles.monthText}>
          {MESES[viewMonth]} {viewYear}
        </Text>
        <Pressable onPress={goNext} hitSlop={10}>
          <Ionicons name="chevron-forward" size={18} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {DIAS.map((d) => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((day, idx) => {
          if (day == null) return <View key={idx} style={styles.cell} />;
          const iso = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
          const selected = iso === selectedISO;
          const marked = markedISO.includes(iso);
          return (
            <Pressable key={idx} style={styles.cell} onPress={() => onSelect(iso)}>
              <View style={[styles.dayCircle, selected && styles.daySelected, !selected && marked && styles.dayMarked]}>
                <Text style={[styles.dayText, selected && styles.dayTextSelected, !selected && marked && styles.dayTextMarked]}>
                  {day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const CELL = 40;

const styles = StyleSheet.create({
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.sm },
  monthText: { fontWeight: '700', color: colors.text, fontSize: 14 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  weekDay: { width: CELL, textAlign: 'center', color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  dayCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: colors.primary },
  dayMarked: { backgroundColor: colors.primaryLight },
  dayText: { fontSize: 13, color: colors.text },
  dayTextSelected: { color: colors.white, fontWeight: '800' },
  dayTextMarked: { color: colors.primary, fontWeight: '700' },
  radius: { borderRadius: radius.sm },
});
