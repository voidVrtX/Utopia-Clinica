import { useCallback, useEffect, useState } from 'react';
import { Medico } from '../models/User';
import { MedicosController } from '../controllers/MedicosController';
import { Cita } from '../models/Cita';
import { CitasController } from '../controllers/CitasController';
import { AuthController } from '../controllers/AuthController';

export function useAdminMedicosViewModel() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [query, setQuery] = useState('');
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

  const filtrados = query.trim()
    ? medicos.filter(
        (m) => m.nombre.toLowerCase().includes(query.toLowerCase()) || m.especialidad.toLowerCase().includes(query.toLowerCase())
      )
    : medicos;

  const toggleActivo = async (id: string, activo: boolean) => {
    await MedicosController.establecerActivo(id, !activo);
    cargar();
  };

  const crearMedico = async (data: {
    nombre: string;
    especialidad: string;
    institucion?: string;
    aniosExperiencia?: string;
    sobreElMedico?: string;
    ubicacionAtencion?: string;
    telefono?: string;
    email: string;
  }) => {
    // Generar contraseña aleatoria segura (8 caracteres alfanuméricos)
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-2);
    await AuthController.crearMedico({
      email: data.email,
      password: generatedPassword,
      nombre: data.nombre,
      especialidad: data.especialidad,
      institucion: data.institucion,
      aniosExperiencia: data.aniosExperiencia,
      sobreElMedico: data.sobreElMedico,
      ubicacionAtencion: data.ubicacionAtencion,
      telefono: data.telefono,
      activo: true,
      areasEspecialidad: [],
    });
    cargar();
  };

  return { medicos: filtrados, query, setQuery, cargando, recargar: cargar, toggleActivo, crearMedico };
}

export function useAdminCitasViewModel() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const [c, m] = await Promise.all([CitasController.listarTodas(), MedicosController.listar()]);
    setCitas(c.sort((a, b) => (a.fechaISO + a.hora < b.fechaISO + b.hora ? 1 : -1)));
    setMedicos(m);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const nombreMedico = (id: string) => medicos.find((m) => m.id === id)?.nombre ?? 'Médico';
  const espMedico = (id: string) => medicos.find((m) => m.id === id)?.especialidad ?? '';

  return { citas, cargando, recargar: cargar, nombreMedico, espMedico };
}
