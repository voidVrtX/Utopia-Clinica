import { useCallback, useEffect, useState } from 'react';
import { Cita } from '../models/Cita';
import { CitasController } from '../controllers/CitasController';
import { useSession } from '../context/SessionContext';

const HOY_ISO = '2026-06-10'; // fecha de referencia usada en los datos de ejemplo

export function useMedicoHomeViewModel() {
  const { usuario } = useSession();
  const [citasHoy, setCitasHoy] = useState<Cita[]>([]);
  const [todasCitas, setTodasCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    const todas = await CitasController.listarPorMedico(usuario.id);
    setTodasCitas(todas);
    setCitasHoy(todas.filter((c) => c.fechaISO === HOY_ISO).sort((a, b) => a.hora.localeCompare(b.hora)));
    setCargando(false);
  }, [usuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const resumen = {
    citasHoy: citasHoy.length,
    pendientes: citasHoy.filter((c) => c.estado === 'Pendiente' || c.estado === 'En sala de espera').length,
    enConsulta: citasHoy.filter((c) => c.estado === 'En consulta').length,
    canceladas: citasHoy.filter((c) => c.estado === 'Cancelada').length,
  };

  const proxima = citasHoy.find((c) => c.estado === 'Completada') ? citasHoy[0] : citasHoy[0];
  const pendientesList = citasHoy.filter((c) => c.estado === 'Pendiente' || c.estado === 'En sala de espera');

  return { citasHoy, todasCitas, resumen, proxima, pendientesList, cargando, recargar: cargar, HOY_ISO };
}

export function useAgendaMedicaViewModel() {
  const { usuario } = useSession();
  const [fechaISO, setFechaISO] = useState(HOY_ISO);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    const data = await CitasController.listarPorMedicoYFecha(usuario.id, fechaISO);
    setCitas(data);
    setCargando(false);
  }, [usuario, fechaISO]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const resumen = {
    total: citas.length,
    atendidas: citas.filter((c) => c.estado === 'Completada').length,
    pendientes: citas.filter((c) => c.estado === 'Pendiente' || c.estado === 'En sala de espera').length,
  };

  return { fechaISO, setFechaISO, citas, resumen, cargando, recargar: cargar };
}
