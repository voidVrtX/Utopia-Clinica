import { db } from '../services/mockDatabase';
import { Cita, EstadoCita } from '../models/Cita';
import { uid } from '../utils/helpers';

export const CitasController = {
  async listarPorPaciente(pacienteId: string): Promise<Cita[]> {
    const citas = await db.getCitas();
    return citas
      .filter((c) => c.pacienteId === pacienteId)
      .sort((a, b) => (a.fechaISO + a.hora).localeCompare(b.fechaISO + b.hora));
  },

  async listarPorMedicoYFecha(medicoId: string, fechaISO: string): Promise<Cita[]> {
    const citas = await db.getCitas();
    return citas
      .filter((c) => c.medicoId === medicoId && c.fechaISO === fechaISO)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  },

  async listarPorMedico(medicoId: string): Promise<Cita[]> {
    const citas = await db.getCitas();
    return citas.filter((c) => c.medicoId === medicoId);
  },

  async listarTodas(): Promise<Cita[]> {
    return db.getCitas();
  },

  async obtener(id: string): Promise<Cita | null> {
    const citas = await db.getCitas();
    return citas.find((c) => c.id === id) ?? null;
  },

  async agendar(input: {
    pacienteId: string;
    medicoId: string;
    especialidad: string;
    fechaISO: string;
    hora: string;
    motivo?: string;
  }): Promise<Cita> {
    const citas = await db.getCitas();
    const nueva: Cita = {
      id: uid('cita-'),
      pacienteId: input.pacienteId,
      medicoId: input.medicoId,
      especialidad: input.especialidad,
      fechaISO: input.fechaISO,
      hora: input.hora,
      motivo: input.motivo,
      estado: 'Confirmada',
      createdAt: new Date().toISOString(),
    };
    await db.saveCitas([...citas, nueva]);
    return nueva;
  },

  async modificar(
    id: string,
    cambios: Partial<Pick<Cita, 'fechaISO' | 'hora' | 'motivo'>>
  ): Promise<Cita | null> {
    const citas = await db.getCitas();
    const idx = citas.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    citas[idx] = { ...citas[idx], ...cambios };
    await db.saveCitas(citas);
    return citas[idx];
  },

  async cambiarEstado(id: string, estado: EstadoCita): Promise<Cita | null> {
    const citas = await db.getCitas();
    const idx = citas.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    citas[idx] = { ...citas[idx], estado };
    await db.saveCitas(citas);
    return citas[idx];
  },

  async cancelar(id: string): Promise<Cita | null> {
    return this.cambiarEstado(id, 'Cancelada');
  },
};
