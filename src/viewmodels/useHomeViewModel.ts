import { useCallback, useEffect, useState } from 'react';
import { Medico } from '../models/User';
import { MedicosController } from '../controllers/MedicosController';

export function useHomeViewModel() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [especialidadFiltro, setEspecialidadFiltro] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const [m, e] = await Promise.all([MedicosController.listar(), MedicosController.especialidades()]);
    setMedicos(m.filter((x) => x.activo));
    setEspecialidades(e);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const medicosFiltrados = especialidadFiltro
    ? medicos.filter((m) => m.especialidad === especialidadFiltro)
    : medicos;

  return { medicos: medicosFiltrados, especialidades, especialidadFiltro, setEspecialidadFiltro, cargando, recargar: cargar };
}
