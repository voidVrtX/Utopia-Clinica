import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { colors, radius, spacing } from '../theme/theme';
import { useCameraPermission } from '../hooks/useCameraPermission';

interface DocumentScannerProps {
  label?: string;
  onCapture: (photoUri: string) => void;
  documentType?: 'cedula' | 'licencia' | 'certificado' | 'diploma' | 'cedula_profesional';
  onCancel?: () => void;
}

export default function DocumentScanner({
  label = 'Capturar documento',
  onCapture,
  documentType = 'cedula',
  onCancel,
}: DocumentScannerProps) {
  const { estado, puedeVolverAPreguntar, solicitarPermiso, abrirConfiguracion } = useCameraPermission();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const getDocumentTypeLabel = () => {
    switch (documentType) {
      case 'cedula':
        return 'Cédula de Identidad';
      case 'licencia':
        return 'Licencia de Conducción';
      case 'certificado':
        return 'Certificado Académico';
      case 'diploma':
        return 'Diploma';
      case 'cedula_profesional':
        return 'Cédula Profesional';
      default:
        return 'Documento';
    }
  };

  const handleCameraPermission = async () => {
    if (estado === 'concedido') {
      setIsCameraActive(true);
      return;
    }
    const granted = await solicitarPermiso();
    if (granted) {
      setIsCameraActive(true);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setCapturedPhoto(photo.uri);
        setIsCameraActive(false);
      } catch (error) {
        console.error('Error capturing photo:', error);
        alert('Error al capturar la foto');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      setCapturedPhoto(null);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setIsCameraActive(true);
  };

  const handleCancel = () => {
    setCapturedPhoto(null);
    setIsCameraActive(false);
    onCancel?.();
  };

  if (estado === 'cargando') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (estado === 'denegado') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.deniedBox}>
          <Ionicons name="camera" size={32} color={colors.danger} />
          <Text style={styles.deniedText}>
            Se necesita permiso de cámara para capturar {getDocumentTypeLabel().toLowerCase()}.
          </Text>
          <TouchableOpacity
            style={styles.deniedButton}
            onPress={puedeVolverAPreguntar ? handleCameraPermission : abrirConfiguracion}
          >
            <Text style={styles.deniedButtonText}>
              {puedeVolverAPreguntar ? 'Solicitar permiso' : 'Abrir configuración'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isCameraActive && !capturedPhoto) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        >
          <View style={styles.cameraOverlay}>
            {/* Guía visual para documento */}
            <View style={styles.documentFrame}>
              <Text style={styles.frameLabel}>{getDocumentTypeLabel()}</Text>
            </View>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={isProcessing}
              >
                <Ionicons name="close" size={24} color={colors.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
                onPress={takePicture}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Ionicons name="camera" size={32} color={colors.white} />
                )}
              </TouchableOpacity>

              <View style={styles.placeholder} />
            </View>

            <Text style={styles.hint}>
              Posiciona el documento dentro del marco y presiona capturar
            </Text>
          </View>
        </CameraView>
      </View>
    );
  }

  if (capturedPhoto) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />

        <View style={styles.previewOverlay}>
          <Text style={styles.previewLabel}>{getDocumentTypeLabel()}</Text>

          <View style={styles.previewButtons}>
            <TouchableOpacity
              style={[styles.previewButton, styles.previewButtonCancel]}
              onPress={handleRetake}
            >
              <Ionicons name="reload" size={20} color={colors.white} />
              <Text style={styles.previewButtonText}>Retomar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewButton, styles.previewButtonConfirm]}
              onPress={handleConfirmPhoto}
            >
              <Ionicons name="checkmark" size={20} color={colors.white} />
              <Text style={styles.previewButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.uploadBox}
        onPress={handleCameraPermission}
      >
        <View style={styles.uploadIcon}>
          <Ionicons name="camera" size={48} color={colors.primary} />
        </View>
        <Text style={styles.uploadTitle}>{getDocumentTypeLabel()}</Text>
        <Text style={styles.uploadSubtitle}>
          Toca para capturar con la cámara
        </Text>
        <View style={styles.uploadHintRow}>
          <Ionicons name="camera-outline" size={13} color={colors.textMuted} />
          <Text style={styles.uploadHint}>
            Asegúrate que el documento esté bien iluminado y visible
          </Text>
        </View>
      </TouchableOpacity>
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
  deniedBox: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  deniedText: {
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
  },
  deniedButton: {
    marginTop: spacing.xs,
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  deniedButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  uploadBox: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  uploadIcon: {
    marginBottom: spacing.md,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  uploadHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  uploadHint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.text,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  documentFrame: {
    alignSelf: 'center',
    width: '80%',
    aspectRatio: 16 / 9,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  frameLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
  },
  cancelButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DC4D3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  placeholder: {
    width: 56,
    height: 56,
  },
  hint: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  previewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.text,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: spacing.lg,
  },
  previewLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  previewButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  previewButtonCancel: {
    backgroundColor: '#DC4D3C',
  },
  previewButtonConfirm: {
    backgroundColor: colors.primary,
  },
  previewButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
