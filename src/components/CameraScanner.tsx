import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';
import { useCameraPermission } from '../hooks/useCameraPermission';
import Button from './Button';

export default function CameraScanner({
  onEscaneado,
  activo = true,
}: {
  onEscaneado: (data: string) => void;
  activo?: boolean;
}) {
  const { estado, puedeVolverAPreguntar, solicitarPermiso, abrirConfiguracion } = useCameraPermission();
  const yaLeido = useRef(false);

  useEffect(() => {
    if (estado === 'indeterminado') {
      solicitarPermiso();
    }
    // Solo se solicita una vez al detectar que aún no se ha resuelto el permiso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  if (estado === 'cargando' || estado === 'indeterminado') {
    return <View style={styles.center} />;
  }

  if (estado === 'denegado') {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={48} color={colors.textMuted} />
        <Text style={styles.msg}>Utopía necesita acceso a la cámara para escanear recetas.</Text>
        <Button
          title={puedeVolverAPreguntar ? 'Permitir cámara' : 'Abrir configuración'}
          onPress={puedeVolverAPreguntar ? solicitarPermiso : abrirConfiguracion}
        />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={
          activo
            ? ({ data }) => {
                if (yaLeido.current) return;
                yaLeido.current = true;
                onEscaneado(data);
                setTimeout(() => {
                  yaLeido.current = false;
                }, 1500);
              }
            : undefined
        }
      />
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.hint}>Encuadra el código QR de la receta</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, overflow: 'hidden', borderRadius: radius.md, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  msg: { color: colors.textMuted, textAlign: 'center', marginBottom: spacing.sm },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 220, height: 220, borderWidth: 3, borderColor: colors.white, borderRadius: radius.md },
  hint: { color: colors.white, marginTop: spacing.md, fontWeight: '600' },
});
