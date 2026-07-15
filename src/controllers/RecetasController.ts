import { apiClient, ApiError } from '../services/apiClient';
import { Receta } from '../models/Receta';

export const RecetasController = {
  async listarPorPaciente(pacienteId: string): Promise<Receta[]> {
    const recetas = await apiClient.get<Receta[]>(`/recetas?pacienteId=${pacienteId}`);
    return recetas.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  },

  async listarPorMedico(medicoId: string): Promise<Receta[]> {
    return apiClient.get<Receta[]>(`/recetas?medicoId=${medicoId}`);
  },

  async obtenerPorCodigo(codigoQR: string): Promise<Receta | null> {
    try {
      return await apiClient.get<Receta>(`/recetas/qr/${encodeURIComponent(codigoQR)}`);
    } catch {
      return null;
    }
  },

  async crear(input: Omit<Receta, 'id' | 'codigoQR' | 'valida'>): Promise<Receta> {
    return apiClient.post<Receta>('/recetas', input);
  },

  /** Usado por el rol de farmacia al escanear el código QR con la cámara */
  async invalidarPorCodigo(
    codigoQR: string,
    _farmaciaUserId: string
  ): Promise<{ receta: Receta | null; error?: string }> {
    const receta = await this.obtenerPorCodigo(codigoQR);
    if (!receta) {
      return { receta: null, error: 'Código QR no reconocido. No corresponde a una receta de Utopía.' };
    }
    if (!receta.valida) {
      return { receta, error: 'Esta receta ya fue utilizada anteriormente.' };
    }

    try {
      const actualizada = await apiClient.patch<Receta>(`/recetas/${receta.id}/invalidar`);
      return { receta: actualizada };
    } catch (e) {
      return {
        receta,
        error: e instanceof ApiError ? e.message : 'No se pudo invalidar la receta.',
      };
    }
  },
};
