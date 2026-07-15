import React from 'react';
import { View, ViewProps } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveContainerProps extends ViewProps {
  /** Ancho máximo en web. Por defecto usa el ancho de contenido estándar
   * (listas/dashboards); pásale uno menor (ej. 560) para formularios. */
  maxWidth?: number;
}

/**
 * Centra el contenido dentro de un ancho máximo legible en web (para no
 * estirar tarjetas/formularios a lo ancho de un monitor), sin afectar el
 * layout en móvil (donde ya usa el ancho completo de la pantalla).
 */
export default function ResponsiveContainer({ style, children, maxWidth, ...rest }: ResponsiveContainerProps) {
  const { isWeb, contentMaxWidth } = useResponsive();
  return (
    <View
      style={[isWeb ? { width: '100%', maxWidth: maxWidth ?? contentMaxWidth, alignSelf: 'center' } : null, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
