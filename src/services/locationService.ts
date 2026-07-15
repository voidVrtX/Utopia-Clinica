import { Linking } from 'react-native';
import { CLINICA } from '../theme/theme';

/**
 * Abre la app de mapas del dispositivo (o el navegador si no hay una instalada)
 * con la ruta de direcciones ya lista hacia Utopía Clínica, lista para
 * presionar "Cómo llegar". Usa el enlace universal de Google Maps, que en
 * iOS/Android abre la app instalada y en su defecto cae al navegador.
 */
export function abrirRutaAClinica() {
  const destino = encodeURIComponent(CLINICA.direccion);
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=driving`;
  Linking.openURL(url);
}
