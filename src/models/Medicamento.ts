export interface MedicamentoCatalogo {
  id: string;
  nombre: string;
  principioActivo?: string;
  presentacion?: string;
}

export interface MedicamentoReceta {
  id: string;
  medicamentoId?: string;
  nombre: string;
  dosis: string;
  entregado: boolean;
  agotado: boolean;
}
