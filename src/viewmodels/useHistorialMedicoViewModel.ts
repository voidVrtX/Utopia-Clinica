import { useCallback, useEffect, useState } from 'react';
import { Cita } from '../models/Cita';
import { CitasController } from '../controllers/CitasController';
import { RecetasController } from '../controllers/RecetasController';
import { useSession } from '../context/SessionContext';
import { MedicamentoReceta } from '../models/Medicamento';

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
  const [presionSistolica, setPresionSistolica] = useState('');
  const [presionDiastolica, setPresionDiastolica] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [medicamentos, setMedicamentos] = useState<MedicamentoReceta[]>([]);
  const [nuevoMedicamentoNombre, setNuevoMedicamentoNombre] = useState('');
  const [nuevoMedicamentoDosis, setNuevoMedicamentoDosis] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    CitasController.obtener(citaId).then(setCita);
  }, [citaId]);

  const agregarMedicamento = () => {
    const nombre = nuevoMedicamentoNombre.trim();
    const dosis = nuevoMedicamentoDosis.trim();
    if (!nombre || !dosis) return;

    setMedicamentos((prev) => [
      ...prev,
      {
        id: `med-${Date.now().toString(36)}-${prev.length}`,
        nombre,
        dosis,
        entregado: false,
        agotado: false,
      },
    ]);
    setNuevoMedicamentoNombre('');
    setNuevoMedicamentoDosis('');
  };

  const quitarMedicamento = (id: string) => {
    setMedicamentos((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarMedicamento = (id: string, cambios: Partial<MedicamentoReceta>) => {
    setMedicamentos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...cambios } : item))
    );
  };

  const guardar = async (onOk: () => void) => {
    if (!cita || !usuario) return;
    setEnviando(true);
    const presionArterial = presionSistolica && presionDiastolica ? `${presionSistolica}/${presionDiastolica} mmHg` : '';
    await RecetasController.crear({
      pacienteId: cita.pacienteId,
      medicoId: usuario.id,
      citaId: cita.id,
      fecha: cita.fechaISO,
      diagnostico,
      tratamiento,
      observaciones,
      presionArterial,
      temperatura: temperatura ? `${temperatura} °C` : '',
      medicamentos,
    });
    await CitasController.cambiarEstado(cita.id, 'Completada');
    setEnviando(false);
    onOk();
  };

  return {
    cita,
    diagnostico,
    setDiagnostico,
    tratamiento,
    setTratamiento,
    observaciones,
    setObservaciones,
    presionSistolica,
    setPresionSistolica,
    presionDiastolica,
    setPresionDiastolica,
    temperatura,
    setTemperatura,
    medicamentos,
    nuevoMedicamentoNombre,
    setNuevoMedicamentoNombre,
    nuevoMedicamentoDosis,
    setNuevoMedicamentoDosis,
    agregarMedicamento,
    quitarMedicamento,
    actualizarMedicamento,
    enviando,
    guardar,
  };
}
