import { apiClient } from '../services/apiClient';
import { Aviso } from '../models/Aviso';

export const AvisosController = {
  async listarPara(userId: string): Promise<Aviso[]> {
    const avisos = await apiClient.get<Aviso[]>(`/avisos?paraUserId=${encodeURIComponent(userId)}`);
    return avisos.sort((a, b) => (a.fechaISO < b.fechaISO ? 1 : -1));
  },

  async crear(input: Omit<Aviso, 'id' | 'leido'>): Promise<Aviso> {
    return apiClient.post<Aviso>('/avisos', input);
  },

  async limpiarTodos(userId: string): Promise<void> {
    await apiClient.delete<void>(`/avisos?paraUserId=${encodeURIComponent(userId)}`);
  },
};
