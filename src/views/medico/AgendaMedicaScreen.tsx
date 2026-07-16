import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';

type Props = {
  selectedISO: string;
  onSelect: (iso: string) => void;
};

const DIAS_CORTOS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function startOfWeek(d: Date) {
  const date = new Date(d);
  date.setDate(date.getDate() - date.getDay());
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number) {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

function addMonths(d: Date, n: number) {
  const date = new Date(d);
  date.setMonth(date.getMonth() + n);
  return date;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function WeekStrip({ selectedISO, onSelect }: Props) {
  const selectedDate = useMemo(() => fromISO(selectedISO), [selectedISO]);
  const [modo, setModo] = useState<'semana' | 'mes'>('semana');
  const [refDate, setRefDate] = useState<Date>(selectedDate);
  const hoy = new Date();

  const inicioSemana = startOfWeek(refDate);
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));
  const irSemanaAnterior = () => setRefDate(addDays(inicioSemana, -7));
  const irSemanaSiguiente = () => setRefDate(addDays(inicioSemana, 7));

  const inicioMes = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
  const inicioGridMes = startOfWeek(inicioMes);
  const diasMes = Array.from({ length: 42 }, (_, i) => addDays(inicioGridMes, i));
  const irMesAnterior = () => setRefDate(addMonths(inicioMes, -1));
  const irMesSiguiente = () => setRefDate(addMonths(inicioMes, 1));

  const seleccionar = (d: Date) => {
    onSelect(toISO(d));
    setRefDate(d);
    if (modo === 'mes') setModo('semana');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={modo === 'semana' ? irSemanaAnterior : irMesAnterior} hitSlop={10}>
          <Text style={styles.flecha}>‹</Text>
        </Pressable>
        <Pressable onPress={() => setModo(modo === 'semana' ? 'mes' : 'semana')} style={styles.tituloBtn}>
          <Text style={styles.titulo}>{MESES[refDate.getMonth()]} {refDate.getFullYear()}</Text>
          <Text style={styles.subtitulo}>{modo === 'semana' ? 'Ver mes ▾' : 'Ver semana ▴'}</Text>
        </Pressable>
        <Pressable onPress={modo === 'semana' ? irSemanaSiguiente : irMesSiguiente} hitSlop={10}>
          <Text style={styles.flecha}>›</Text>
        </Pressable>
      </View>

      {modo === 'semana' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.semanaRow}>
          {diasSemana.map((d) => {
            const seleccionado = isSameDay(d, selectedDate);
            const esHoy = isSameDay(d, hoy);
            return (
              <Pressable key={toISO(d)} onPress={() => seleccionar(d)} style={[styles.diaSemana, seleccionado && styles.diaSeleccionado]}>
                <Text style={[styles.diaLetra, seleccionado && styles.textoSeleccionado]}>{DIAS_CORTOS[d.getDay()]}</Text>
                <Text style={[styles.diaNumero, seleccionado && styles.textoSeleccionado, esHoy && !seleccionado && styles.textoHoy]}>
                  {d.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View>
          <View style={styles.diasCortosRow}>
            {DIAS_CORTOS.map((d, i) => <Text key={i} style={styles.diaCortoMes}>{d}</Text>)}
          </View>
          <View style={styles.mesGrid}>
            {diasMes.map((d) => {
              const seleccionado = isSameDay(d, selectedDate);
              const esHoy = isSameDay(d, hoy);
              const delMes = d.getMonth() === refDate.getMonth();
              return (
                <Pressable key={toISO(d)} onPress={() => seleccionar(d)} style={styles.diaMesCelda}>
                  <View style={[styles.diaMesCirculo, seleccionado && styles.diaSeleccionado]}>
                    <Text style={[styles.diaMesTexto, !delMes && styles.diaMesTextoFuera, seleccionado && styles.textoSeleccionado, esHoy && !seleccionado && styles.textoHoy]}>
                      {d.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const DIA_SIZE = 40;
const styles = StyleSheet.create({
  container: { backgroundColor: colors.card, paddingVertical: spacing.sm, marginHorizontal: spacing.md, borderRadius: radius.md, ...shadow },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, marginBottom: spacing.xs },
  flecha: { fontSize: 22, color: colors.primary, fontWeight: '700', paddingHorizontal: spacing.xs },
  tituloBtn: { alignItems: 'center' },
  titulo: { fontWeight: '800', fontSize: 14, color: colors.text, textTransform: 'capitalize' },
  subtitulo: { fontSize: 10.5, color: colors.textMuted },
  semanaRow: { paddingHorizontal: spacing.sm },
  diaSemana: { width: DIA_SIZE, height: DIA_SIZE + 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, borderRadius: radius.md },
  diaSeleccionado: { backgroundColor: colors.primary },
  diaLetra: { fontSize: 10.5, color: colors.textMuted, fontWeight: '600' },
  diaNumero: { fontSize: 15, color: colors.text, fontWeight: '700', marginTop: 2 },
  textoSeleccionado: { color: colors.white },
  textoHoy: { color: colors.primary },
  diasCortosRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: spacing.sm, marginBottom: spacing.xs },
  diaCortoMes: { width: `${100/7}%`, textAlign: 'center', fontSize: 10.5, color: colors.textMuted, fontWeight: '600' },
  mesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.sm },
  diaMesCelda: { width: `${100/7}%`, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  diaMesCirculo: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  diaMesTexto: { fontSize: 13, color: colors.text, fontWeight: '600' },
  diaMesTextoFuera: { color: colors.textMuted, opacity: 0.4 },
});