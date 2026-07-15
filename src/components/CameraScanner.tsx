import React, { useEffect, useRef, useState } from 'react';
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
  const [scannerActivo, setScannerActivo] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const listenerRef = useRef<any>(null);

  const iniciarEscaner = async () => {
    setCameraError(null);

    if (!CameraView.isModernBarcodeScannerAvailable) {
      setCameraError('El escáner moderno no está disponible en este dispositivo.');
      return;
    }

    try {
      listenerRef.current = CameraView.onModernBarcodeScanned(({ data }) => {
        if (!activo) return;
        onEscaneado(data);
      });
      setScannerActivo(true);
      await CameraView.launchScanner({ barcodeTypes: ['qr'] });
    } catch (error: any) {
      console.log('[CAMERA] MODERN SCANNER ERROR:', error?.message ?? error);
      setCameraError(
        error?.message
          ? `No se pudo iniciar el escáner: ${error.message}`
          : 'No se pudo iniciar el escáner QR.'
      );
      setScannerActivo(false);
      listenerRef.current?.remove?.();
    }
  };

  useEffect(() => {
    if (estado === 'indeterminado') {
      solicitarPermiso();
      return;
    }

    if (estado === 'concedido' && activo && !scannerActivo) {
      iniciarEscaner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, activo]);

  useEffect(() => {
    return () => {
      listenerRef.current?.remove?.();
      setScannerActivo(false);
    };
  }, []);

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
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.hint}>Escáner QR activo. Apunta el código al centro.</Text>
        {cameraError ? <Text style={styles.errorText}>{cameraError}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#000' },
  camera: { borderRadius: radius.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  msg: { color: colors.textMuted, textAlign: 'center', marginBottom: spacing.sm },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 220, height: 220, borderWidth: 3, borderColor: colors.white, borderRadius: radius.md },
  hint: { color: colors.white, marginTop: spacing.md, fontWeight: '600' },
  errorText: { color: colors.danger, marginTop: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.lg },
});