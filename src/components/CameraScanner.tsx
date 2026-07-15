import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
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
  const [previewActivo, setPreviewActivo] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const listenerRef = useRef<any>(null);

  const stopScanner = async () => {
    listenerRef.current?.remove?.();
    listenerRef.current = null;
    setScannerActivo(false);
    setPreviewActivo(false);
    setIsLaunching(false);
    if (CameraView.isModernBarcodeScannerAvailable) {
      await CameraView.dismissScanner().catch(() => null);
    }
  };

  const handleScanResult = async (data: string) => {
    if (!activo) return;
    onEscaneado(data);
    await stopScanner();
  };

  const iniciarEscaner = async () => {
    setCameraError(null);
    setIsLaunching(true);

    const granted = await solicitarPermiso();
    setIsLaunching(false);
    if (!granted) {
      return;
    }

    const supportsModern = CameraView.isModernBarcodeScannerAvailable && Platform.OS !== 'web';
    if (supportsModern) {
      try {
        listenerRef.current?.remove?.();
        listenerRef.current = CameraView.onModernBarcodeScanned(({ data }) => {
          handleScanResult(data);
        });
        setScannerActivo(true);
        await CameraView.launchScanner({ barcodeTypes: ['qr'] });
        return;
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
    }

    setPreviewActivo(true);
    setScannerActivo(true);
  };

  useEffect(() => {
    if (estado === 'indeterminado') {
      iniciarEscaner();
      return;
    }

    if (estado === 'concedido' && !scannerActivo) {
      iniciarEscaner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  useEffect(() => {
    return () => {
      listenerRef.current?.remove?.();
      setScannerActivo(false);
    };
  }, []);

  if (estado === 'cargando') {
    return <View style={styles.center} />;
  }

  if (estado === 'denegado') {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={48} color={colors.textMuted} />
        <Text style={styles.msg}>Utopía necesita acceso a la cámara para escanear recetas.</Text>
        <Button
          title={puedeVolverAPreguntar ? 'Permitir cámara' : 'Abrir configuración'}
          onPress={puedeVolverAPreguntar ? iniciarEscaner : abrirConfiguracion}
          loading={isLaunching}
        />
      </View>
    );
  }

  if (!scannerActivo) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={48} color={colors.textMuted} />
        <Text style={styles.msg}>Presiona para permitir el uso de la cámara y comenzar a escanear.</Text>
        <Button title="Iniciar escáner" onPress={iniciarEscaner} loading={isLaunching} />
        {cameraError ? <Text style={styles.errorText}>{cameraError}</Text> : null}
      </View>
    );
  }

  if (previewActivo) {
    return (
      <View style={styles.wrap}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={({ data }) => handleScanResult(data)}
          barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
        />
        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.frame} />
          <Text style={styles.hint}>Apunta el QR al centro de la cámara.</Text>
          {cameraError ? <Text style={styles.errorText}>{cameraError}</Text> : null}
        </View>
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
  camera: { ...StyleSheet.absoluteFillObject, flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  msg: { color: colors.textMuted, textAlign: 'center', marginBottom: spacing.sm },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 220, height: 220, borderWidth: 3, borderColor: colors.white, borderRadius: radius.md },
  hint: { color: colors.white, marginTop: spacing.md, fontWeight: '600' },
  errorText: { color: colors.danger, marginTop: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.lg },
});