import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/theme';
import { MedicamentoCatalogo } from '../models/Medicamento';
import { MedicamentosController } from '../controllers/MedicamentosController';

interface Props {
  value: string;
  onChangeValue: (value: string) => void;
  onSelectCatalogo: (item: MedicamentoCatalogo) => void;
  placeholder?: string;
}

export default function MedicamentoPicker({ value, onChangeValue, onSelectCatalogo, placeholder }: Props) {
  const [query, setQuery] = useState(value);
  const [resultados, setResultados] = useState<MedicamentoCatalogo[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let active = true;
    const buscar = async () => {
      setCargando(true);
      const lista = await MedicamentosController.buscar(query);
      if (active) {
        setResultados(lista);
        setCargando(false);
      }
    };

    if (query.trim().length >= 2) {
      buscar();
    } else {
      setResultados([]);
    }

    return () => {
      active = false;
    };
  }, [query]);

  const displayValue = useMemo(() => (value ? value : query), [query, value]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder ?? 'Nombre del medicamento'}
        placeholderTextColor={colors.textMuted}
        value={displayValue}
        onChangeText={(text) => {
          setQuery(text);
          onChangeValue(text);
        }}
        style={styles.input}
      />
      {cargando && <Text style={styles.loading}>Buscando...</Text>}
      {resultados.length > 0 ? (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable style={styles.suggestion} onPress={() => onSelectCatalogo(item)}>
              <Text style={styles.suggestionText}>{item.nombre}</Text>
              {item.presentacion ? <Text style={styles.suggestionSub}>{item.presentacion}</Text> : null}
            </Pressable>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
  },
  loading: { marginTop: spacing.xs, color: colors.textMuted, fontSize: 12 },
  list: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestion: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: { color: colors.text, fontWeight: '600' },
  suggestionSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
