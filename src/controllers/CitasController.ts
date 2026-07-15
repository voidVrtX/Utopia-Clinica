import { apiClient } from '../services/apiClient';
import { Cita, EstadoCita } from '../models/Cita';

export const CitasController = {
  async listarPorPaciente(pacienteId: string): Promise<Cita[]> {
    const citas = await apiClient.get<Cita[]>(`/citas?pacienteId=${pacienteId}`);
    return citas.sort((a, b) => (a.fechaISO + a.hora).localeCompare(b.fechaISO + b.hora));
  },

  async listarPorMedicoYFecha(medicoId: string, fechaISO: string): Promise<Cita[]> {
    const citas = await apiClient.get<Cita[]>(`/citas?medicoId=${medicoId}&fecha=${fechaISO}`);
    return citas.sort((a, b) => a.hora.localeCompare(b.hora));
  },

  async listarPorMedico(medicoId: string): Promise<Cita[]> {
    return apiClient.get<Cita[]>(`/citas?medicoId=${medicoId}`);
  },

  async listarTodas(): Promise<Cita[]> {
    return apiClient.get<Cita[]>('/citas');
  },

  async obtener(id: string): Promise<Cita | null> {
    try {
      return await apiClient.get<Cita>(`/citas/${id}`);
    } catch {
      return null;
    }
  },

  async agendar(input: {
    pacienteId: string;
    medicoId: string;
    especialidad: string;
    fechaISO: string;
    hora: string;
    motivo?: string;
  }): Promise<Cita> {
    return apiClient.post<Cita>('/citas', { ...input, estado: 'Confirmada' });
  },

  async modificar(
    id: string,
    cambios: Partial<Pick<Cita, 'fechaISO' | 'hora' | 'motivo'>>
  ): Promise<Cita | null> {
    try {
      return await apiClient.patch<Cita>(`/citas/${id}`, cambios);
    } catch {
      return null;
    }
  },

  async cambiarEstado(id: string, estado: EstadoCita): Promise<Cita | null> {
    try {
      return await apiClient.patch<Cita>(`/citas/${id}`, { estado });
    } catch {
      return null;
    }
  },

  async cancelar(id: string): Promise<Cita | null> {
    try {
      return await apiClient.patch<Cita>(`/citas/${id}/cancelar`);
    } catch {
      return null;
    }
  },
};
