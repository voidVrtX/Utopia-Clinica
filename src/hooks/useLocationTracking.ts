import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { CLINICA } from '../theme/theme';
import { haversineKm } from '../utils/distance';

export type EstadoPermisoUbicacion = 'indeterminado' | 'solicitando' | 'concedido' | 'denegado';

export interface UbicacionActual {
  latitud: number;
  longitud: number;
  direccion: string | null;
  codigoPostal: string | null;
  distanciaKm: number;
  actualizadoEn: Date;
}

export interface UseLocationTrackingResult {
  estadoPermiso: EstadoPermisoUbicacion;
  puedeVolverAPreguntar: boolean;
  ubicacion: UbicacionActual | null;
  error: string | null;
  actualizando: boolean;
  solicitarPermiso: () => Promise<void>;
  abrirConfiguracion: () => void;
  actualizarAhora: () => Promise<void>;
}

/**
 * Solicita permiso de ubicación foreground y mantiene la posición del
 * dispositivo actualizada en tiempo real (expo-location watchPositionAsync)
 * mientras el componente que usa el hook permanezca montado.
 */
export function useLocationTracking(): UseLocationTrackingResult {
  const [estadoPermiso, setEstadoPermiso] = useState<EstadoPermisoUbicacion>('indeterminado');
  const [puedeVolverAPreguntar, setPuedeVolverAPreguntar] = useState(true);
  const [ubicacion, setUbicacion] = useState<UbicacionActual | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actualizando, setActualizando] = useState(false);
  const subscripcionRef = useRef<Location.LocationSubscription | null>(null);

  const procesarPosicion = useCallback(async (pos: Location.LocationObject) => {
    const { latitude, longitude } = pos.coords;
    const distanciaKm = haversineKm(latitude, longitude, CLINICA.latitude, CLINICA.longitude);

    let direccion: string | null = null;
    let codigoPostal: string | null = null;
    // En web, expo-location no tiene geocodificación inversa propia (la API que
    // usaba fue retirada por Google) y siempre lanza error: se omite para no
    // generar ruido en consola y solo se muestran coordenadas + distancia.
    if (Platform.OS !== 'web') {
      try {
        const [lugar] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (lugar) {
          direccion =
            [lugar.street, lugar.city ?? lugar.district ?? lugar.subregion].filter(Boolean).join(', ') ||
            null;
          codigoPostal = lugar.postalCode ?? null;
        }
      } catch {
        // Si falla la geocodificación inversa se conservan solo coordenadas y distancia.
      }
    }

    setUbicacion({ latitud: latitude, longitud: longitude, direccion, codigoPostal, distanciaKm, actualizadoEn: new Date() });
    setError(null);
  }, []);

  const iniciarSeguimiento = useCallback(async () => {
    subscripcionRef.current?.remove();
    try {
      // Lectura inmediata: no esperar al primer evento de watchPositionAsync,
      // que en algunos dispositivos tarda varios segundos en llegar.
      const inicial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      await procesarPosicion(inicial);

      subscripcionRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        procesarPosicion
      );
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo iniciar el seguimiento de ubicación.');
    }
  }, [procesarPosicion]);

  const solicitarPermiso = useCallback(async () => {
    setEstadoPermiso('solicitando');
    const res = await Location.requestForegroundPermissionsAsync();
    setPuedeVolverAPreguntar(res.canAskAgain);
    if (res.status === 'granted') {
      setEstadoPermiso('concedido');
      setError(null);
      await iniciarSeguimiento();
    } else {
      setEstadoPermiso('denegado');
      setError('Permiso de ubicación denegado.');
    }
  }, [iniciarSeguimiento]);

  const abrirConfiguracion = useCallback(() => {
    Linking.openSettings();
  }, []);

  const actualizarAhora = useCallback(async () => {
    if (estadoPermiso !== 'concedido') return;
    setActualizando(true);
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      await procesarPosicion(pos);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo actualizar la ubicación.');
    } finally {
      setActualizando(false);
    }
  }, [estadoPermiso, procesarPosicion]);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const actual = await Location.getForegroundPermissionsAsync();
      if (!vivo) return;
      if (actual.status === 'granted') {
        setEstadoPermiso('concedido');
        await iniciarSeguimiento();
      } else {
        setPuedeVolverAPreguntar(actual.canAskAgain);
        await solicitarPermiso();
      }
    })();

    return () => {
      vivo = false;
      subscripcionRef.current?.remove();
      subscripcionRef.current = null;
    };
    // Solo debe ejecutarse una vez al montar: inicia el permiso + tracking en tiempo real.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    estadoPermiso,
    puedeVolverAPreguntar,
    ubicacion,
    error,
    actualizando,
    solicitarPermiso,
    abrirConfiguracion,
    actualizarAhora,
  };
}
