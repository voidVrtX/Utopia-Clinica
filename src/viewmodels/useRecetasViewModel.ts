import { useCallback, useEffect, useState } from 'react';
import { Receta } from '../models/Receta';
import { RecetasController } from '../controllers/RecetasController';
import { useSession } from '../context/SessionContext';

export function useRecetasViewModel() {
  const { usuario } = useSession();
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    const data = await RecetasController.listarPorPaciente(usuario.id);
    setRecetas(data);
    setCargando(false);
  }, [usuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { recetas, cargando, recargar: cargar };
}
