import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import CameraScanner from '../../components/CameraScanner';
import { useFarmaciaViewModel } from '../../viewmodels/useFarmaciaViewModel';

export default function EscanearRecetaScreen({ navigation }: any) {
  const vm = useFarmaciaViewModel();

  const onEscaneado = async (data: string) => {
    await vm.escanear(data);
    navigation.navigate('ConfirmarInvalidacion', { codigoQR: data });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ScreenHeader title="Escanear receta" onBack={() => navigation.goBack()} color={colors.primaryDark} />
      <View style={styles.body}>
        <CameraScanner onEscaneado={onEscaneado} />
      </View>
      <Text style={styles.hint}>Apunta la cámara al código QR de la receta del paciente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, margin: spacing.md },
  hint: { color: colors.white, textAlign: 'center', padding: spacing.md, opacity: 0.8 },
});
