import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/theme';
import Button from './Button';
import { autenticarConHuella, hayHardwareBiometrico } from '../services/biometricService';
import { useSession } from '../context/SessionContext';

export default function BiometricPrompt() {
  const { mostrarPromptHuella, ultimoEmail, continuarConHuella, omitirHuella } = useSession();
  const [verificando, setVerificando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!mostrarPromptHuella) return null;

  const onUsarHuella = async () => {
    setErrorMsg(null);
    setVerificando(true);
    const soportado = await hayHardwareBiometrico();
    if (!soportado) {
      // en simuladores/dispositivos sin sensor, permitimos continuar igualmente
      const ok = await continuarConHuella();
      setVerificando(false);
      if (!ok) setErrorMsg('No se pudo reingresar. Inicia sesión manualmente.');
      return;
    }
    const exito = await autenticarConHuella('Ingresa con tu huella dactilar a Utopía');
    if (exito) {
      await continuarConHuella();
    } else {
      setErrorMsg('Huella no reconocida. Intenta de nuevo o inicia sesión con tu contraseña.');
    }
    setVerificando(false);
  };

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="finger-print" size={44} color={colors.primary} />
          </View>
          <Text style={styles.title}>¿Continuar con tu huella dactilar?</Text>
          <Text style={styles.sub}>
            Ingresarás a la última cuenta usada: {'\n'}
            <Text style={styles.email}>{ultimoEmail}</Text>
          </Text>
          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
          <Button title="Usar huella dactilar" onPress={onUsarHuella} loading={verificando} />
          <Button title="Iniciar sesión con otra cuenta" variant="ghost" onPress={omitirHuella} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(10,20,18,0.55)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, width: '100%', maxWidth: 380, alignItems: 'center' },
  iconCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { fontSize: 16, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 6 },
  sub: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.sm },
  email: { fontWeight: '700', color: colors.primary },
  error: { color: colors.danger, fontSize: 12.5, textAlign: 'center', marginBottom: spacing.sm },
});
