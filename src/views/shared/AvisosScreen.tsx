import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import { useAvisosViewModel } from '../../viewmodels/useAvisosViewModel';
import { useSession } from '../../context/SessionContext';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import ResponsiveGrid from '../../components/ResponsiveGrid';

const ICONS: Record<string, any> = {
  'Cita Confirmada': 'checkmark-circle',
  Recordatorio: 'alarm',
  'Cita Modificada': 'create',
  'Cita Cancelada': 'close-circle',
  'Correo Enviado': 'mail',
  'Mantenimiento programado': 'construct',
};

export default function AvisosScreen({ navigation, route }: any) {
  const { usuario } = useSession();
  const userId = route?.params?.userId ?? usuario?.id ?? 'admin';
  const { avisosHoy, avisosAnteriores, cargando, limpiarTodo } = useAvisosViewModel(userId);

  const openAviso = (aviso: any) => {
    const parent = navigation.getParent();
    if (parent?.navigate) {
      parent.navigate('AvisoDetalle', { aviso });
      return;
    }
    navigation.navigate('AvisoDetalle', { aviso });
  };

  const renderCard = (aviso: any, faded = false) => (
    <Pressable key={aviso.id} onPress={() => openAviso(aviso)} style={({ pressed }) => [styles.card, faded ? styles.cardFaded : null, pressed ? styles.cardPressed : null]}>
      <Ionicons
        name={ICONS[aviso.tipo] ?? 'notifications'}
        size={20}
        color={faded ? colors.textMuted : colors.primary}
        style={{ marginRight: spacing.sm }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>{aviso.titulo}</Text>
        {aviso.detalle ? <Text style={styles.detalle}>{aviso.detalle}</Text> : null}
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avisos</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body}>
          <View style={styles.rowTop}>
            <Text style={styles.section}>Hoy</Text>
            <Pressable onPress={limpiarTodo}>
              <Text style={styles.limpiar}>Limpiar todo</Text>
            </Pressable>
          </View>
          {cargando ? (
            <Text style={styles.muted}>Cargando…</Text>
          ) : avisosHoy.length === 0 ? (
            <Text style={styles.muted}>Sin avisos por hoy.</Text>
          ) : (
            <ResponsiveGrid>{avisosHoy.map((aviso) => renderCard(aviso))}</ResponsiveGrid>
          )}

          {avisosAnteriores.length > 0 && (
            <>
              <Text style={[styles.section, { marginTop: spacing.md }]}>Anteriores</Text>
              <ResponsiveGrid>{avisosAnteriores.map((aviso) => renderCard(aviso, true))}</ResponsiveGrid>
            </>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  section: { fontWeight: '800', fontSize: 13, color: colors.textMuted },
  limpiar: { color: colors.primary, fontWeight: '700', fontSize: 12.5 },
  card: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow },
  cardFaded: { opacity: 0.55 },
  cardPressed: { opacity: 0.7 },
  titulo: { fontWeight: '700', fontSize: 13.5, color: colors.text },
  detalle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  muted: { color: colors.textMuted },
});
