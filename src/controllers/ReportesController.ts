import { apiClient } from '../services/apiClient';

export interface CitaReporte {
  id: string;
  fechaISO: string;
  hora: string;
  especialidad: string;
  estado: string;
  motivo: string;
  paciente: string;
  medico: string;
}

export interface PacienteReporte {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  registradoEl: string;
  totalCitas: number;
}

export interface MedicoReporte {
  id: string;
  nombre: string;
  especialidad: string;
  valoracion: number | null;
  numOpiniones: number;
  activo: boolean;
  totalCitas: number;
  completadas: number;
  canceladas: number;
}

export type TipoReporte = 'citas' | 'cancelaciones' | 'pacientes' | 'medicos';

type ReporteData<T extends TipoReporte> = T extends 'pacientes'
  ? PacienteReporte[]
  : T extends 'medicos'
  ? MedicoReporte[]
  : CitaReporte[];

export const ReportesController = {
  async obtener<T extends TipoReporte>(tipo: T): Promise<ReporteData<T>> {
    return apiClient.get<ReporteData<T>>(`/reportes/${tipo}`);
  },
};
