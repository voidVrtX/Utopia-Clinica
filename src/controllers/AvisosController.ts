import { db } from '../services/mockDatabase';
import { Aviso } from '../models/Aviso';
import { uid } from '../utils/helpers';

export const AvisosController = {
  async listarPara(userId: string): Promise<Aviso[]> {
    const avisos = await db.getAvisos();
    return avisos
      .filter((a) => a.paraUserId === userId)
      .sort((a, b) => (a.fechaISO < b.fechaISO ? 1 : -1));
  },

  async crear(input: Omit<Aviso, 'id' | 'leido'>): Promise<Aviso> {
    const avisos = await db.getAvisos();
    const nuevo: Aviso = { ...input, id: uid('av-'), leido: false };
    await db.saveAvisos([...avisos, nuevo]);
    return nuevo;
  },

  async limpiarTodos(userId: string): Promise<void> {
    const avisos = await db.getAvisos();
    await db.saveAvisos(avisos.filter((a) => a.paraUserId !== userId));
  },
};
