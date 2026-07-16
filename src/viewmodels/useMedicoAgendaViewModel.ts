import { useCallback, useEffect, useState } from 'react';
import { Cita } from '../models/Cita';
import { CitasController } from '../controllers/CitasController';
import { useSession } from '../context/SessionContext';

const FECHA_LIMITE_ISO = '2026-12-31';

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const HOY_ISO = toISODate(new Date());

type VistaAgenda = 'semana' | 'mes';

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(date: Date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  return d;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getRango(selectedDateISO: string, vista: VistaAgenda) {
  const selected = new Date(`${selectedDateISO}T00:00:00`);
  if (vista === 'semana') {
    return {
      inicio: toISODate(startOfWeek(selected)),
      fin: toISODate(endOfWeek(selected)),
    };
  }
  return {
    inicio: toISODate(startOfMonth(selected)),
    fin: toISODate(endOfMonth(selected)),
  };
}

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
  const [selectedDateISO, setSelectedDateISO] = useState(HOY_ISO);
  const [vista, setVista] = useState<VistaAgenda>('semana');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    const todas = await CitasController.listarPorMedico(usuario.id);
    const rango = getRango(selectedDateISO, vista);
    const filtradas = todas
      .filter((c) => c.fechaISO >= rango.inicio && c.fechaISO <= rango.fin && c.fechaISO <= FECHA_LIMITE_ISO)
      .sort((a, b) => (a.fechaISO + a.hora).localeCompare(b.fechaISO + b.hora));
    setCitas(filtradas);
    setCargando(false);
  }, [usuario, selectedDateISO, vista]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const resumen = {
    total: citas.length,
    atendidas: citas.filter((c) => c.estado === 'Completada').length,
    pendientes: citas.filter((c) => c.estado === 'Pendiente' || c.estado === 'En sala de espera').length,
  };

  return {
    selectedDateISO,
    setSelectedDateISO,
    vista,
    setVista,
    citas,
    resumen,
    cargando,
    recargar: cargar,
    fechaLimite: FECHA_LIMITE_ISO,
  };
}
