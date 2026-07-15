import * as LocalAuthentication from 'expo-local-authentication';

export async function hayHardwareBiometrico(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
}

export async function autenticarConHuella(mensaje = 'Ingresa con tu huella dactilar'): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: mensaje,
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar contraseña',
      disableDeviceFallback: false,
    });
    return result.success;
  } catch {
    return false;
  }
}
