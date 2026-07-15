import { apiClient } from '../services/apiClient';
import { Medico } from '../models/User';
import { fromISODate, toISODate } from '../utils/dateFormat';

function normalizeMedico(medico: Medico): Medico {
  return { ...medico, fechaNacimiento: fromISODate(medico.fechaNacimiento) };
}

export const MedicosController = {
  async listar(): Promise<Medico[]> {
    const medicos = await apiClient.get<Medico[]>('/medicos');
    return medicos.map(normalizeMedico);
  },

  async obtener(id: string): Promise<Medico | null> {
    try {
      const medico = await apiClient.get<Medico>(`/medicos/${id}`);
      return normalizeMedico(medico);
    } catch {
      return null;
    }
  },

  async buscar(query: string): Promise<Medico[]> {
    const medicos = await this.listar();
    const q = query.trim().toLowerCase();
    if (!q) return medicos;
    return medicos.filter(
      (m) => m.nombre.toLowerCase().includes(q) || m.especialidad.toLowerCase().includes(q)
    );
  },

  async actualizar(id: string, cambios: Partial<Medico>): Promise<Medico | null> {
    try {
      const medico = await apiClient.patch<Medico>(`/medicos/${id}`, {
        ...cambios,
        fechaNacimiento: cambios.fechaNacimiento ? toISODate(cambios.fechaNacimiento) : undefined,
      });
      return normalizeMedico(medico);
    } catch {
      return null;
    }
  },

  async establecerActivo(id: string, activo: boolean): Promise<void> {
    await this.actualizar(id, { activo });
  },

  async especialidades(): Promise<string[]> {
    const medicos = await this.listar();
    return Array.from(new Set(medicos.map((m) => m.especialidad)));
  },
};
