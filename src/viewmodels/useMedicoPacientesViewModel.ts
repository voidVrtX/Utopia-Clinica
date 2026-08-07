import { useCallback, useEffect, useState } from 'react';
import { Paciente } from '../models/User';
import { Cita } from '../models/Cita';
import { CitasController } from '../controllers/CitasController';
import { UsersController } from '../controllers/UsersController';
import { useSession } from '../context/SessionContext';

export function useMedicoPacientesViewModel() {
  const { usuario } = useSession();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    const citasMedico = await CitasController.listarPorMedico(usuario.id);
    setCitas(citasMedico);

    const pacienteIds = Array.from(new Set(citasMedico.map((c) => c.pacienteId)));
    const pacientesData: Paciente[] = [];
    await Promise.all(
      pacienteIds.map(async (pacienteId) => {
        const paciente = await UsersController.obtener(pacienteId);
        if (paciente) pacientesData.push(paciente);
      })
    );

    setPacientes(pacientesData);
    setCargando(false);
  }, [usuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const pacientesOrdenados = [...pacientes].sort((a, b) => a.nombre.localeCompare(b.nombre));

  return { citas, pacientes: pacientesOrdenados, cargando, recargar: cargar };
}

export function useMedicoPacienteDetalleViewModel(pacienteId: string) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [citasCompletadas, setCitasCompletadas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      setCargando(true);
      const pacienteData = await UsersController.obtener(pacienteId);
      setPaciente(pacienteData);
      const citas = await CitasController.listarPorPaciente(pacienteId);
      setCitasCompletadas(citas.filter((c) => c.estado === 'Completada').sort((a, b) => (a.fechaISO + a.hora < b.fechaISO + b.hora ? 1 : -1)));
      setCargando(false);
    })();
  }, [pacienteId]);

  return { paciente, citasCompletadas, cargando };
}
