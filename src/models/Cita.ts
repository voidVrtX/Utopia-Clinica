export type EstadoCita =
  | 'Confirmada'
  | 'Pendiente'
  | 'En consulta'
  | 'En sala de espera'
  | 'Completada'
  | 'Cancelada';

export interface Cita {
  id: string;
  pacienteId: string;
  medicoId: string;
  fechaISO: string; // yyyy-mm-dd
  hora: string; // "10:00"
  especialidad: string;
  consultorio?: string;
  motivo?: string;
  estado: EstadoCita;
  notasPaciente?: string;
  historialRelevante?: string[];
  createdAt: string;
}
