import { apiClient } from '../services/apiClient';
import { Paciente } from '../models/User';

export const UsersController = {
  async obtener(id: string): Promise<Paciente | null> {
    try {
      return await apiClient.get<Paciente>(`/users/${id}`);
    } catch {
      return null;
    }
  },
};
