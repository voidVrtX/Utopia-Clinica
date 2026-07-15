import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Avatar from '../../components/Avatar';
import { useMedicoDetalleViewModel } from '../../viewmodels/useMedicosViewModel';

export default function MedicoIndividualScreen({ route, navigation }: any) {
  const { medicoId } = route.params;
  const { medico, cargando } = useMedicoDetalleViewModel(medicoId);

  if (cargando || !medico) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScreenHeader title="Médico" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Médico" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.headerRow}>
          <Avatar nombre={medico.nombre} size={60} />
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={styles.nombre}>{medico.nombre}</Text>
            <Text style={styles.sub}>
              {medico.fechaNacimiento ? `${medico.fechaNacimiento} · ` : ''}
              {medico.sexo ?? ''}
            </Text>
            {medico.telefono ? <Text style={styles.sub}>Tel. {medico.telefono}</Text> : null}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información profesional</Text>
          <Row label="Especialidad" value={medico.especialidad} />
          <Row label="Institución" value={medico.institucion ?? '—'} />
          <Row label="Años de experiencia" value={medico.aniosExperiencia ?? '—'} />
        </View>

        {medico.sobreElMedico ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sobre el médico</Text>
            <Text style={styles.text}>{medico.sobreElMedico}</Text>
          </View>
        ) : null}

        {medico.areasEspecialidad?.length ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Áreas de especialidad</Text>
            <View style={styles.tagsRow}>
              {medico.areasEspecialidad.map((a) => (
                <View key={a} style={styles.tag}>
                  <Text style={styles.tagText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {medico.ubicacionAtencion ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ubicación de atención</Text>
            <Text style={styles.text}>{medico.ubicacionAtencion}</Text>
          </View>
        ) : null}

        {medico.valoracion ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Valoración de pacientes</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.valoracion}>{medico.valoracion.toFixed(1)}</Text>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons key={i} name="star" size={14} color={colors.gold} />
              ))}
              <Text style={styles.sub}>({medico.numOpiniones} opiniones)</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={{ color: colors.textMuted, fontSize: 12.5 }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 12.5, fontWeight: '600' }}>{value}</Text>
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
  text: { color: colors.textMuted, fontSize: 12.5, lineHeight: 18 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  tagText: { color: colors.primaryDark, fontSize: 12, fontWeight: '600' },
  valoracion: { fontWeight: '800', color: colors.text, fontSize: 14 },
});
