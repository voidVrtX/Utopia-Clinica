import { getItem, setItem, STORAGE_KEYS } from './storage';
import { AnyUser, Medico, Paciente } from '../models/User';
import { Cita } from '../models/Cita';
import { Receta } from '../models/Receta';
import { Aviso } from '../models/Aviso';
import { uid } from '../utils/helpers';

const PWD = 'Utopia123';

async function seedIfNeeded() {
  const seeded = await getItem<boolean>(STORAGE_KEYS.SEEDED);
  if (seeded) return;

  const users: AnyUser[] = [
    {
      id: 'admin-1',
      email: 'arlette_admin@utopia.com',
      password: PWD,
      role: 'admin',
      nombre: 'Arlette Domínguez',
    },
    {
      id: 'farmacia-1',
      email: 'adan_farmacia@utopia.com',
      password: PWD,
      role: 'farmacia',
      nombre: 'Adán Ramírez',
    },
    {
      id: 'medico-1',
      email: 'tovar_medico@utopia.com',
      password: PWD,
      role: 'medico',
      nombre: 'Dr. Arturo Tovar',
      especialidad: 'Cardiología',
      institucion: 'Utopía Clínica',
      aniosExperiencia: '12 años',
      sobreElMedico:
        'Médico especialista en cardiología con amplia experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares.',
      areasEspecialidad: ['Hipertensión', 'Enfermedades del corazón'],
      ubicacionAtencion: 'Av. Insurgentes Sur 1234 Col. del Valle',
      activo: true,
      valoracion: 4.8,
      numOpiniones: 128,
      telefono: '55 1234 5678',
      fechaNacimiento: '10/03/1984',
      sexo: 'Masculino',
    } as Medico,
    {
      id: 'medico-2',
      email: 'carmen.lopez@utopia.com',
      password: PWD,
      role: 'medico',
      nombre: 'Dra. Carmen López',
      especialidad: 'Pediatría',
      institucion: 'Utopía Clínica',
      aniosExperiencia: '8 años',
      sobreElMedico: 'Especialista en pediatría, enfocada en el desarrollo integral de niñas y niños.',
      areasEspecialidad: ['Control de niño sano', 'Vacunación'],
      ubicacionAtencion: 'Av. Insurgentes Sur 1234 Col. del Valle',
      activo: true,
      valoracion: 4.9,
      numOpiniones: 96,
      telefono: '55 2233 4455',
      fechaNacimiento: '02/07/1990',
      sexo: 'Femenino',
    } as Medico,
    {
      id: 'medico-3',
      email: 'sofia.ramirez@utopia.com',
      password: PWD,
      role: 'medico',
      nombre: 'Dra. Sofía Ramírez',
      especialidad: 'Neurología',
      activo: false,
      valoracion: 4.6,
      numOpiniones: 54,
      telefono: '55 3344 5566',
    } as Medico,
    {
      id: 'medico-4',
      email: 'andres.martinez@utopia.com',
      password: PWD,
      role: 'medico',
      nombre: 'Dr. Andrés Martínez',
      especialidad: 'Dermatología',
      activo: true,
      valoracion: 4.7,
      numOpiniones: 72,
    } as Medico,
    {
      id: 'paciente-1',
      email: 'osbaldo_paciente@utopia.com',
      password: PWD,
      role: 'paciente',
      nombre: 'Osbaldo Venegas',
      fechaNacimiento: '25/08/2003',
      sexo: 'Masculino',
      telefono: '55 1234 5678',
      direccion: '16 de septiembre 123, Toluca',
      seguroMedico: '12345566789',
      contactoEmergencia: {
        nombreCompleto: 'María Venegas',
        parentesco: 'Madre',
        telefono: '55 9988 7766',
      },
    } as Paciente,
    {
      id: 'paciente-2',
      email: 'pedro.venegas@ejemplo.com',
      password: PWD,
      role: 'paciente',
      nombre: 'Pedro Venegas',
      fechaNacimiento: '25/08/1984',
      sexo: 'Masculino',
      telefono: '55 1234 5678',
    } as Paciente,
  ];

  const citas: Cita[] = [
    {
      id: uid('cita-'),
      pacienteId: 'paciente-1',
      medicoId: 'medico-2',
      fechaISO: '2026-06-12',
      hora: '10:30',
      especialidad: 'Cardiología',
      estado: 'Confirmada',
      motivo: 'Control de rutina',
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('cita-'),
      pacienteId: 'paciente-1',
      medicoId: 'medico-2',
      fechaISO: '2026-06-15',
      hora: '09:00',
      especialidad: 'Pediatría',
      estado: 'Pendiente',
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('cita-'),
      pacienteId: 'paciente-1',
      medicoId: 'medico-3',
      fechaISO: '2026-06-22',
      hora: '11:00',
      especialidad: 'Neurología',
      estado: 'Pendiente',
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('cita-'),
      pacienteId: 'paciente-1',
      medicoId: 'medico-4',
      fechaISO: '2026-05-03',
      hora: '10:00',
      especialidad: 'Dermatología',
      estado: 'Completada',
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('cita-'),
      pacienteId: 'paciente-2',
      medicoId: 'medico-1',
      fechaISO: '2026-06-10',
      hora: '09:00',
      especialidad: 'Cardiología',
      consultorio: 'Consultorio 1',
      motivo: 'Control de rutina',
      estado: 'Completada',
      notasPaciente: 'Molestia en el pecho al hacer esfuerzo',
      historialRelevante: ['Hipertensión', 'Alergia a la penicilina'],
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('cita-'),
      pacienteId: 'paciente-2',
      medicoId: 'medico-1',
      fechaISO: '2026-06-10',
      hora: '09:30',
      especialidad: 'Cardiología',
      consultorio: 'Consultorio 1',
      motivo: 'Electrocardiograma',
      estado: 'En consulta',
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('cita-'),
      pacienteId: 'paciente-2',
      medicoId: 'medico-1',
      fechaISO: '2026-06-10',
      hora: '10:00',
      especialidad: 'Cardiología',
      consultorio: 'Consultorio 1',
      motivo: 'Consulta inicial',
      estado: 'En sala de espera',
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('cita-'),
      pacienteId: 'paciente-2',
      medicoId: 'medico-1',
      fechaISO: '2026-06-10',
      hora: '10:30',
      especialidad: 'Cardiología',
      consultorio: 'Consultorio 1',
      motivo: 'Seguimiento',
      estado: 'Cancelada',
      createdAt: new Date().toISOString(),
    },
  ];

  const recetas: Receta[] = [
    {
      id: uid('rec-'),
      codigoQR: uid('QR-'),
      pacienteId: 'paciente-1',
      medicoId: 'medico-2',
      fecha: '2026-06-12',
      diagnostico: 'Migraña tensional',
      tratamiento: 'Paracetamol 500mg cada 8h por 3 días. Reposo. Mantener hidratación.',
      observaciones: 'Si el dolor persiste por más de 72 horas o se acompaña de otros síntomas, regresar para valoración.',
      presionArterial: '120/80 mmHg',
      temperatura: '36.7 °C',
      valida: true,
    },
  ];

  const avisos: Aviso[] = [
    {
      id: uid('av-'),
      paraUserId: 'paciente-1',
      tipo: 'Cita Confirmada',
      titulo: 'Cita Confirmada',
      detalle: 'Tu cita de Cardiología ha sido confirmada.',
      fechaISO: new Date().toISOString().slice(0, 10),
      leido: false,
    },
    {
      id: uid('av-'),
      paraUserId: 'paciente-1',
      tipo: 'Recordatorio',
      titulo: 'Recordatorio',
      detalle: 'No olvides tu cita mañana a las 10:30 AM.',
      fechaISO: new Date().toISOString().slice(0, 10),
      leido: false,
    },
    {
      id: uid('av-'),
      paraUserId: 'admin',
      tipo: 'Mantenimiento programado',
      titulo: 'Mantenimiento programado',
      detalle: 'Domingo 16 de junio 2026, 09:50 AM',
      fechaISO: '2026-06-16',
      hora: '09:50 AM',
      leido: false,
    },
    {
      id: uid('av-'),
      paraUserId: 'admin',
      tipo: 'Mantenimiento programado',
      titulo: 'Mantenimiento programado',
      detalle: 'Domingo 25 de junio 2026, 10:15 AM',
      fechaISO: '2026-06-25',
      hora: '10:15 AM',
      leido: false,
    },
  ];

  await setItem(STORAGE_KEYS.USERS, users);
  await setItem(STORAGE_KEYS.CITAS, citas);
  await setItem(STORAGE_KEYS.RECETAS, recetas);
  await setItem(STORAGE_KEYS.AVISOS, avisos);
  await setItem(STORAGE_KEYS.SEEDED, true);
}

export const db = {
  init: seedIfNeeded,

  async getUsers(): Promise<AnyUser[]> {
    return (await getItem<AnyUser[]>(STORAGE_KEYS.USERS)) ?? [];
  },
  async saveUsers(users: AnyUser[]) {
    await setItem(STORAGE_KEYS.USERS, users);
  },
  async getCitas(): Promise<Cita[]> {
    return (await getItem<Cita[]>(STORAGE_KEYS.CITAS)) ?? [];
  },
  async saveCitas(citas: Cita[]) {
    await setItem(STORAGE_KEYS.CITAS, citas);
  },
  async getRecetas(): Promise<Receta[]> {
    return (await getItem<Receta[]>(STORAGE_KEYS.RECETAS)) ?? [];
  },
  async saveRecetas(recetas: Receta[]) {
    await setItem(STORAGE_KEYS.RECETAS, recetas);
  },
  async getAvisos(): Promise<Aviso[]> {
    return (await getItem<Aviso[]>(STORAGE_KEYS.AVISOS)) ?? [];
  },
  async saveAvisos(avisos: Aviso[]) {
    await setItem(STORAGE_KEYS.AVISOS, avisos);
  },
};
