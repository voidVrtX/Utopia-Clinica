import { db } from '../services/mockDatabase';
import { Receta } from '../models/Receta';
import { uid } from '../utils/helpers';

export const RecetasController = {
  async listarPorPaciente(pacienteId: string): Promise<Receta[]> {
    const recetas = await db.getRecetas();
    return recetas.filter((r) => r.pacienteId === pacienteId).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  },

  async listarPorMedico(medicoId: string): Promise<Receta[]> {
    const recetas = await db.getRecetas();
    return recetas.filter((r) => r.medicoId === medicoId);
  },

  async obtenerPorCodigo(codigoQR: string): Promise<Receta | null> {
    const recetas = await db.getRecetas();
    return recetas.find((r) => r.codigoQR === codigoQR) ?? null;
  },

  async crear(input: Omit<Receta, 'id' | 'codigoQR' | 'valida'>): Promise<Receta> {
    const recetas = await db.getRecetas();
    const nueva: Receta = {
      ...input,
      id: uid('rec-'),
      codigoQR: uid('UTOPIA-QR-'),
      valida: true,
    };
    await db.saveRecetas([...recetas, nueva]);
    return nueva;
  },

  /** Usado por el rol de farmacia al escanear el código QR con la cámara */
  async invalidarPorCodigo(
    codigoQR: string,
    farmaciaUserId: string
  ): Promise<{ receta: Receta | null; error?: string }> {
    const recetas = await db.getRecetas();
    const idx = recetas.findIndex((r) => r.codigoQR === codigoQR);
    if (idx === -1) return { receta: null, error: 'Código QR no reconocido. No corresponde a una receta de Utopía.' };
    if (!recetas[idx].valida) {
      return { receta: recetas[idx], error: 'Esta receta ya fue utilizada anteriormente.' };
    }
    recetas[idx] = {
      ...recetas[idx],
      valida: false,
      invalidadaEn: new Date().toISOString(),
      invalidadaPor: farmaciaUserId,
    };
    await db.saveRecetas(recetas);
    return { receta: recetas[idx] };
  },
};
