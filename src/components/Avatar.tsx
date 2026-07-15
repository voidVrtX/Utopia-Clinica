import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';
import { initials } from '../utils/helpers';

export default function Avatar({ nombre, size = 44, light = false }: { nombre: string; size?: number; light?: boolean }) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: light ? colors.white : colors.primaryLight },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.36, color: light ? colors.primary : colors.primary }]}>
        {initials(nombre)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '800' },
});
