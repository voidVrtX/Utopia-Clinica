export interface Receta {
  id: string;
  codigoQR: string; // payload único codificado en el QR
  pacienteId: string;
  medicoId: string;
  citaId?: string;
  fecha: string;
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
  presionArterial?: string;
  temperatura?: string;
  valida: boolean; // false cuando farmacia la invalida
  invalidadaEn?: string;
  invalidadaPor?: string; // id de usuario de farmacia
}
