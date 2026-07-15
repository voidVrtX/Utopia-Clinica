import { Platform, useWindowDimensions } from 'react-native';

export interface Responsive {
  /** Ancho de la ventana/viewport actual. */
  width: number;
  /** true solo en web (en móvil el layout no cambia). */
  isWeb: boolean;
  /** true cuando hay espacio de escritorio/tablet ancho (>= 760px) en web. */
  isWide: boolean;
  /** Columnas sugeridas para grids de tarjetas según el ancho disponible. */
  columns: number;
  /** Ancho máximo de contenido legible, centrado, para no estirar todo a pantalla completa. */
  contentMaxWidth: number;
}

/**
 * Punto único de breakpoints para toda la app. En móvil siempre se
 * comporta igual que antes (1 columna, sin ancho máximo); en web se
 * adapta al tamaño real de la ventana en vez de simular un teléfono.
 */
export function useResponsive(): Responsive {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const columns = !isWeb ? 1 : width >= 1200 ? 4 : width >= 900 ? 3 : width >= 640 ? 2 : 1;

  return {
    width,
    isWeb,
    isWide: isWeb && width >= 760,
    columns,
    contentMaxWidth: 1200,
  };
}
