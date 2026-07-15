import { apiClient } from '../services/apiClient';
import { MedicamentoCatalogo } from '../models/Medicamento';

export const MedicamentosController = {
  async buscar(q: string): Promise<MedicamentoCatalogo[]> {
    const query = q ? `?q=${encodeURIComponent(q)}` : '';
    return apiClient.get<MedicamentoCatalogo[]>(`/medicamentos-catalogo${query}`);
  },
};
