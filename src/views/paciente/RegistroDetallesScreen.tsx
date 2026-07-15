import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme/theme';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { useRegistroDetallesViewModel } from '../../viewmodels/useRegistroDetallesViewModel';

export default function RegistroDetallesScreen() {
  const vm = useRegistroDetallesViewModel();

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerBg}>
        <TouchableOpacity style={styles.back} onPress={vm.goBack}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Ionicons name="location" size={40} color={colors.white} />
        <Text style={styles.brand}>UTOPÍA</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.phoneCard}>
          <View style={styles.card}>
            <Text style={styles.title}>Tu perfil médico</Text>
            <Text style={styles.subtitle}>
              Completa tu dirección, seguro médico, tipo de sangre y alergias.
            </Text>

            {/* SECCIÓN: DIRECCIÓN */}
            <Text style={styles.sectionLabel}>Dirección</Text>
            <TextField
              label="Calle"
              placeholder="Ingresa el nombre de la calle"
              value={vm.calle}
              onChangeText={vm.setCalle}
            />
            <TextField
              label="Número"
              placeholder="Número de casa/edificio"
              value={vm.numero}
              onChangeText={vm.setNumero}
            />
            <TextField
              label="Colonia"
              placeholder="Colonia (opcional)"
              value={vm.colonia}
              onChangeText={vm.setColonia}
            />
            <TextField
              label="Localidad"
              placeholder="Localidad (opcional)"
              value={vm.localidad}
              onChangeText={vm.setLocalidad}
            />
            <TextField
              label="Municipio"
              placeholder="Municipio/Delegación"
              value={vm.municipio}
              onChangeText={vm.setMunicipio}
            />
            <TextField
              label="Estado"
              placeholder="Estado/Provincia"
              value={vm.estado}
              onChangeText={vm.setEstado}
            />
            <TextField
              label="Código postal"
              placeholder="Código postal"
              value={vm.codigoPostal}
              onChangeText={vm.setCodigoPostal}
              keyboardType="numeric"
            />
            <TextField
              label="Seguro médico"
              placeholder="Número de póliza (opcional)"
              value={vm.seguroMedico}
              onChangeText={vm.setSeguroMedico}
            />

            <Text style={styles.sectionLabel}>Tipo de sangre</Text>
            <View style={styles.dropdownContainer}>
              {vm.bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.bloodOption,
                    vm.sangre === type && styles.bloodOptionActive,
                  ]}
                  onPress={() => vm.setSangre(type)}
                >
                  <Text
                    style={[
                      styles.bloodText,
                      vm.sangre === type && styles.bloodTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SECCIÓN: ALERGIAS */}
            <Text style={styles.sectionLabel}>Alergias</Text>
            <TextInput
              value={vm.search}
              onChangeText={vm.setSearch}
              style={styles.input}
              placeholder="Busca alergias"
              placeholderTextColor={colors.textMuted}
            />

            <View style={styles.selectedRow}>
              {vm.selectedAlergias.map((alergia) => (
                <View key={alergia} style={styles.chip}>
                  <Text style={styles.chipText}>{alergia}</Text>
                  <TouchableOpacity
                    onPress={() => vm.removeAllergy(alergia)}
                    style={styles.chipClose}
                  >
                    <Text style={styles.chipCloseText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {vm.suggestions.length > 0 && (
              <View style={styles.suggestionsCard}>
                {vm.suggestions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.suggestionItem}
                    onPress={() => vm.addAllergy(item)}
                  >
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Button title="Continuar" onPress={vm.continuar} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  headerBg: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: spacing.xl * 1.4,
    paddingBottom: spacing.xl * 1.6,
  },
  back: {
    position: 'absolute',
    top: spacing.xl * 1.4,
    left: spacing.md,
    zIndex: 2,
  },
  brand: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: spacing.xl * 2,
  },
  phoneCard: {
    width: '90%',
    maxWidth: 420,
    marginTop: -30,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  input: {
    minHeight: 52,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.md,
  },
  dropdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bloodOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  bloodOptionActive: {
    borderColor: colors.primary,
    backgroundColor: '#E4F2EE',
  },
  bloodText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  bloodTextActive: {
    color: colors.primary,
  },
  selectedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: '#E4F2EE',
    borderWidth: 1,
    borderColor: '#C1DDD8',
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    marginRight: spacing.sm,
    fontWeight: '500',
  },
  chipClose: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D6F0FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCloseText: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  suggestionsCard: {
    borderRadius: radius.md,
    backgroundColor: '#F7FBFA',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  suggestionItem: {
    paddingVertical: spacing.sm,
  },
  suggestionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});
