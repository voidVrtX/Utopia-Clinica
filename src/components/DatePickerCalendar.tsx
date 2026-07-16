import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';

interface DatePickerCalendarProps {
  value: string; // "DD/MM/YYYY"
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  onDateError?: (error: string | null) => void;
  /**
   * Si es false, no valida edad mínima (útil para selecciones de rango en reportes)
   */
  validateAdult?: boolean;
  /**
   * Opcionalmente forzar año mínimo y máximo (ambos inclusive)
   */
  minYear?: number;
  maxYear?: number;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DIAS_SEMANA = ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá'];

const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

export default function DatePickerCalendar({
  value,
  onChangeText,
  label = 'Fecha de nacimiento',
  placeholder = 'DD / MM / YYYY',
  onDateError,
  validateAdult = true,
  minYear: minYearProp,
  maxYear: maxYearProp,
}: DatePickerCalendarProps) {
  const hoy = new Date();
  const defaultMinYear = hoy.getFullYear() - 100;
  const defaultMaxYear = hoy.getFullYear() - 18;
  const minYear = typeof minYearProp === 'number' ? minYearProp : defaultMinYear;
  const maxYear = typeof maxYearProp === 'number' ? maxYearProp : defaultMaxYear;
  const effectiveMinYear = validateAdult ? minYear : (typeof minYearProp === 'number' ? minYearProp : 1900);
  const effectiveMaxYear = validateAdult ? maxYear : (typeof maxYearProp === 'number' ? maxYearProp : hoy.getFullYear() + 100);

  const parsedValue = (() => {
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);
      if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
        return { day, month, year };
      }
    }
    return null;
  })();

  const effectiveValidateAdult = validateAdult;
  const initialYear = parsedValue?.year ?? hoy.getFullYear();
  const clampedInitialYear = Math.min(Math.max(initialYear, effectiveMinYear), effectiveMaxYear);
  const initialMonth = parsedValue?.month ?? hoy.getMonth();
  const initialDay = parsedValue?.day ?? hoy.getDate();

  const [showCalendar, setShowCalendar] = useState(false);
  const [modo, setModo] = useState<'dia' | 'anio'>('dia');
  const [selectedYear, setSelectedYear] = useState(clampedInitialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(Math.min(initialDay, getDaysInMonth(initialMonth, clampedInitialYear)));
  const [error, setError] = useState<string | null>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  const calculateAge = (day: number, month: number, year: number): number => {
    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - month;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
      age--;
    }
    return age;
  };

  const cambiarMes = (delta: number) => {
    let mes = selectedMonth + delta;
    let anio = selectedYear;
    if (mes < 0) {
      mes = 11;
      anio -= 1;
    } else if (mes > 11) {
      mes = 0;
      anio += 1;
    }
    if (anio < effectiveMinYear || anio > effectiveMaxYear) return;
    setSelectedMonth(mes);
    setSelectedYear(anio);
    setSelectedDay((d) => Math.min(d, getDaysInMonth(mes, anio)));
  };

  const elegirAnio = (year: number) => {
    setSelectedYear(year);
    setSelectedDay((d) => Math.min(d, getDaysInMonth(selectedMonth, year)));
    setModo('dia');
  };

  useEffect(() => {
    if (modo === 'anio') {
      const indice = effectiveMaxYear - selectedYear;
      const fila = Math.floor(indice / 3);
      const alturaFila = 52;
      requestAnimationFrame(() => {
        yearScrollRef.current?.scrollTo({ y: Math.max(0, fila * alturaFila - 80), animated: false });
      });
    }
  }, [modo]);

  const handleSelectDate = () => {
    if (effectiveValidateAdult) {
      const age = calculateAge(selectedDay, selectedMonth, selectedYear);
      if (age < 18) {
        const err = 'Debes tener al menos 18 años para registrarte.';
        setError(err);
        onDateError?.(err);
        return;
      }
    }

    setError(null);
    onDateError?.(null);

    const formattedDate = `${String(selectedDay).padStart(2, '0')}/${String(selectedMonth + 1).padStart(2, '0')}/${selectedYear}`;
    onChangeText(formattedDate);
    setShowCalendar(false);
  };

  const abrirCalendario = () => {
    setModo('dia');
    setShowCalendar(true);
  };

  const primerDiaSemana = new Date(selectedYear, selectedMonth, 1).getDay();
  const diasDelMes = getDaysInMonth(selectedMonth, selectedYear);
  const fechaPreview = new Date(selectedYear, selectedMonth, selectedDay).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.input} onPress={abrirCalendario}>
        <Ionicons name="calendar" size={20} color={colors.primary} />
        <Text style={[styles.inputText, !value && styles.placeholder]}>{value || placeholder}</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal visible={showCalendar} transparent animationType="fade" onRequestClose={() => setShowCalendar(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setShowCalendar(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.calendarModal, modo === 'anio' && styles.calendarModalAnio]}
          >
            <View style={styles.previewHeader}>
              <Text style={styles.previewText}>{fechaPreview}</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)} style={styles.closeButton}>
                <Ionicons name="close" size={22} color={colors.white} />
              </TouchableOpacity>
            </View>

            {modo === 'dia' ? (
              <>
                <View style={styles.monthNav}>
                  <TouchableOpacity onPress={() => cambiarMes(-1)} style={styles.navArrow}>
                    <Ionicons name="chevron-back" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.monthYearButton} onPress={() => setModo('anio')}>
                    <Text style={styles.monthYearText}>
                      {MONTHS[selectedMonth]} {selectedYear}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => cambiarMes(1)} style={styles.navArrow}>
                    <Ionicons name="chevron-forward" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.weekRow}>
                  {DIAS_SEMANA.map((d) => (
                    <Text key={d} style={styles.weekDayText}>
                      {d}
                    </Text>
                  ))}
                </View>

                <View style={styles.daysGrid}>
                  {Array.from({ length: primerDiaSemana }).map((_, i) => (
                    <View key={`vacio-${i}`} style={styles.dayCell} />
                  ))}
                  {Array.from({ length: diasDelMes }).map((_, i) => {
                    const day = i + 1;
                    return (
                      <TouchableOpacity
                        key={day}
                        style={[styles.dayCell, selectedDay === day && styles.dayCellActive]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[styles.dayCellText, selectedDay === day && styles.dayCellTextActive]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              <View style={styles.yearPickerWrap}>
                <Text style={styles.sectionLabel}>Selecciona el año</Text>
                <ScrollView ref={yearScrollRef} style={styles.yearGridScroll}>
                  <View style={styles.yearGrid}>
                    {Array.from({ length: effectiveMaxYear - effectiveMinYear + 1 }).map((_, i) => {
                      const year = effectiveMaxYear - i;
                      return (
                        <TouchableOpacity
                          key={year}
                          style={[styles.yearGridItem, selectedYear === year && styles.yearItemActive]}
                          onPress={() => elegirAnio(year)}
                        >
                          <Text style={[styles.yearText, selectedYear === year && styles.yearTextActive]}>
                            {year}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => setShowCalendar(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonConfirm]} onPress={handleSelectDate}>
                <Text style={[styles.buttonText, styles.buttonTextWhite]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  input: {
    height: 52,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.text,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  inputText: {
    flex: 1,
    color: colors.text,
  },
  placeholder: {
    color: colors.textMuted,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBE6E4',
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '500',
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    width: '90%',
    maxHeight: '85%',
    maxWidth: 420,
    overflow: 'hidden',
  },
  // En Android, "flex: 1" dentro de un contenedor con solo maxHeight (sin
  // height definida) no siempre reserva espacio para el ScrollView de años
  // (a diferencia de web). Al fijar una altura concreta en este modo, el
  // ScrollView interno queda correctamente acotado y puede desplazarse.
  calendarModalAnio: {
    height: '85%',
  },
  previewHeader: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  previewText: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  navArrow: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  monthYearText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  weekDayText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellActive: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  dayCellText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  dayCellTextActive: {
    color: colors.white,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  yearPickerWrap: {
    flex: 1,
  },
  yearGridScroll: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  yearGridItem: {
    width: '30%',
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  yearItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  yearText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  yearTextActive: {
    color: colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonConfirm: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  buttonTextWhite: {
    color: colors.white,
  },
});
