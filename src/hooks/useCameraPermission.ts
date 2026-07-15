import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

export type EstadoPermisoCamara = 'cargando' | 'indeterminado' | 'concedido' | 'denegado';

export interface UseCameraPermissionResult {
  estado: EstadoPermisoCamara;
  concedido: boolean;
  puedeVolverAPreguntar: boolean;
  solicitarPermiso: () => Promise<boolean>;
  abrirConfiguracion: () => void;
}

/**
 * Envuelve expo-camera useCameraPermissions con nombres/estado consistentes
 * para que cualquier pantalla que capture fotos comparta la misma lógica
 * de solicitud y re-solicitud de permiso.
 */
export function useCameraPermission(): UseCameraPermissionResult {
  const [permission, requestPermission] = useCameraPermissions();

  const solicitarPermiso = useCallback(async () => {
    const res = await requestPermission();
    return res.granted;
  }, [requestPermission]);

  const abrirConfiguracion = useCallback(() => {
    Linking.openSettings();
  }, []);

  const estado: EstadoPermisoCamara =
    permission === null
      ? 'cargando'
      : permission.granted
      ? 'concedido'
      : permission.status === 'denied'
      ? 'denegado'
      : 'indeterminado';

  return {
    estado,
    concedido: permission?.granted ?? false,
    puedeVolverAPreguntar: permission?.canAskAgain ?? true,
    solicitarPermiso,
    abrirConfiguracion,
  };
}
