import { useCallback, useEffect, useState } from 'react';
import { Cita } from '../models/Cita';
import { CitasController } from '../controllers/CitasController';
import { AvisosController } from '../controllers/AvisosController';
import { useSession } from '../context/SessionContext';

export type FiltroCitas = 'Todas' | 'Próximas' | 'Completadas' | 'Canceladas';

export function useMisCitasViewModel() {
  const { usuario } = useSession();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [filtro, setFiltro] = useState<FiltroCitas>('Todas');
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

  const filtradas = citas.filter((c) => {
    if (filtro === 'Todas') return true;
    if (filtro === 'Próximas') return c.estado === 'Confirmada' || c.estado === 'Pendiente';
    if (filtro === 'Completadas') return c.estado === 'Completada';
    if (filtro === 'Canceladas') return c.estado === 'Cancelada';
    return true;
  });

  return { citas: filtradas, filtro, setFiltro, cargando, recargar: cargar };
}

export function useAgendarCitaViewModel() {
  const { usuario } = useSession();
  const [medicoId, setMedicoId] = useState<string | null>(null);
  const [especialidad, setEspecialidad] = useState<string | null>(null);
  const [fechaISO, setFechaISO] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const HORARIOS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];

  const agendar = async (onOk: (citaId: string) => void) => {
    if (!usuario) return;
    if (!especialidad || !fechaISO || !hora) {
      setError('Selecciona especialidad, fecha y horario.');
      return;
    }
    setError(null);
    setEnviando(true);
    const cita = await CitasController.agendar({
      pacienteId: usuario.id,
      medicoId: medicoId ?? 'medico-1',
      especialidad,
      fechaISO,
      hora,
      motivo: motivo.trim() || undefined,
    });
    await AvisosController.crear({
      paraUserId: usuario.id,
      tipo: 'Cita Confirmada',
      titulo: 'Cita Confirmada',
      detalle: `Tu cita de ${especialidad} ha sido agendada.`,
      fechaISO: new Date().toISOString().slice(0, 10),
    });
    setEnviando(false);
    onOk(cita.id);
  };

  return {
    medicoId, setMedicoId,
    especialidad, setEspecialidad,
    fechaISO, setFechaISO,
    hora, setHora,
    motivo, setMotivo,
    HORARIOS,
    enviando, error,
    agendar,
  };
}

export function useDetalleCitaViewModel(citaId: string) {
  const { usuario } = useSession();
  const [cita, setCita] = useState<Cita | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const data = await CitasController.obtener(citaId);
    setCita(data);
    setCargando(false);
  }, [citaId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cancelar = async (motivo: string) => {
    if (!cita) return;
    await CitasController.cancelar(cita.id);
    if (usuario) {
      await AvisosController.crear({
        paraUserId: usuario.id,
        tipo: 'Cita Cancelada',
        titulo: 'Cita Cancelada',
        detalle: motivo || 'Cita cancelada por el paciente.',
        fechaISO: new Date().toISOString().slice(0, 10),
      });
    }
  };

  return { cita, cargando, recargar: cargar, cancelar };
}

export function useModificarCitaViewModel(citaId: string) {
  const { usuario } = useSession();
  const [cita, setCita] = useState<Cita | null>(null);
  const [fechaISO, setFechaISO] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const HORARIOS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];

  useEffect(() => {
    (async () => {
      const data = await CitasController.obtener(citaId);
      setCita(data);
      if (data) {
        setFechaISO(data.fechaISO);
        setHora(data.hora);
        setMotivo(data.motivo ?? '');
      }
    })();
  }, [citaId]);

  const guardar = async (onOk: () => void) => {
    if (!fechaISO || !hora) return;
    setEnviando(true);
    await CitasController.modificar(citaId, { fechaISO, hora, motivo: motivo.trim() || undefined });
    if (usuario) {
      await AvisosController.crear({
        paraUserId: usuario.id,
        tipo: 'Cita Modificada',
        titulo: 'Cita Modificada',
        detalle: 'Tu cita fue modificada correctamente.',
        fechaISO: new Date().toISOString().slice(0, 10),
      });
    }
    setEnviando(false);
    onOk();
  };

  return { cita, fechaISO, setFechaISO, hora, setHora, motivo, setMotivo, HORARIOS, enviando, guardar };
}
