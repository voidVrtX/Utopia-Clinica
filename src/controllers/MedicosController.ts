import { db } from '../services/mockDatabase';
import { Medico } from '../models/User';

export const MedicosController = {
  async listar(): Promise<Medico[]> {
    const users = await db.getUsers();
    return users.filter((u): u is Medico => u.role === 'medico');
  },

  async obtener(id: string): Promise<Medico | null> {
    const medicos = await this.listar();
    return medicos.find((m) => m.id === id) ?? null;
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
    const users = await db.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...cambios } as Medico;
    await db.saveUsers(users);
    return users[idx] as Medico;
  },

  async establecerActivo(id: string, activo: boolean): Promise<void> {
    await this.actualizar(id, { activo });
  },

  async especialidades(): Promise<string[]> {
    const medicos = await this.listar();
    return Array.from(new Set(medicos.map((m) => m.especialidad)));
  },
};
