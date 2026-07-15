import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import EmailValidator from '../../components/EmailValidator';
import PasswordValidator from '../../components/PasswordValidator';
import ConfirmPasswordValidator from '../../components/ConfirmPasswordValidator';
import Button from '../../components/Button';
import PrivacyAgreement from '../../components/PrivacyAgreement';
import ScreenHeader from '../../components/ScreenHeader';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { useRegisterDraft } from '../../context/RegisterDraftContext';

export default function RegisterStep1Screen({ navigation }: any) {
  const { draft, update } = useRegisterDraft();
  const [error, setError] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const validatePassword = (password: string) => {
    const requirements = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;
    return metRequirements >= 4;
  };

  const continuar = () => {
    if (!emailValid) {
      setError('Ingresa un correo válido.');
      return;
    }
    if (!draft.password || !draft.confirmPassword) {
      setError('Completa los campos de contraseña.');
      return;
    }
    if (draft.password !== draft.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!validatePassword(draft.password)) {
      setError('La contraseña debe ser más fuerte. Verifica que cumpla con los requisitos.');
      return;
    }
    if (!privacyAccepted) {
      setError('Debes aceptar la política de privacidad para continuar.');
      return;
    }
    setError(null);
    navigation.navigate('RegisterStep2');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.headerBg}>
        <Ionicons name="arrow-back" size={22} color={colors.white} onPress={() => navigation.goBack()} style={styles.back} />
        <Ionicons name="medkit" size={40} color={colors.white} />
        <Text style={styles.brand}>UTOPÍA</Text>
        <Text style={styles.brandSub}>CLÍNICA MÉDICA</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <ResponsiveContainer maxWidth={480}>
        <View style={styles.card}>
          <Text style={styles.title}>¿Eres nuevo?</Text>
          <Text style={styles.subtitle}>Registra una nueva cuenta</Text>

          <EmailValidator
            label="Correo electrónico"
            value={draft.email}
            onChangeText={(v) => update({ email: v })}
            onValidChange={setEmailValid}
          />

          <PasswordValidator
            label="Contraseña"
            placeholder="Crea una contraseña segura"
            value={draft.password}
            onChangeText={(v) => update({ password: v })}
          />

          <ConfirmPasswordValidator
            label="Confirmar contraseña"
            placeholder="Confirma tu contraseña"
            value={draft.confirmPassword}
            passwordValue={draft.password}
            onChangeText={(v) => update({ confirmPassword: v })}
          />

          <PrivacyAgreement
            onAccept={() => setPrivacyAccepted(true)}
            onDecline={() => setPrivacyAccepted(false)}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title="Continuar"
            onPress={continuar}
            disabled={!emailValid || !privacyAccepted}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
              Inicia sesión aquí
            </Text>
          </View>
        </View>
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: { backgroundColor: colors.primary, alignItems: 'center', paddingTop: spacing.xl * 1.4, paddingBottom: spacing.xl * 1.6 },
  back: { position: 'absolute', top: spacing.xl * 1.4, left: spacing.md },
  brand: { color: colors.white, fontSize: 24, fontWeight: '800', letterSpacing: 2, marginTop: spacing.xs },
  brandSub: { color: colors.white, fontSize: 9, letterSpacing: 2, marginTop: 2 },
  body: { flexGrow: 1, padding: spacing.lg, marginTop: -30 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg },
  title: { fontSize: 17, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  error: { color: colors.danger, fontSize: 12.5, marginBottom: spacing.sm },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
  footerText: { color: colors.textMuted, fontSize: 13 },
  link: { color: colors.primary, fontWeight: '700', fontSize: 13 },
});
