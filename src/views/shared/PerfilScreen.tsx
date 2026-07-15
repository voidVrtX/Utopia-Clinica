import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { usePerfilViewModel } from '../../viewmodels/usePerfilViewModel';

export default function PerfilScreen({ navigation }: any) {
  const { usuario, editando, setEditando, guardando, guardar, logout } = usePerfilViewModel();
  const [direccion, setDireccion] = useState(usuario?.direccion ?? '');
  const [seguro, setSeguro] = useState(usuario?.seguroMedico ?? '');
  const [telefono, setTelefono] = useState(usuario?.telefono ?? '');

  if (!usuario) return null;

  const onGuardar = () => guardar({ direccion, seguroMedico: seguro, telefono });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Mi perfil"
        onBack={() => navigation.goBack()}
        right={
          !editando ? (
            <Pressable onPress={() => setEditando(true)}>
              <Ionicons name="create-outline" size={20} color={colors.white} />
            </Pressable>
          ) : null
        }
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ResponsiveContainer style={styles.body} maxWidth={560}>
        <View style={styles.headerRow}>
          <Avatar nombre={usuario.nombre} size={56} />
          <View style={{ marginLeft: spacing.sm }}>
            <Text style={styles.nombre}>{usuario.nombre}</Text>
            <Text style={styles.sub}>
              {usuario.fechaNacimiento ? `${usuario.fechaNacimiento} · ` : ''}
              {usuario.sexo ?? ''}
            </Text>
            <Text style={styles.sub}>Tel. {usuario.telefono ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información personal</Text>
          <Row label="Fecha de nacimiento" value={usuario.fechaNacimiento ?? '—'} />
          <Row label="Género" value={usuario.sexo ?? '—'} />
          {editando ? (
            <>
              <Field label="Dirección" value={direccion} onChangeText={setDireccion} />
              <Field label="Teléfono" value={telefono} onChangeText={setTelefono} />
              <Field label="Seguro médico" value={seguro} onChangeText={setSeguro} />
            </>
          ) : (
            <>
              <Row label="Dirección" value={usuario.direccion ?? '—'} />
              <Row label="Seguro médico" value={usuario.seguroMedico ?? '—'} />
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Opciones</Text>
          {editando ? (
            <Button title="Guardar cambios" onPress={onGuardar} loading={guardando} />
          ) : (
            <Button title="Cerrar sesión" variant="outline" onPress={logout} />
          )}
        </View>
        </ResponsiveContainer>
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.rowItem}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (v: string) => void }) {
  return (
    <View style={{ marginBottom: spacing.sm }}>
      <Text style={styles.rowLabel}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  nombre: { fontWeight: '800', fontSize: 16, color: colors.text },
  sub: { color: colors.textMuted, fontSize: 12 },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  cardTitle: { fontWeight: '800', fontSize: 13, color: colors.text, marginBottom: spacing.sm },
  rowItem: { marginBottom: spacing.sm },
  rowLabel: { color: colors.textMuted, fontSize: 11.5, marginBottom: 2 },
  rowValue: { color: colors.text, fontSize: 13.5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 10, color: colors.text },
});
