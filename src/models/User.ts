export type Role = 'paciente' | 'medico' | 'admin' | 'farmacia';

export interface BaseUser {
  id: string;
  email: string;
  password: string;
  role: Role;
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  telefono?: string;
  fechaNacimiento?: string; // DD/MM/AAAA
  sexo?: 'Masculino' | 'Femenino' | 'Otro';
  direccion?: string;
  seguroMedico?: string;
  avatarColor?: string;
}

export interface Paciente extends BaseUser {
  role: 'paciente';
  tipoSangre?: string;
  alergias?: string[];
  contactoEmergencia?: {
    nombreCompleto: string;
    parentesco: string;
    telefono: string;
  };
}

export interface Medico extends BaseUser {
  role: 'medico';
  especialidad: string;
  institucion?: string;
  aniosExperiencia?: string;
  sobreElMedico?: string;
  areasEspecialidad?: string[];
  ubicacionAtencion?: string;
  activo: boolean;
  valoracion?: number;
  numOpiniones?: number;
}

export interface Admin extends BaseUser {
  role: 'admin';
}

export interface Farmacia extends BaseUser {
  role: 'farmacia';
}

export type AnyUser = Paciente | Medico | Admin | Farmacia;
