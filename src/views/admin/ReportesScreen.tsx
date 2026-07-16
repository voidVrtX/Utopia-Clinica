import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';

const REPORTES = [
  { key: 'citas', titulo: 'Reportes de citas', sub: 'Resumen de citas agregadas', color: colors.info, icon: 'calendar' },
  { key: 'pacientes', titulo: 'Reportes de pacientes', sub: 'Información de nuevos pacientes', color: colors.success, icon: 'people' },
  { key: 'medicos', titulo: 'Reporte de médicos', sub: 'Rendimiento y consultas', color: colors.gold, icon: 'medkit' },
  { key: 'cancelaciones', titulo: 'Reporte de cancelación', sub: 'Citas canceladas', color: colors.danger, icon: 'close-circle' },
  { key: 'avisos', titulo: 'Avisos', sub: 'Avisos importantes', color: colors.purple, icon: 'notifications' },
];

export default function ReportesScreen({ navigation }: any) {
  const [fechaActual, setFechaActual] = useState(new Date());

  const cambiarMes = (direccion: number) => {
    setFechaActual(prev => direccion > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const rangoTexto = format(fechaActual, 'MMMM yyyy', { locale: es });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reportes</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          
          <View style={styles.rangoBox}>
            <Pressable onPress={() => cambiarMes(-1)}>
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </Pressable>
            <Text style={styles.rangoText}>{rangoTexto.toUpperCase()}</Text>
            <Pressable onPress={() => cambiarMes(1)}>
              <Ionicons name="chevron-forward" size={18} color={colors.text} />
            </Pressable>
          </View>

          <Pressable style={styles.avisoGeneralBtn} onPress={() => navigation.navigate('AvisoGeneral')}>
            <Ionicons name="megaphone" size={18} color={colors.white} />
            <Text style={styles.avisoGeneralText}>Enviar aviso general</Text>
          </Pressable>

          <ResponsiveGrid>
            {REPORTES.map((r) => (
              <Pressable
                key={r.key}
                style={styles.card}
                onPress={() => {
                  const inicio = format(startOfMonth(fechaActual), 'yyyy-MM-dd');
                  const fin = format(endOfMonth(fechaActual), 'yyyy-MM-dd');
                  
                  r.key === 'avisos'
                    ? navigation.navigate('AvisosAdmin')
                    : navigation.navigate('ReporteDetalle', { 
                        tipo: r.key, 
                        titulo: r.titulo, 
                        color: r.color,
                        inicio,
                        fin 
                      });
                }}
              >
                <Ionicons name={r.icon as any} size={22} color={r.color} style={{ marginRight: spacing.sm }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.titulo}>{r.titulo}</Text>
                  <Text style={styles.sub}>{r.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </ResponsiveGrid>
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  rangoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 10, borderRadius: radius.sm, marginBottom: spacing.md, ...shadow },
  rangoText: { fontWeight: '700', fontSize: 13, color: colors.text, textTransform: 'capitalize' },
  avisoGeneralBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.purple, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.md },
  avisoGeneralText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  titulo: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 11.5 },
});