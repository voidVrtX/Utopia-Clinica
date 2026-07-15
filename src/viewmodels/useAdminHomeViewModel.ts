import { useCallback, useEffect, useState } from 'react';
import { MedicosController } from '../controllers/MedicosController';
import { CitasController } from '../controllers/CitasController';
import { AvisosController } from '../controllers/AvisosController';
import { Aviso } from '../models/Aviso';

export function useAdminHomeViewModel() {
  const [totalMedicos, setTotalMedicos] = useState(0);
  const [totalCitas, setTotalCitas] = useState(0);
  const [confirmadas, setConfirmadas] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [canceladas, setCanceladas] = useState(0);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const [medicos, citas, avisosAdmin] = await Promise.all([
      MedicosController.listar(),
      CitasController.listarTodas(),
      AvisosController.listarPara('admin'),
    ]);
    setTotalMedicos(medicos.length);
    setTotalCitas(citas.length);
    setConfirmadas(citas.filter((c) => c.estado === 'Confirmada' || c.estado === 'Completada').length);
    setPendientes(citas.filter((c) => c.estado === 'Pendiente' || c.estado === 'En sala de espera').length);
    setCanceladas(citas.filter((c) => c.estado === 'Cancelada').length);
    setAvisos(avisosAdmin);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { totalMedicos, totalCitas, confirmadas, pendientes, canceladas, avisos, cargando, recargar: cargar };
}
