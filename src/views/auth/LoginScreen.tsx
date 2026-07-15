import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { useLoginViewModel } from '../../viewmodels/useLoginViewModel';

export default function LoginScreen({ navigation }: any) {
  const { email, setEmail, password, setPassword, error, cargando, submit } = useLoginViewModel();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Ionicons name="medkit" size={46} color={colors.white} />
        <Text style={styles.brand}>UTOPÍA</Text>
        <Text style={styles.brandSub}>CLÍNICA MÉDICA</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <ResponsiveContainer maxWidth={480}>
        <View style={styles.card}>
          <Text style={styles.title}>¿Ya tienes cuenta?</Text>
          <Text style={styles.subtitle}>Inicia sesión</Text>
          <TextField
            label="Correo electrónico"
            placeholder="Ingresa tu correo electrónico"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Iniciar sesión" onPress={submit} loading={cargando} />
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <Text style={styles.link} onPress={() => navigation.navigate('RegisterStep1')}>
              Regístrate aquí
            </Text>
          </View>
        </View>
        <Text style={styles.hint}>
          Pacientes, médicos, administración y farmacia inician sesión desde esta misma pantalla.
        </Text>
        </ResponsiveContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, alignItems: 'center', paddingTop: spacing.xl * 1.6, paddingBottom: spacing.xl * 2 },
  brand: { color: colors.white, fontSize: 28, fontWeight: '800', letterSpacing: 3, marginTop: spacing.sm },
  brandSub: { color: colors.white, fontSize: 10, letterSpacing: 3, marginTop: 2 },
  body: { flexGrow: 1, backgroundColor: colors.background, padding: spacing.lg, marginTop: -40 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, ...{ shadowOpacity: 0.08 } },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  error: { color: colors.danger, fontSize: 12.5, marginBottom: spacing.sm },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
  footerText: { color: colors.textMuted, fontSize: 13 },
  link: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  hint: { textAlign: 'center', color: colors.textMuted, fontSize: 11.5, marginTop: spacing.lg, paddingHorizontal: spacing.md },
});
