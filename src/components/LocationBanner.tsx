import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { abrirRutaAClinica } from '../services/locationService';

export default function LocationBanner() {
  const [expandido, setExpandido] = useState(false);
  const {
    estadoPermiso,
    puedeVolverAPreguntar,
    ubicacion,
    actualizando,
    solicitarPermiso,
    abrirConfiguracion,
    actualizarAhora,
  } = useLocationTracking();

  const actualizada = estadoPermiso === 'concedido' && ubicacion !== null;
  const cargando = estadoPermiso === 'indeterminado' || estadoPermiso === 'solicitando';

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.header} onPress={() => setExpandido((v) => !v)}>
        <View style={styles.iconCircle}>
          <Ionicons name="location" size={16} color={colors.white} />
        </View>
        <Text style={styles.headerText}>Tu ubicación</Text>
        <View style={[styles.dot, { backgroundColor: actualizada ? colors.success : colors.disabled }]} />
        <Ionicons name={expandido ? 'chevron-up' : 'chevron-down'} size={16} color={colors.primaryDark} />
      </Pressable>

      {expandido && (
        <View style={styles.detail}>
          {cargando && (
            <View style={styles.row}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.text}>Obteniendo tu ubicación en tiempo real…</Text>
            </View>
          )}

          {estadoPermiso === 'denegado' && (
            <View>
              <Text style={styles.text}>
                No podemos acceder a tu ubicación. Actívala para ver qué tan lejos estás de Utopía Clínica.
              </Text>
              <Pressable
                style={styles.retry}
                onPress={puedeVolverAPreguntar ? solicitarPermiso : abrirConfiguracion}
              >
                <Text style={styles.retryText}>
                  {puedeVolverAPreguntar ? 'Solicitar permiso' : 'Abrir configuración'}
                </Text>
              </Pressable>
            </View>
          )}

          {actualizada && ubicacion && (
            <>
              <Text style={styles.text}>
                {ubicacion.direccion ? `${ubicacion.direccion}` : 'Dirección no disponible'}
                {ubicacion.codigoPostal ? `, CP ${ubicacion.codigoPostal}` : ''} · a{' '}
                <Text style={styles.bold}>{ubicacion.distanciaKm.toFixed(1)} km</Text> de Utopía Clínica
              </Text>
              <Text style={styles.meta}>
                Lat {ubicacion.latitud.toFixed(5)}, Lon {ubicacion.longitud.toFixed(5)}
              </Text>
              <Text style={styles.meta}>
                Última actualización:{' '}
                {ubicacion.actualizadoEn.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </Text>
              <View style={styles.actionsRow}>
                <Pressable style={styles.mapsButton} onPress={abrirRutaAClinica}>
                  <Ionicons name="navigate" size={16} color={colors.white} />
                  <Text style={styles.mapsButtonText}>Ir a Maps</Text>
                </Pressable>
                <Pressable style={styles.refreshButton} onPress={actualizarAhora} disabled={actualizando}>
                  {actualizando ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Ionicons name="refresh" size={16} color={colors.primary} />
                  )}
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, color: colors.primaryDark, fontSize: 12.5, fontWeight: '700' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  detail: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    gap: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  text: { color: colors.primaryDark, fontSize: 12.5, fontWeight: '600', flexShrink: 1 },
  meta: { color: colors.primaryDark, fontSize: 11, opacity: 0.8 },
  bold: { fontWeight: '800' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  refreshButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retry: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  retryText: { color: colors.white, fontSize: 11.5, fontWeight: '700' },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  mapsButtonText: { color: colors.white, fontSize: 12, fontWeight: '700' },
});
