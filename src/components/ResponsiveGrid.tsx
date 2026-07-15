import React from 'react';
import { View } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

/**
 * Convierte una lista de tarjetas apiladas en una cuadrícula de varias
 * columnas cuando hay espacio (web ancho). En móvil (o web angosto) se
 * queda igual que antes: una sola columna apilada.
 */
export default function ResponsiveGrid({
  children,
  gap = 12,
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  const { columns } = useResponsive();

  if (columns <= 1) {
    return <>{children}</>;
  }

  const items = React.Children.toArray(children);
  const itemStyle = {
    width: `calc(${100 / columns}% - ${(gap * (columns - 1)) / columns}px)`,
  } as any;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap } as any}>
      {items.map((child, i) => (
        <View key={i} style={itemStyle}>
          {child}
        </View>
      ))}
    </View>
  );
}
