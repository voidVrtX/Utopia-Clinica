import { useCallback, useEffect, useState } from 'react';
import { Medico } from '../models/User';
import { MedicosController } from '../controllers/MedicosController';

export function useMedicosViewModel() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const data = await MedicosController.listar();
    setMedicos(data);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { medicos, cargando, recargar: cargar };
}

export function useMedicoDetalleViewModel(medicoId: string) {
  const [medico, setMedico] = useState<Medico | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      setCargando(true);
      const data = await MedicosController.obtener(medicoId);
      setMedico(data);
      setCargando(false);
    })();
  }, [medicoId]);

  return { medico, cargando };
}
