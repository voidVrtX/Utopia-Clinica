import { useCallback, useEffect, useState } from 'react';
import { Cita } from '../models/Cita';
import { CitasController } from '../controllers/CitasController';
import { RecetasController } from '../controllers/RecetasController';
import { useSession } from '../context/SessionContext';

export function useHistorialMedicoViewModel() {
  const { usuario } = useSession();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    const data = await CitasController.listarPorMedico(usuario.id);
    setCitas(data.sort((a, b) => (a.fechaISO + a.hora < b.fechaISO + b.hora ? 1 : -1)));
    setCargando(false);
  }, [usuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const proximas = citas.filter((c) => c.estado === 'Confirmada' || c.estado === 'Pendiente' || c.estado === 'En sala de espera');

  return { citas, proximas, cargando, recargar: cargar };
}

export function useCrearRecetaViewModel(citaId: string) {
  const { usuario } = useSession();
  const [cita, setCita] = useState<Cita | null>(null);
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [presionArterial, setPresionArterial] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    CitasController.obtener(citaId).then(setCita);
  }, [citaId]);

  const guardar = async (onOk: () => void) => {
    if (!cita || !usuario) return;
    setEnviando(true);
    await RecetasController.crear({
      pacienteId: cita.pacienteId,
      medicoId: usuario.id,
      citaId: cita.id,
      fecha: cita.fechaISO,
      diagnostico,
      tratamiento,
      observaciones,
      presionArterial,
      temperatura,
    });
    await CitasController.cambiarEstado(cita.id, 'Completada');
    setEnviando(false);
    onOk();
  };

  return {
    cita, diagnostico, setDiagnostico, tratamiento, setTratamiento,
    observaciones, setObservaciones, presionArterial, setPresionArterial,
    temperatura, setTemperatura, enviando, guardar,
  };
}
