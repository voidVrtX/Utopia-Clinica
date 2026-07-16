import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { colors, radius, spacing } from '../../theme/theme';
import Button from '../../components/Button';
import { AvisosController } from '../../controllers/AvisosController';

export default function AvisoGeneralAdminScreen({ navigation }: any) {
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    if (!mensaje.trim()) return;
    setEnviando(true);
    await AvisosController.crear({
      paraUserId: 'admin',
      tipo: 'Recordatorio',
      titulo: 'Aviso general',
      detalle: mensaje,
      fechaISO: new Date().toISOString().slice(0, 10),
    });
    setEnviando(false);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <View style={styles.confirmContainer}>
        <Image source={require('../../../assets/reemplazar_medikit.png')} style={styles.brandLogo} />
        <Text style={styles.brand}>UTOPÍA</Text>
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitulo}>Reporte</Text>
          <View style={styles.iconCircle}>
            <Ionicons name="mail" size={34} color={colors.purple} />
          </View>
          <Text style={styles.confirmMsg}>
            Este reporte es un aviso general que se verán en los reportes y avisos para el administrador.
          </Text>
          <Button title="Aceptar" onPress={() => navigation.goBack()} style={{ backgroundColor: colors.purple, width: '100%' }} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aviso general</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.label}>Mensaje para todos los usuarios</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Escribe el aviso general…"
          placeholderTextColor={colors.textMuted}
          multiline
          value={mensaje}
          onChangeText={setMensaje}
        />
        <Button title="Enviar aviso" onPress={enviar} loading={enviando} style={{ backgroundColor: colors.purple }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.purple, padding: spacing.md, paddingTop: spacing.lg },
  headerTitle: { color: colors.white, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  body: { padding: spacing.md },
  label: { fontWeight: '700', fontSize: 13, color: colors.text, marginBottom: spacing.sm },
  textarea: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12, minHeight: 120, textAlignVertical: 'top', backgroundColor: colors.white, color: colors.text, marginBottom: spacing.md },
  confirmContainer: { flex: 1, backgroundColor: colors.purple, alignItems: 'center', paddingTop: spacing.xl * 1.5, padding: spacing.lg },
  brand: { color: colors.white, fontSize: 22, fontWeight: '800', letterSpacing: 2, marginTop: spacing.sm, marginBottom: spacing.xl },
  brandLogo: { width: 44, height: 44, tintColor: colors.white },
  confirmCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, width: '100%', alignItems: 'center' },
  confirmTitulo: { color: colors.purple, fontWeight: '800', fontSize: 16, marginBottom: spacing.sm },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.purpleBg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  confirmMsg: { color: colors.text, fontSize: 13, textAlign: 'center', marginBottom: spacing.md },
});
