import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

/**
 * Desbloquea la orientación del dispositivo para que el giroscopio interno
 * pueda rotar la app libremente entre vertical y horizontal.
 */
export async function habilitarRotacionLibre() {
  try {
    await ScreenOrientation.unlockAsync();
  } catch {
    // en web no aplica
  }
}

export type Orientacion = 'portrait' | 'landscape';

/**
 * Hook responsivo: re-renderiza toda la vista que lo use cuando el
 * giroscopio detecta un cambio de posición del dispositivo.
 */
export function useOrientacion(): { orientacion: Orientacion; width: number; height: number } {
  const { width, height } = useWindowDimensions();
  const [orientacion, setOrientacion] = useState<Orientacion>(
    width >= height ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    setOrientacion(width >= height ? 'landscape' : 'portrait');
  }, [width, height]);

  return { orientacion, width, height };
}
