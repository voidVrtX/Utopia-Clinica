import { useCallback, useEffect, useState } from 'react';
import { Cita } from '../models/Cita';
import { CitasController } from '../controllers/CitasController';
import { useSession } from '../context/SessionContext';

export function useHistorialViewModel() {
  const { usuario } = useSession();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    const data = await CitasController.listarPorPaciente(usuario.id);
    setCitas(data);
    setCargando(false);
  }, [usuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const proximas = citas.filter((c) => c.estado === 'Confirmada' || c.estado === 'Pendiente');
  const historial = citas.filter((c) => c.estado === 'Completada' || c.estado === 'Cancelada');

  return { proximas, historial, cargando, recargar: cargar };
}
