export type TipoAviso = 'Cita Confirmada' | 'Recordatorio' | 'Cita Modificada' | 'Cita Cancelada' | 'Correo Enviado' | 'Mantenimiento programado';

export interface Aviso {
  id: string;
  paraUserId: string; // 'admin' para avisos globales del admin
  tipo: TipoAviso;
  titulo: string;
  detalle?: string;
  fechaISO: string;
  hora?: string;
  leido: boolean;
}
