import { useCallback, useEffect, useState } from 'react';
import { Aviso } from '../models/Aviso';
import { AvisosController } from '../controllers/AvisosController';

export function useAvisosViewModel(userId: string | null) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!userId) return;
    setCargando(true);
    const data = await AvisosController.listarPara(userId);
    setAvisos(data);
    setCargando(false);
  }, [userId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const limpiarTodo = async () => {
    if (!userId) return;
    await AvisosController.limpiarTodos(userId);
    setAvisos([]);
  };

  const hoy = new Date().toISOString().slice(0, 10);
  const avisosHoy = avisos.filter((a) => a.fechaISO === hoy);
  const avisosAnteriores = avisos.filter((a) => a.fechaISO !== hoy);

  return { avisos, avisosHoy, avisosAnteriores, cargando, recargar: cargar, limpiarTodo };
}
