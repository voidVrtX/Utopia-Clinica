import React, { createContext, useContext, useState } from 'react';

export interface RegisterDraft {
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  sexo: 'Masculino' | 'Femenino' | 'Otro' | '';
  fechaNacimiento: string;
  telefono: string;
  contactoNombre: string;
  contactoParentesco: string;
  contactoTelefono: string;
  direccion: string;
  seguroMedico: string;
  tipoSangre: string;
  alergias: string[];
}

const EMPTY: RegisterDraft = {
  email: '',
  password: '',
  confirmPassword: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  sexo: '',
  fechaNacimiento: '',
  telefono: '',
  contactoNombre: '',
  contactoParentesco: '',
  contactoTelefono: '',
  direccion: '',
  seguroMedico: '',
  tipoSangre: '',
  alergias: [],
};

interface Ctx {
  draft: RegisterDraft;
  update: (cambios: Partial<RegisterDraft>) => void;
  reset: () => void;
}

const RegisterDraftContext = createContext<Ctx | undefined>(undefined);

export function RegisterDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<RegisterDraft>(EMPTY);
  const update = (cambios: Partial<RegisterDraft>) => setDraft((d) => ({ ...d, ...cambios }));
  const reset = () => setDraft(EMPTY);
  return <RegisterDraftContext.Provider value={{ draft, update, reset }}>{children}</RegisterDraftContext.Provider>;
}

export function useRegisterDraft(): Ctx {
  const ctx = useContext(RegisterDraftContext);
  if (!ctx) throw new Error('useRegisterDraft debe usarse dentro de RegisterDraftProvider');
  return ctx;
}
