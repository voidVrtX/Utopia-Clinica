import { useState } from 'react';
import { Receta } from '../models/Receta';
import { RecetasController } from '../controllers/RecetasController';
import { useSession } from '../context/SessionContext';

export function useFarmaciaViewModel() {
  const { usuario } = useSession();
  const [receta, setReceta] = useState<Receta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  const escanear = async (codigoQR: string) => {
    setProcesando(true);
    setError(null);
    const encontrada = await RecetasController.obtenerPorCodigo(codigoQR);
    if (!encontrada) {
      setError('Código QR no reconocido. No corresponde a una receta de Utopía.');
      setReceta(null);
      setProcesando(false);
      return;
    }
    if (!encontrada.valida) {
      setError('Esta receta ya fue utilizada anteriormente.');
      setReceta(encontrada);
      setProcesando(false);
      return;
    }
    setReceta(encontrada);
    setProcesando(false);
  };

  const invalidar = async () => {
    if (!receta || !usuario) return;
    setProcesando(true);
    const res = await RecetasController.invalidarPorCodigo(receta.codigoQR, usuario.id);
    if (res.receta) setReceta(res.receta);
    if (res.error) setError(res.error);
    setProcesando(false);
  };

  const reiniciar = () => {
    setReceta(null);
    setError(null);
  };

  return { receta, error, procesando, escanear, invalidar, reiniciar };
}
